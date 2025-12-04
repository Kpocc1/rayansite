import { useDispatch, useSelector } from 'react-redux';
import { Button, Col, Form, Input, Row } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import { setDeliveryModalIsOpen } from 'store/slices/layoutSlice';

const CheckoutFormAddress = () => {
	const dispatch = useDispatch();
	const { address } = useSelector(state => state.layout.deliveryModalData);

	const handleDeliveryModalOpen = e => {
		e.preventDefault();
		dispatch(setDeliveryModalIsOpen(true));
	};

	return (
		<div className='checkout-address-section'>
			<Form.Item
				label='Адрес доставки'
				style={{ marginBottom: address ? '16px' : '0' }}
			>
				{address ? (
					<button
						type='button'
						className='checkout-address-button'
						onClick={handleDeliveryModalOpen}
					>
						<span>{address}</span>
						<img
							src={`${process.env.PUBLIC_URL}/icons/down.svg`}
							alt=''
							className='checkout-address-edit-icon'
						/>
					</button>
				) : (
					<Button
						type='primary'
						icon={<PlusOutlined />}
						onClick={handleDeliveryModalOpen}
						className='checkout-address-add-button'
					>
						Добавьте адрес
					</Button>
				)}
			</Form.Item>
			{address && (
				<Row gutter={12}>
					<Col xs={12} sm={6}>
						<Form.Item name='room' label='Квартира/Офис'>
							<Input className='checkout-address-detail-input' />
						</Form.Item>
					</Col>
					<Col xs={12} sm={6}>
						<Form.Item
							name='entrance'
							label='Подъезд'
							className='checkout-address-item-offset'
						>
							<Input className='checkout-address-detail-input' />
						</Form.Item>
					</Col>
					<Col xs={12} sm={6}>
						<Form.Item
							name='floor'
							label='Этаж'
							className='checkout-address-item-offset'
						>
							<Input className='checkout-address-detail-input' />
						</Form.Item>
					</Col>
					<Col xs={12} sm={6}>
						<Form.Item
							name='intercom'
							label='Домофон'
							className='checkout-address-item-offset'
						>
							<Input className='checkout-address-detail-input' />
						</Form.Item>
					</Col>
				</Row>
			)}
			<Form.Item
				style={{ margin: 0, display: 'none' }}
				name='address_1'
				rules={[{ required: true, message: 'Выберите адрес' }]}
			>
				<Input />
			</Form.Item>
			<Form.Item style={{ display: 'none' }} name='shipping_total'>
				<Input />
			</Form.Item>
		</div>
	);
};

export default CheckoutFormAddress;
