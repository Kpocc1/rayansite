import { Alert, Form, Radio, Skeleton, Tabs, Typography } from 'antd';

import useBreakpoint from 'hooks/useBreakpoint';
import { formatDate } from 'helpers/formatter';
import { loadingStatus } from 'helpers/fetcher';

const CheckoutFormIntervals = ({ shippingMethods, isPickup }) => {
	const { isMobile } = useBreakpoint();
	const isNalchik = shippingMethods.data?.store_id === 0;
	return (
		<div className='checkout-intervals-card'>
			<label className='checkout-intervals-label'>
				{isPickup ? 'Дата доставки' : 'Дата доставки'}
			</label>
			{shippingMethods.status === loadingStatus.SUCCEEDED ? (
				<Tabs
					defaultActiveKey='1'
					items={intervalItems(
						shippingMethods.data.intervals,
						isMobile,
						isNalchik,
						isPickup
					)}
					className='checkout-intervals-tabs'
				/>
			) : (
				<Skeleton active paragraph={{ rows: 2 }} />
			)}
		</div>
	);
};

const intervalItems = (intervals, isMobile, isNalchik, isPickup) => {
	const now = new Date();
	const todayStr =
		now.getDate().toString().padStart(2, '0') +
		'.' +
		(now.getMonth() + 1).toString().padStart(2, '0') +
		'.' +
		now.getFullYear();
	const currentMinutes = now.getHours() * 60 + now.getMinutes();
	const isBefore19 = currentMinutes < 17 * 60;
	return intervals.dates.map((d, index) => {
		const [date, title] = d;
		const label = title || formatDate(date, 'dddd');
		return {
			key: date,
			label: (
				<div>
					<span style={{ fontSize: 16 }}>
						{label.charAt(0).toUpperCase() + label.slice(1)}
					</span>
					<br />
					<Typography.Text type='secondary'>{date}</Typography.Text>
				</div>
			),
			children: (
				<Form.Item
					className='mt-20'
					name='shipping_interval'
					rules={[{ required: true, message: 'Выберите интервал' }]}
				>
					{intervals.disables_day_of_week.includes(
						formatDate(date).isoWeekday()
					) && !isPickup ? (
						<Alert message='Доставка недоступна' type='error' showIcon />
					) : (
						<Radio.Group buttonStyle='solid' size='large'>
							{intervals.times.map(t => {
								const isLastInterval = t[0] === '16:00 - 18:00';
								const isToday = date === todayStr;
								const shouldBeDisabled =
									(index === 0 && t[1] === 'disabled') ||
									intervals.disables_datetime.includes(
										`${date.split('.').reverse().join('-')} ${t[0]}`
									);
								
								// Дополнительная проверка для самовывоза с учетом режима работы
								let pickupDisabled = false;
								if (isPickup) {
									const dayOfWeek = formatDate(date).isoWeekday(); // 1=пн, 7=вс
									const [startTime] = t[0].split(' - ');
									const [startHours] = startTime.split(':').map(Number);
									
									if (isNalchik) {
										// Нальчик: 8:00 - 20:00 БЕЗ ВЫХОДНЫХ, пятница перерыв 12:00-14:00
										if (dayOfWeek === 5) { // пятница - перерыв 12:00-14:00
											pickupDisabled = startHours < 8 || startHours >= 20 || (startHours >= 12 && startHours < 14);
										} else {
											// Воскресенье работает как обычно для САМОВЫВОЗА
											pickupDisabled = startHours < 8 || startHours >= 20;
										}
									} else {
										// Москва: 10:00-21:00, интервал доступен если начинается до 21:00
										pickupDisabled = startHours < 10 || startHours >= 21;
									}
								}
								
								const disabled =
									(shouldBeDisabled &&
									!(isNalchik && isToday && isLastInterval && isBefore19)) ||
									pickupDisabled;

								// Для Москвы при самовывозе: последний интервал 20:00-21:00 вместо 20:00-22:00
								let displayInterval = t[0];
								let valueInterval = t[0];
								if (isPickup && !isNalchik && t[0] === '20:00 - 22:00') {
									displayInterval = '20:00 - 21:00';
									valueInterval = '20:00 - 21:00';
								}

								return (
									<Radio.Button
										key={`${date}-${t[0]}`}
										value={`${date} в ${valueInterval}`}
										disabled={disabled}
										style={
											isMobile
												? {
														borderRadius: 0,
														width: '50%',
														textAlign: 'center',
														marginBottom: 5,
												  }
												: {}
										}
									>
										{displayInterval}
									</Radio.Button>
								);
							})}
							
							{/* Дополнительные интервалы для Нальчика при самовывозе */}
							{isPickup && isNalchik && (() => {
								const dayOfWeek = formatDate(date).isoWeekday(); // 1=пн, 7=вс
								const isSunday = dayOfWeek === 7;
								
								// Обычные дни: 18:00 - 20:00, Воскресенье: 18:00 - 19:00
								const extraInterval = isSunday ? '18:00 - 19:00' : '18:00 - 20:00';
								
								return (
									<Radio.Button
										key={`${date}-extra`}
										value={`${date} в ${extraInterval}`}
										disabled={false}
										style={
											isMobile
												? {
														borderRadius: 0,
														width: '50%',
														textAlign: 'center',
														marginBottom: 5,
												  }
												: {}
										}
									>
										{extraInterval}
									</Radio.Button>
								);
							})()}
						</Radio.Group>
					)}
				</Form.Item>
			),
		};
	});
};

export default CheckoutFormIntervals;
