import { useState, useEffect } from 'react';
import { Button, Space, Card, Typography, Spin } from 'antd';
import { CloseOutlined, EnvironmentOutlined } from '@ant-design/icons';
import useCustomer from 'hooks/useCustomer';

const { Text } = Typography;

// Координаты городов
const CITIES = {
	0: { name: 'Нальчик', lat: 43.4987, lon: 43.6171 },
	1: { name: 'Москва', lat: 55.7558, lon: 37.6173 },
};

// Функция расчета расстояния между двумя точками (формула Гаверсинуса)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
	const R = 6371; // Радиус Земли в км
	const dLat = ((lat2 - lat1) * Math.PI) / 180;
	const dLon = ((lon2 - lon1) * Math.PI) / 180;
	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos((lat1 * Math.PI) / 180) *
			Math.cos((lat2 * Math.PI) / 180) *
			Math.sin(dLon / 2) *
			Math.sin(dLon / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	return R * c;
};

// Определение ближайшего города
const getNearestCity = (userLat, userLon) => {
	let nearestCityId = 0;
	let minDistance = Infinity;

	Object.entries(CITIES).forEach(([id, city]) => {
		const distance = calculateDistance(userLat, userLon, city.lat, city.lon);
		if (distance < minDistance) {
			minDistance = distance;
			nearestCityId = parseInt(id);
		}
	});

	return nearestCityId;
};

const CityConfirm = ({ onClose }) => {
	const { customer, setCustomer } = useCustomer();
	const [suggestedCityId, setSuggestedCityId] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Попытка определить город через геолокацию
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				position => {
					const { latitude, longitude } = position.coords;
					const nearestCity = getNearestCity(latitude, longitude);
					setSuggestedCityId(nearestCity);
					setLoading(false);
				},
				error => {
					// Если геолокация не удалась, используем текущий город или Нальчик по умолчанию
					console.log('Geolocation error:', error);
					setSuggestedCityId(customer.store_id || 0);
					setLoading(false);
				}
			);
		} else {
			// Браузер не поддерживает геолокацию
			setSuggestedCityId(customer.store_id || 0);
			setLoading(false);
		}
	}, [customer.store_id]);

	const handleConfirm = () => {
		// Если уже выбран правильный город, просто закрываем
		if (customer.store_id === suggestedCityId) {
			localStorage.setItem('cityConfirmed', 'true');
			onClose();
		} else {
			// Меняем город и перезагружаем страницу
			setCustomer({ ...customer, store_id: suggestedCityId });
			localStorage.setItem('cityConfirmed', 'true');
			window.location.reload();
		}
	};

	const handleReject = () => {
		// Переключаем на другой город
		const otherCityId = suggestedCityId === 0 ? 1 : 0;
		setCustomer({ ...customer, store_id: otherCityId });
		localStorage.setItem('cityConfirmed', 'true');
		window.location.reload();
	};

	const handleClose = () => {
		// Просто закрываем без сохранения выбора (покажется при следующем посещении)
		onClose();
	};

	if (loading) {
		return (
			<Card
				size='small'
				style={{
					width: 320,
					boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
				}}
			>
				<div style={{ textAlign: 'center', padding: '10px 0' }}>
					<Spin />
					<div style={{ marginTop: 10 }}>
						<Text type='secondary'>Определяем ваше местоположение...</Text>
					</div>
				</div>
			</Card>
		);
	}

	return (
		<Card
			size='small'
			style={{
				width: 320,
				boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
			}}
			extra={
				<Button
					type='text'
					size='small'
					icon={<CloseOutlined />}
					onClick={handleClose}
				/>
			}
		>
			<Space direction='vertical' size='middle' style={{ width: '100%' }}>
				<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
					<EnvironmentOutlined style={{ fontSize: 18, color: '#1890ff' }} />
					<Text strong style={{ fontSize: 15 }}>
						{CITIES[suggestedCityId].name} — это ваш город?
					</Text>
				</div>
				<Space size='small' style={{ width: '100%' }}>
					<Button type='primary' onClick={handleConfirm} style={{ flex: 1 }}>
						Да
					</Button>
					<Button onClick={handleReject} style={{ flex: 1 }}>
						Нет
					</Button>
				</Space>
			</Space>
		</Card>
	);
};

export default CityConfirm;
