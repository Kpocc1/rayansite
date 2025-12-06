import React, { useState } from 'react';
import { Input, Form, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';

import AccountMenu from 'components/menu/AccountMenu';
import AccountLogoutButton from 'components/menu/AccountMenu/AccountLogoutButton';

const rules = [{ required: true, message: 'Обязательное поле' }];

const Password = () => {
  const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const handleFinish = async values => {
		setLoading(true);
		// TODO: Implement password change API call
		message.success('Пароль успешно изменен');
		setLoading(false);
	};

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
				<span className="breadcrumb-separator breadcrumb-separator-active"></span>
				<span className="breadcrumb-current">Личный кабинет</span>
			</div>

			{/* Title */}
			<h1 className="account-title">БЕЗОПАСНОСТЬ</h1>

			{/* Layout */}
			<div className="account-layout">
				{/* Sidebar */}
				<div className="account-sidebar">
					<AccountMenu />
				</div>

				{/* Content */}
				<div className="account-content">
					<div className="account-form-card">
            <Form
							name="password"
              layout="vertical"
							onFinish={handleFinish}
              style={{ maxWidth: 600 }}
            >
              <Form.Item name="password" label="Пароль" rules={rules}>
								<Input.Password
									iconRender={visible =>
										visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
									}
								/>
              </Form.Item>
							<div className="account-form-submit">
                <Button type="primary" htmlType="submit" loading={loading}>
                  Сохранить изменения
                </Button>
							</div>
            </Form>
          </div>
				</div>
			</div>

			{/* Кнопка выхода для мобильных */}
			<AccountLogoutButton />
    </div>
  );
};

export default Password;
