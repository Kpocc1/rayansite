import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Alert, Button, Col, Row, Spin } from 'antd';

import {
	setDeliveryModalIsOpen,
	setDeliveryModalData,
} from 'store/slices/layoutSlice';
import { calcBasedOnYaTaxi } from 'store/slices/cartSlice';
import HeadingTitle from 'components/HeadingTitle';
import useBreakpoint from 'hooks/useBreakpoint';
import { formatCurrency } from 'helpers/formatter';
import { geoObjectDisplayName } from 'helpers/suggest-provider';

const DeliveryCalculate = () => {
	const mapRef = useRef();
	const suggestRef = useRef();
	const mapIsCreated = useRef();
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const dispatch = useDispatch();
	const { data: store } = useSelector(state => state.layout.mainInfo);
	const { isDesktop } = useBreakpoint();

	const { address, costAddress } = useSelector(
		state => state.layout.deliveryModalData
	);

	const handleSetData = ({ address, costAddress }) => {
		dispatch(
			setDeliveryModalData({
				address,
				costAddress,
			})
		);
		setLoading(false);
	};

	const setDataCb = address => {
		return costAddress => {
			handleSetData({ address, costAddress });
		};
	};

	const handleSubmitData = () => {
		dispatch(setDeliveryModalIsOpen(false));
	};

	const handleError = text => {
		setError(text);
		setLoading(false);
	};

	useEffect(() => {
		const handleLoad = () => {
			const ymaps = window.ymaps;
			// ИСПРАВЛЕНИЕ: store_coord в формате "долгота,широта", а ymaps ожидает [широта, долгота]
			const coordsParts = store.store_coord.split(',');
			const storeCoords = [coordsParts[1].trim(), coordsParts[0].trim()]; // Меняем местами!
			console.log(
				'🏪 Координаты магазина (store.store_coord):',
				store.store_coord
			);
			console.log('🏪 Parsed координаты [широта, долгота]:', storeCoords);
			const nalShippingCost = store.fix_cost_shipping;
			let lastRoute = null;

			const initMap = () => {
				const myMap = new ymaps.Map(mapRef.current, {
					center: storeCoords,
					zoom: 11,
					controls: [],
					behaviors: [],
				});

				// ✅ Используем встроенный SuggestView без кастомного provider
				// Это обеспечивает более гибкий поиск адресов
				const suggestView = new ymaps.SuggestView(suggestRef.current, {
					results: 10, // Показываем больше результатов для удобства
				});
				suggestView.events.add('select', function (e) {
					setLoading(true);
					ymaps.geocode(e.get('item').value).then(function (res) {
						const geoObject = res.geoObjects.get(0);
						const coords = geoObject.geometry.getCoordinates();
						console.log('📍 Координаты выбранного адреса:', coords);
						const address_meta = geoObject.properties.get(
							'metaDataProperty.GeocoderMetaData'
						);
						const house = address_meta.Address.Components.find(function (
							it,
							i
						) {
							return it.kind === 'house';
						});

						if (lastRoute) myMap.geoObjects.remove(lastRoute);
						ymaps
							.route([storeCoords, coords], {
								mapStateAutoApply: true,
							})
							.then(function async(route) {
								const way = route.getPaths().get(0);
								const distanceKm = (way.getLength() / 1000).toFixed(1);
								console.log(
									'🚗 Лимит доставки:',
									store.limit_distance_shipping,
									'км'
								);
								console.log('📍 Расстояние по маршруту:', distanceKm, 'км');
								console.log(
									'✅ Доставка возможна?',
									+store.limit_distance_shipping >= +distanceKm
								);
								if (+store.limit_distance_shipping >= +distanceKm) {
									if (
										address_meta.precision === 'exact' ||
										(house && house.name)
									) {
										lastRoute = route;
										myMap.geoObjects.add(lastRoute);
										const displayName = geoObjectDisplayName(geoObject);
										console.log(
											'🏙️ Текущий город (store.current_city):',
											store.current_city
										);
										// geoObject.properties.get("text")
										if (!store.current_city || +store.current_city.key === 0) {
											console.log(
												'💰 Используем фиксированную стоимость:',
												nalShippingCost
											);
											handleSetData({
												address: displayName,
												costAddress: nalShippingCost,
											});
											handleError('');
										} else {
											console.log(
												'🚕 Рассчитываем стоимость через Яндекс.Такси...'
											);
											const cb = setDataCb(displayName);
											calcBasedOnYaTaxi(storeCoords, coords, cb);
										}
									} else {
										handleError(
											'Необходимо ввести полный адрес с номером дома'
										);
									}
								} else {
									handleError(`
                    Доставка на этот адрес невозможна.
                    Максимальная дистанция доставки ${store.limit_distance_shipping} км
                  `);
								}
							});
					});
				});
			};

			ymaps.ready(initMap);
			mapIsCreated.current = true;
		};

		if (!mapIsCreated.current) handleLoad();

		// window.addEventListener("load", handleLoad);
		// return () => {
		//   window.removeEventListener("load", handleLoad);
		// };
	}, []);

	return (
		<>
			<Row justify='space-between'>
				<Col xs={24} lg={12}>
					<div className={`${isDesktop ? 'pr-30' : ''}`}>
						<HeadingTitle title='Рассчитать стоимость доставки' level={4} />
						{/* <Alert
              message="Стоимость доставки может изменяться с течением времени."
              type="info"
              showIcon
              className="mb-30"
            /> */}

						<div className='mb-30 mt-30'>
							<div>Введите полный адрес</div>
							<input
								className='rn-input'
								ref={suggestRef}
								defaultValue={
									store.current_city?.label
										? `${store.current_city.label}, `
										: ''
								}
							/>
						</div>

						{loading ? <Spin className='mb-30' /> : ''}

						{error ? (
							<Alert message={error} type='error' showIcon className='mb-30' />
						) : costAddress ? (
							<>
								<Alert
									message={
										<HeadingTitle
											title={`Стоимость доставки: ${formatCurrency(
												costAddress
											)}`}
											level={5}
											style={{ margin: 0 }}
										/>
									}
									type='success'
									className='mb-30'
								/>
								<div className='mb-30'>
									<Button
										type='primary'
										block
										size='large'
										onClick={handleSubmitData}
									>
										Доставить сюда
									</Button>
								</div>
							</>
						) : (
							''
						)}
					</div>
				</Col>
				<Col xs={24} lg={12}>
					<div className='rn-map' ref={mapRef} />
				</Col>
			</Row>
		</>
	);
};

export default DeliveryCalculate;
