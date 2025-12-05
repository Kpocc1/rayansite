import React, { useEffect, useState } from 'react';
import { Input, Form, Button, Skeleton, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { editProfile, fetchProfile } from 'store/slices/customerSlice';
import AccountMenu from 'components/menu/AccountMenu';
import AccountLogoutButton from 'components/menu/AccountMenu/AccountLogoutButton';
import { loadingStatus } from 'helpers/fetcher';
import { setCustomer } from 'helpers/customer';

const rules = [{ required: true, message: 'Обязательное поле' }];

const Profile = () => {
	const [loading, setLoading] = useState(false);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { data, status } = useSelector(state => state.customer.profile);

	const handleFinish = async values => {
		setLoading(true);
		const res = await editProfile(values);
		if (res.error) {
			message.error(res.error_warning);
		} else {
			setCustomer(values);
			message.success(res.success);
		}
		setLoading(false);
	};

	useEffect(() => {
		dispatch(fetchProfile());
	}, [dispatch]);

	return (
		<div className="region account-section">
			{/* Breadcrumb */}
			<div className="contact-breadcrumb" style={{ marginTop: '64px' }}>
				<a
					href="/"
					onClick={e => {
						e.preventDefault();
						navigate('/');
					}}
					className="breadcrumb-link"
				>
					Главная
				</a>
				<span className="breadcrumb-separator"></span>
				<span className="breadcrumb-current">Личный кабинет</span>
			</div>

			{/* Title */}
			<h1 className="account-title">ИНФОРМАЦИЯ ОБ АККАУНТЕ</h1>

			{/* Layout */}
			<div className="account-layout">
				{/* Sidebar */}
				<div className="account-sidebar">
					<AccountMenu />
				</div>

				{/* Content */}
				<div className="account-content">
					<div className="account-form-card">
						{status === loadingStatus.SUCCEEDED ? (
							<Form
								name="profile"
								layout="vertical"
								initialValues={data}
								onFinish={handleFinish}
							>
								<Form.Item name="firstname" label="Имя" rules={rules}>
									<Input />
								</Form.Item>
								<Form.Item name="lastname" label="Фамилия" rules={rules}>
									<Input />
								</Form.Item>
								<Form.Item
									name="telephone"
									label="Номер телефона"
									rules={rules}
								>
									<Input />
								</Form.Item>
								<Form.Item name="email" label="Почта" rules={rules}>
									<Input />
								</Form.Item>
								<div className="account-form-submit">
									<Button type="primary" htmlType="submit" loading={loading}>
										Сохранить изменения
									</Button>
								</div>
							</Form>
						) : (
							<Skeleton active paragraph={{ rows: 6 }} />
						)}
					</div>
				</div>
			</div>

			{/* Кнопка выхода для мобильных */}
			<AccountLogoutButton />
		</div>
	);
};

export default Profile;
