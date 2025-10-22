import { useEffect, useState } from 'react';
import { Alert, Button, Divider, Form, Input, Typography } from 'antd';
import InputMask from 'react-input-mask';
import OTPInput from 'react-otp-input';

import {
	postAuthCodeSend,
	postAuthCodeValidate,
} from 'store/slices/customerSlice';
import useCustomer from 'hooks/useCustomer';

const SignIn = () => {
	const [status, setStatus] = useState({ type: '', text: '' });
	const [telephone, setTelephone] = useState('');
	const [code, setCode] = useState();
	const [method, setMethod] = useState('sms'); // ✅ НОВОЕ: выбор метода отправки

	const { setCustomer, customer } = useCustomer();

	const handleTelephone = e => {
		const clean = e.target.value.replace(/\(|\)|-| /g, () => '');
		setTelephone(clean.split('_')[0]);
	};

	const handleSubmitTelephone = async () => {
		// ✅ НОВОЕ: разные сообщения в зависимости от метода
		const statusText =
			method === 'whatsapp'
				? 'Код будет отправлен в WhatsApp'
				: 'На Ваш номер придет смс с кодом';
		setStatus({ type: 'info', text: statusText });
		const res = await postAuthCodeSend(telephone, method); // ✅ Передаем method
		setCode(res);
		setStatus();
	};

	const handleCode = async value => {
		if (value.length === 4) {
			setStatus({ type: 'info', text: 'Проверка кода...' });
			console.log(value);
			const res = await postAuthCodeValidate(telephone, value);
			if (res.status === 'success') {
				// разблокировать и войти
				setStatus({ type: 'info', text: res.text });
				setCustomer({
					...res.customer_info,
					store_id: customer.store_id || 0,
				});
				window.location.reload();
			} else {
				setStatus({ type: 'error', text: res.text });
				console.log('Код введен неверно');
			}
		}
	};

	const handleClearCode = () => {
		setCode();
	};

	return (
		<div style={{ height: 'auto' }}>
			{code ? (
				<CodeForm
					handleCode={handleCode}
					handleClearCode={handleClearCode}
					code={code}
					status={status}
					method={method}
				/>
			) : (
				<TelephoneForm
					handleSubmitTelephone={handleSubmitTelephone}
					handleTelephone={handleTelephone}
					telephone={telephone}
					status={status}
					method={method}
					setMethod={setMethod}
				/>
			)}
		</div>
	);
};

const CodeForm = ({ handleCode, handleClearCode, code, status, method }) => {
	function fmtMSS(s) {
		return (s - (s %= 60)) / 60 + (9 < s ? ':' : ':0') + s;
	}

	const AgainCode = () => {
		const [timer, setTimer] = useState(120);
		const handleSubmitTelephone = async () => {
			setTimer(120);
			const res = await postAuthCodeSend(code.telephone);
		};
		useEffect(() => {
			const interval = setInterval(() => {
				// console.log(timer)
				if (timer > 0) setTimer(timer - 1);
			}, 1000);
			return () => clearInterval(interval);
		}, [timer]);

		return (
			<p>
				{timer === 0 ? (
					<Button type='primary' size='large' onClick={handleSubmitTelephone}>
						Отправить код повторно
					</Button>
				) : (
					<a href='#' onClick={e => e.preventDefault()}>
						{`Отправить код повторно через ${fmtMSS(timer)}`}
					</a>
				)}
			</p>
		);
	};

	return (
		<Form name='signin-code' layout='vertical'>
			<Typography.Title
				level={5}
				className='text-gray'
				style={{ marginTop: 0, marginBottom: 12 }}
			>
				Мы отправили код{method === 'whatsapp' ? ' в WhatsApp' : ' по SMS'} на
				номер
				<br />
				{code.telephone}
			</Typography.Title>
			<Form.Item
				name='code'
				label={method === 'whatsapp' ? 'Код из WhatsApp' : 'Код из смс'}
				rules={[{ required: true, message: 'Введите код' }]}
				style={{ marginBottom: 16 }}
			>
				{/* <Input.OTP
          autoFocus
          length={4}
          size="large"
          onChange={handleCode}
          disabled={status?.type ? status.type === "success" : false}
        /> */}
				<OTPInput
					onChange={handleCode}
					numInputs={4}
					inputType='number'
					shouldAutoFocus
					renderSeparator={<span className='ml-10 mr-10'>-</span>}
					renderInput={props => (
						<Input
							{...props}
							className='rn-otp-input'
							disabled={status && status.type === 'info'}
						/>
					)}
				/>
			</Form.Item>
			<AgainCode />
			{status?.type && (
				<Alert message={status.text} type={status.type} banner />
			)}
		</Form>
	);
};

const TelephoneForm = ({
	handleSubmitTelephone,
	handleTelephone,
	telephone,
	status,
	method,
	setMethod,
}) => (
	<Form
		name='signin-telephone'
		layout='vertical'
		onFinish={handleSubmitTelephone}
	>
		<Typography.Title level={2} style={{ marginBottom: 8 }}>
			Войти или зарегистрироваться
			<Typography.Title
				level={5}
				className='text-gray'
				style={{ marginTop: 8, marginBottom: 0 }}
			>
				Чтобы сохранять корзину, историю покупок, добавлять в избранное,
				участвовать в акциях и программах
			</Typography.Title>
		</Typography.Title>
		<Form.Item
			name='telephone'
			label='Ваш телефон'
			style={{ marginBottom: 16 }}
		>
			<InputMask
				mask='+7 (999) 999-99-99'
				onChange={handleTelephone}
				disabled={!!status?.type}
			>
				<Input />
			</InputMask>
		</Form.Item>

		{/* ✅ НОВОЕ: Выбор метода отправки кода */}
		<Form.Item label='Как отправить код?' style={{ marginBottom: 16 }}>
			<Button.Group style={{ width: '100%' }}>
				<Button
					type={method === 'sms' ? 'primary' : 'default'}
					onClick={() => setMethod('sms')}
					disabled={!!status?.type}
					style={{ width: '50%' }}
				>
					📱 SMS
				</Button>
				<Button
					type={method === 'whatsapp' ? 'primary' : 'default'}
					onClick={() => setMethod('whatsapp')}
					disabled={!!status?.type}
					style={{ width: '50%' }}
				>
					💬 WhatsApp
				</Button>
			</Button.Group>
		</Form.Item>

		<Form.Item style={{ marginBottom: 12 }}>
			<Button
				type='primary'
				htmlType='submit'
				block
				size='large'
				disabled={telephone.length < 12}
				loading={!!status?.type}
			>
				Получить код
			</Button>
		</Form.Item>
		<p style={{ marginBottom: 8, marginTop: 0 }}>
			Продолжая Вы соглашаетесь с политикой конфиденциальности
		</p>
		{status?.type && <Alert message={status.text} type={status.type} banner />}
	</Form>
);

export default SignIn;
