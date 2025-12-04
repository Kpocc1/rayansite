import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Form, Input, Radio, Select, Skeleton } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";

import { checkoutSave, checkoutPayment, fetchPaymentMethods, fetchShippingMethods } from "store/slices/cartSlice";
import { setYookassaWidgetModalIsOpen, setYookassaWidgetData, setDeliveryModalIsOpen } from "store/slices/layoutSlice";
import CheckoutFormAddress from "./CheckoutFormAddress";
import CheckoutFormIntervals from "./CheckoutFormIntervals";
import useSmartNavigate from "hooks/useSmartNavigate";
import { loadingStatus } from "helpers/fetcher";
import { formatCurrency } from "helpers/formatter";

// Функция для извлечения числового значения из строки или числа
const extractNumericValue = (value) => {
	if (!value && value !== 0) return 0;
	if (typeof value === 'number') return value;
	// Убираем пробелы, символ рубля, заменяем запятую на точку, убираем все остальные нецифровые символы
	const cleaned = `${value}`
		.replaceAll(" ", "")
		.replaceAll("₽", "")
		.replaceAll(",", ".")
		.replace(/[^\d.]/g, "");
	const num = parseFloat(cleaned);
	return isNaN(num) ? 0 : num;
};

const SHIPPINGS = [
  {code: "mileage.oblast", label: "Курьер"},
  {code: "pickup.pickup", label: "Самовывоз"},
];

const { TextArea } = Input;

