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

	const { setCustomer, customer } = useCustomer();

	const handleTelephone = e => {
		const clean = e.target.value.replace(/\(|\)|-| /g, () => '');
		setTelephone(clean.split('_')[0]);
	};

	const handleSubmitTelephone = async () => {
		setStatus({ type: 'info', text: 'На Ваш номер придет смс с кодом' });
		const res = await postAuthCodeSend(telephone);
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
		<div style={{ height: 455 }}>
			{code ? (
				<CodeForm
					handleCode={handleCode}
					handleClearCode={handleClearCode}
					code={code}
					status={status}
				/>
			) : (
				<TelephoneForm
					handleSubmitTelephone={handleSubmitTelephone}
					handleTelephone={handleTelephone}
					telephone={telephone}
					status={status}
				/>
			)}
		</div>
	);
};

const CodeForm = ({ handleCode, handleClearCode, code, status }) => {
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
			<Typography.Title level={5} className='text-gray mt-10'>
				Мы отправили код на номер
				<br />
				{code.telephone}
			</Typography.Title>
			<Divider />
			<Form.Item
				name='code'
				label='Код из смс'
				rules={[{ required: true, message: 'Введите код' }]}
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
}) => (
	<Form
		name='signin-telephone'
		layout='vertical'
		onFinish={handleSubmitTelephone}
	>
		<Typography.Title level={2}>
			Войти или зарегистрироваться
			<Typography.Title level={5} className='text-gray mt-10'>
				Чтобы сохранять корзину, историю покупок, добавлять в избранное,
				участвовать в акциях и программах
			</Typography.Title>
		</Typography.Title>
		<Divider />
		<Form.Item name='telephone' label='Ваш телефон'>
			<InputMask
				mask='+7 (999) 999-99-99'
				onChange={handleTelephone}
				disabled={!!status?.type}
			>
				<Input />
			</InputMask>
		</Form.Item>
		<Form.Item>
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
		<p>Продолжая Вы соглашаетесь с политикой конфиденциальности</p>
		{status?.type && <Alert message={status.text} type={status.type} banner />}
	</Form>
);

export default SignIn;
