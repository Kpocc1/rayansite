import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Col, Row, Input, Space } from 'antd';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';

import Breadcrumb from 'components/Breadcrumb';
import CheckoutFormSidebar from 'components/cart/CheckoutFormSidebar';
import {
	fetchCartProducts,
	removeFromCart,
	addToCart,
	reduceFromCart,
} from 'store/slices/cartSlice';
import useCustomer from 'hooks/useCustomer';
import { loadingStatus } from 'helpers/fetcher';
import { formatCurrency, formatWeightWithUnit } from 'helpers/formatter';
import useSmartNavigate from 'hooks/useSmartNavigate';
import { getStock } from 'helpers/product';

const { TextArea } = Input;

const Cart = () => {
	const dispatch = useDispatch();
	const { data, status } = useSelector(state => state.cart.cartProducts);
	const { customer } = useCustomer();
	const { navigate } = useSmartNavigate();
	const [comment, setComment] = useState('');
	const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
	const [isCommentFocused, setIsCommentFocused] = useState(false);
	const [showCheckoutForm, setShowCheckoutForm] = useState(false);
	const sortDropdownRef = useRef(null);

	const handleRemoveFromCart = async cart_id => {
		await removeFromCart(cart_id);
		dispatch(fetchCartProducts());
	};

	const handleAddToCart = async (product_id, quantity = 1) => {
		if (!customer.token) {
			return;
		}
		await addToCart(product_id, quantity);
		dispatch(fetchCartProducts());
	};

	const handleReduceFromCart = async product_id => {
		await reduceFromCart(product_id, 1);
		dispatch(fetchCartProducts());
	};

	useEffect(() => {
		dispatch(fetchCartProducts());
	}, [dispatch]);

	if (
		status === loadingStatus.SUCCEEDED &&
		(!data.products || data.products.length === 0)
	) {
		return (
			<div className='region cart-section'>
				<Breadcrumb />
				<h1 className='cart-title'>КОРЗИНА</h1>
				<div className='cart-empty'>
					<p>Корзина пуста</p>
					<Button type='primary' onClick={() => navigate('/catalog')}>
						Перейти в каталог
					</Button>
				</div>
			</div>
		);
	}

	const inStockCount =
		data.products?.filter(item => {
			const stock = getStock(item);
			return stock.quantity > 0 || stock.stock > 0;
		}).length || 0;

	// Извлекаем числовое значение из item.total (может быть строкой с пробелами или числом)
	const extractNumericValue = value => {
		if (!value && value !== 0) return 0;
		// Если уже число, возвращаем его
		if (typeof value === 'number') return value;
		// Если строка, извлекаем число (убираем пробелы, символ рубля, заменяем запятую на точку)
		const cleaned = `${value}`
			.replaceAll(' ', '')
			.replaceAll('₽', '')
			.replaceAll(',', '.');
		const num = parseFloat(cleaned);
		return isNaN(num) ? 0 : num;
	};

	const total =
		data.products?.reduce((sum, item) => {
			const itemTotal = extractNumericValue(item.total);
			return sum + itemTotal;
		}, 0) ||
		(data.totals?.find(t => t.code === 'total')?.value
			? extractNumericValue(data.totals.find(t => t.code === 'total').value)
			: 0);
	const discount =
		data.totals?.find(t => t.code === 'total' && t.title?.includes('скидк'))
			?.value || 0;

	return (
		<div className='region'>
			<div
				className='contact-breadcrumb'
				style={{ marginTop: '64px', marginBottom: '24px' }}
			>
				<a
					href='/'
					onClick={e => {
						e.preventDefault();
						navigate('/');
					}}
					className='breadcrumb-link'
				>
					Главная
				</a>
				<span className='breadcrumb-separator breadcrumb-separator-active'></span>
				<span className='breadcrumb-current'>Корзина</span>
			</div>
			<Row gutter={[24, 24]} style={{ alignItems: 'flex-start' }}>
				<Col xs={24} md={16}>
					<div className='cart-header'>
						<h1 className='cart-title'>КОРЗИНА</h1>
						<div className='category-sort-wrapper' ref={sortDropdownRef}>
							<button
								type='button'
								className={`category-sort-button ${
									isSortDropdownOpen ? 'active' : ''
								}`}
								onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
							>
								<span>По добавлению</span>
								<img
									src={`${process.env.PUBLIC_URL}/icons/down.svg`}
									alt='Сортировать'
									className={`category-sort-icon ${
										isSortDropdownOpen ? 'rotated' : ''
									}`}
								/>
							</button>
							{isSortDropdownOpen && (
								<div className='category-sort-dropdown-menu'>
									<div
										className='category-sort-dropdown-item active'
										onClick={() => setIsSortDropdownOpen(false)}
									>
										По добавлению
									</div>
									<div
										className='category-sort-dropdown-item'
										onClick={() => setIsSortDropdownOpen(false)}
									>
										По цене
									</div>
									<div
										className='category-sort-dropdown-item'
										onClick={() => setIsSortDropdownOpen(false)}
									>
										По названию
									</div>
								</div>
							)}
						</div>
					</div>
					{inStockCount > 0 && (
						<p className='cart-in-stock'>
							В наличии:{' '}
							<span className='cart-in-stock-count'>
								{inStockCount}{' '}
								{inStockCount === 1
									? 'товар'
									: inStockCount < 5
									? 'товара'
									: 'товаров'}
							</span>
						</p>
					)}
					<div className='cart-items'>
						{data.products?.map((item, index) => {
							const stock = getStock(item);
							const pricePerKg = item.price || 0;
							const totalPrice = item.total || 0;

							return (
								<div key={item.cart_id || index} className='cart-item'>
									{/* Блок 1: Картинка, название, цена за кг */}
									<div className='cart-item-block-1'>
										<div className='cart-item-image'>
											<img src={item.thumb} alt={item.name} />
										</div>
										<div className='cart-item-info'>
											<h3 className='cart-item-title'>
												{item.name}, {formatWeightWithUnit(item.weight)}
											</h3>
											<p className='cart-item-price-per-kg'>
												Цена за кг: {formatCurrency(pricePerKg)}
											</p>
										</div>
									</div>

									{/* Блок 2: Селектор количества */}
									<div className='cart-item-block-2'>
										<div className='cart-item-quantity'>
											<Space.Compact block>
												<Button
													onClick={() => handleReduceFromCart(item.product_id)}
													type='primary'
													icon={<MinusOutlined />}
												/>
												<Input
													value={`${item.quantity || 1} ${
														item.main_unit || 'кг'
													}`}
													className='cart-quantity-input'
													readOnly
												/>
												<Button
													type='primary'
													icon={<PlusOutlined />}
													disabled={stock.stock <= (item.quantity || 1)}
													onClick={() =>
														handleAddToCart(item.product_id, item.minimum || 1)
													}
												/>
											</Space.Compact>
										</div>
									</div>

									{/* Блок 3: Цена */}
									<div className='cart-item-block-3'>
										<span className='cart-item-total-price'>
											{formatCurrency(totalPrice)}
										</span>
									</div>

									{/* Блок 4: Избранное и корзина */}
									<div className='cart-item-block-4'>
										<button
											className='cart-item-wishlist'
											onClick={() => {
												// TODO: Добавить логику избранного
											}}
										>
											<img
												src={`${process.env.PUBLIC_URL}/icons/icon-heart-cart.svg`}
												alt='Избранное'
											/>
										</button>
										<button
											className='cart-item-remove'
											onClick={() => handleRemoveFromCart(item.cart_id)}
										>
											<img
												src={`${process.env.PUBLIC_URL}/icons/icon-trash-cart.svg`}
												alt='Удалить'
											/>
										</button>
									</div>
								</div>
							);
						})}
					</div>
				</Col>
				<Col xs={24} md={7} style={{ marginLeft: 'auto' }}>
					<div className='cart-sidebar'>
						{!showCheckoutForm ? (
							<>
								<Button
									type='primary'
									size='large'
									block
									className='cart-checkout-button'
									onClick={() => {
										if (!customer.token) {
											// TODO: Показать модалку входа
											return;
										}
										setShowCheckoutForm(true);
									}}
								>
									<span>К оформлению</span>
									<img
										src={`${process.env.PUBLIC_URL}/icons/icon-arrow-right-circle.svg`}
										alt=''
										className='cart-checkout-button-icon'
									/>
								</Button>

								<div className='cart-summary-card'>
									<div className='cart-summary-total'>
										<span className='cart-summary-label'>Итого</span>
										<span className='cart-summary-total-price'>
											{formatCurrency(total)}
										</span>
									</div>

									<div className='cart-summary-row'>
										<span className='cart-summary-label'>Сборка</span>
										<span className='cart-summary-value'>Бесплатно</span>
									</div>

									{discount > 0 && (
										<div className='cart-summary-row'>
											<span className='cart-summary-label'>Скидка</span>
											<span className='cart-summary-value cart-summary-discount'>
												-{formatCurrency(discount)}
											</span>
										</div>
									)}

									<div className='cart-summary-comment contact-form-field contact-form-field-textarea'>
										<TextArea
											placeholder='Комментарий'
											value={comment}
											onChange={e => setComment(e.target.value)}
											onFocus={() => setIsCommentFocused(true)}
											onBlur={() => setIsCommentFocused(false)}
											maxLength={100}
											rows={3}
											className='cart-comment-textarea contact-form-textarea'
										/>
										<label
											className={`contact-form-label ${
												isCommentFocused || comment
													? 'contact-form-label-active'
													: ''
											}`}
										>
											Комментарий
										</label>
										<span className='cart-comment-counter contact-form-counter'>
											{comment.length}/100
										</span>
									</div>
								</div>
							</>
						) : (
							<CheckoutFormSidebar
								customer={customer}
								data={data}
								onBack={() => setShowCheckoutForm(false)}
							/>
						)}
					</div>
				</Col>
			</Row>
		</div>
	);
};

export default Cart;