const CheckoutFormSidebar = ({ customer, data, onBack }) => {
	const [loading, setLoading] = useState();
	const [currentShippingMethod, setCurrentShippingMethod] = useState();
	const [commentLength, setCommentLength] = useState(0);
	const [isCommentFocused, setIsCommentFocused] = useState(false);
	const dispatch = useDispatch();
	const shippingMethods = useSelector(state => state.cart.shippingMethods);
	const paymentMethods = useSelector(state => state.cart.paymentMethods);
	const { address, costAddress } = useSelector(
		state => state.layout.deliveryModalData
	);
	const { navigate } = useSmartNavigate();
	const [form] = Form.useForm();

	const subTotal = data.totals?.find(t => t.code === 'sub_total')?.text || '';
	const paymentMethodsList = Object.values(
		paymentMethods.data?.payment_methods || {}
	);
	paymentMethodsList.sort((a, b) => a.sort - b.sort);

	const displayYookassaWidget = (confirmationToken, lastOrderId) => {
		dispatch(setYookassaWidgetModalIsOpen(true));
		dispatch(setYookassaWidgetData({ confirmationToken, lastOrderId }));
	};

	const handleCurrentShippingMethod = e => {
		setCurrentShippingMethod(e.target.value);
	};

	const onFinish = async values => {
		setLoading(true);
		const [shippingCode] = values.shipping_method.split('.');

		const shm = {
			...shippingMethods.data.shipping_methods,
			pickup: { title: 'Самовывоз из магазина', sort_order: '1' },
		};

		const saveRes = await checkoutSave({
			...values,
			payment_title:
				paymentMethods.data.payment_methods[values.payment_method].title,
			shipping_title: shm[shippingCode].title,
			room: values.room || '',
			entrance: values.entrance || '',
			intercom: values.intercom || '',
			floor: values.floor || '',
			comment: values.comment || '',
		});

		if (saveRes.payment.action) {
			const confirmRes = await checkoutPayment(saveRes.payment.action);
			if (confirmRes.continue === 'modal') {
				displayYookassaWidget(confirmRes.token, saveRes.payment.order_id);
			} else if (confirmRes.continue === 'redirect') {
				navigate(confirmRes.redirect);
			}
			setLoading(false);
		} else {
			navigate('/checkout/success');
			setLoading(false);
		}
	};

	useEffect(() => {
		dispatch(fetchShippingMethods());
		dispatch(fetchPaymentMethods());
	}, [dispatch]);

	useEffect(() => {
		form.setFieldsValue(customer);
		const initialComment = customer?.comment || '';
		setCommentLength(initialComment.length);
	}, [form, customer]);

	useEffect(() => {
		if (paymentMethodsList.length > 0) {
			form.setFieldsValue({
				payment_method: paymentMethods.data?.code || paymentMethodsList[0].code,
			});
		}
	}, [form, paymentMethods, paymentMethodsList]);

	useEffect(() => {
		if (Object.keys(shippingMethods.data || {}).length > 0) {
			const _val = shippingMethods.data?.code || SHIPPINGS[0].code;
			form.setFieldsValue({ shipping_method: _val });
			setCurrentShippingMethod(_val);
		}
	}, [form, shippingMethods]);

	useEffect(() => {
		if (address && costAddress) {
			form.setFieldsValue({ address_1: address, shipping_total: costAddress });
		}
	}, [form, address, costAddress]);

	const deliveryEnabled =
		shippingMethods?.data?.delivery_enabled !== undefined
			? shippingMethods.data.delivery_enabled
			: true;
	const pickupEnabled =
		shippingMethods?.data?.pickup_enabled !== undefined
			? shippingMethods.data.pickup_enabled
			: true;

	useEffect(() => {
		if (
			!deliveryEnabled &&
			pickupEnabled &&
			currentShippingMethod !== 'pickup.pickup'
		) {
			form.setFieldsValue({ shipping_method: 'pickup.pickup' });
			setCurrentShippingMethod('pickup.pickup');
		}

		if (
			!pickupEnabled &&
			deliveryEnabled &&
			currentShippingMethod !== 'mileage.oblast'
		) {
			form.setFieldsValue({ shipping_method: 'mileage.oblast' });
			setCurrentShippingMethod('mileage.oblast');
		}
	}, [deliveryEnabled, pickupEnabled, currentShippingMethod, form]);

	// Получаем subTotal (сумма товаров без доставки)
	// Используем тот же подход, что и в cart/index.js - суммируем item.total из products
	const subTotalValue = data.products?.reduce((sum, item) => {
		const itemTotal = extractNumericValue(item.total);
		return sum + itemTotal;
	}, 0) || extractNumericValue(data.totals?.find(t => t.code === 'sub_total')?.value || data.totals?.find(t => t.code === 'sub_total')?.text || 0);
	
	// Доставка: используем costAddress если выбран курьер, иначе 0
	const deliveryCost = currentShippingMethod === 'pickup.pickup' ? 0 : (costAddress || 0);
	
	// Итого: subTotal + доставка
	const total = subTotalValue + deliveryCost;

	return (
		<div className="checkout-form-sidebar">
			<Button
				type="text"
				icon={<ArrowLeftOutlined />}
				onClick={onBack}
				className="checkout-form-back-button"
			>
				Назад
			</Button>

			<h2 className="checkout-form-title">Оформление заказа</h2>

			<Form
				form={form}
				name='checkout-form'
				onFinish={onFinish}
				layout='vertical'
			>
				{/* Способ доставки */}
				<div className="checkout-form-section">
					<Form.Item
						name='shipping_method'
						rules={[{ required: true, message: 'Выберите способ доставки' }]}
					>
						<Radio.Group
							onChange={handleCurrentShippingMethod}
							className="checkout-shipping-buttons"
						>
							<Radio.Button
								value={SHIPPINGS[0].code}
								disabled={!deliveryEnabled}
								className="checkout-shipping-button"
							>
								{SHIPPINGS[0].label}
							</Radio.Button>
							<Radio.Button
								value={SHIPPINGS[1].code}
								disabled={!pickupEnabled}
								className="checkout-shipping-button"
							>
								{SHIPPINGS[1].label}
							</Radio.Button>
						</Radio.Group>
					</Form.Item>
				</div>

				{/* Поля ввода */}
				<div className="checkout-form-section">
					<Form.Item name='firstname' label='Имя'>
						<Input placeholder="Имя" />
					</Form.Item>
					<Form.Item
						name='telephone'
						label='Телефон'
						rules={[{ required: true, message: 'Введите номер телефона' }]}
					>
						<Input placeholder="+7 (900) 122 62-42" />
					</Form.Item>
					<Form.Item name='email' label='E-mail'>
						<Input placeholder="Index@index.com" />
					</Form.Item>
					<Form.Item
						noStyle
						shouldUpdate={(prev, current) =>
							prev.shipping_method !== current.shipping_method
						}
					>
						{({ getFieldValue }) =>
							getFieldValue('shipping_method') === SHIPPINGS[0].code && (
								<CheckoutFormAddress />
							)
						}
					</Form.Item>
				</div>

				{/* Комментарий */}
				<div className="checkout-form-section">
					<Form.Item name='comment' label=''>
						<div className="contact-form-field contact-form-field-textarea">
							<TextArea
								placeholder="Комментарий"
								maxLength={100}
								rows={3}
								className="checkout-comment-textarea contact-form-textarea"
								onChange={(e) => {
									setCommentLength(e.target.value.length);
									form.setFieldsValue({ comment: e.target.value });
								}}
								onFocus={() => setIsCommentFocused(true)}
								onBlur={() => setIsCommentFocused(false)}
							/>
							<label
								className={`contact-form-label ${
									isCommentFocused || commentLength > 0
										? 'contact-form-label-active'
										: ''
								}`}
							>
								Комментарий
							</label>
							<span className="checkout-comment-counter contact-form-counter">
								{commentLength}/100
							</span>
						</div>
					</Form.Item>
				</div>

				{/* Способ оплаты */}
				<div className="checkout-form-section">
					<Form.Item
						name='payment_method'
						label='Оплата'
						rules={[{ required: true, message: 'Выберите способ оплаты' }]}
					>
						{paymentMethods.status === loadingStatus.SUCCEEDED ? (
							<Select
								placeholder="Оплата карточкой при получении"
								className="checkout-payment-select"
							>
								{paymentMethodsList.map(p => (
									<Select.Option key={p.code} value={p.code}>
										{p.title}
									</Select.Option>
								))}
							</Select>
						) : (
							<Skeleton.Input active />
						)}
					</Form.Item>
					<Form.Item
						noStyle
						shouldUpdate={(prev, current) =>
							prev.payment_method !== current.payment_method
						}
					>
						{({ getFieldValue }) =>
							getFieldValue('payment_method') === 'cod' && (
								<Form.Item
									name='change_amount'
									label='Подготовить сдачу с суммы'
								>
									<Input placeholder='Например: 5000' />
								</Form.Item>
							)
						}
					</Form.Item>
				</div>

				{/* Дата доставки */}
				<Form.Item
					noStyle
					shouldUpdate={(prev, current) =>
						prev.shipping_method !== current.shipping_method
					}
				>
					{({ getFieldValue }) => {
						const shippingMethod = getFieldValue('shipping_method');
						const isDelivery = shippingMethod === SHIPPINGS[0].code;
						const isPickup = shippingMethod === SHIPPINGS[1].code;
						
						return (isDelivery && deliveryEnabled) || (isPickup && pickupEnabled) ? (
							<CheckoutFormIntervals
								shippingMethods={shippingMethods}
								deliveryEnabled={deliveryEnabled}
								isPickup={isPickup}
							/>
						) : null;
					}}
				</Form.Item>

				{/* Итого */}
				<div className="checkout-form-summary">
					<div className="checkout-summary-row">
						<span className="checkout-summary-label">Доставка</span>
						<span className="checkout-summary-value">
							{currentShippingMethod === 'pickup.pickup' ? 'Бесплатно' : (costAddress ? formatCurrency(costAddress) : '0 ₽')}
						</span>
					</div>
					<div className="checkout-summary-row">
						<span className="checkout-summary-label">Сборка</span>
						<span className="checkout-summary-value">Бесплатно</span>
					</div>
					<div className="checkout-summary-total">
						<span className="checkout-summary-label">Итого</span>
						<span className="checkout-summary-total-price">{formatCurrency(total)}</span>
					</div>
				</div>

				{/* Кнопка оформления */}
				<Form.Item>
					<Button
						type='primary'
						size='large'
						htmlType='submit'
						block
						loading={loading}
						className="checkout-submit-button"
						disabled={
							(!deliveryEnabled &&
								currentShippingMethod === 'mileage.oblast') ||
							(!pickupEnabled && currentShippingMethod === 'pickup.pickup')
						}
					>
						Оформить заказ
						<img
							src={`${process.env.PUBLIC_URL}/icons/icon-arrow-right-circle.svg`}
							alt=""
							className="checkout-submit-button-icon"
						/>
					</Button>
				</Form.Item>
			</Form>
		</div>
	);
};

export default CheckoutFormSidebar;

