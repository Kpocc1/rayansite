import { Alert, Form, Radio, Skeleton, Tabs, Typography } from 'antd';

import useBreakpoint from 'hooks/useBreakpoint';
import { formatDate } from 'helpers/formatter';
import { loadingStatus } from 'helpers/fetcher';

const CheckoutFormIntervals = ({ shippingMethods }) => {
	const { isMobile } = useBreakpoint();

	return (
		<div className='white p-20'>
			<Typography.Title level={4} style={{ marginTop: 0 }}>
				Дата и интервал доставки
			</Typography.Title>
			{shippingMethods.status === loadingStatus.SUCCEEDED ? (
				<Tabs
					defaultActiveKey='1'
					items={intervalItems(shippingMethods.data.intervals, isMobile)}
					// onChange={console.log}
				/>
			) : (
				<Skeleton active paragraph={{ rows: 2 }} />
			)}
		</div>
	);
};

const intervalItems = (intervals, isMobile) => {
	const now = new Date();
	const todayStr =
		now.getDate().toString().padStart(2, '0') +
		'.' +
		(now.getMonth() + 1).toString().padStart(2, '0') +
		'.' +
		now.getFullYear();
	const currentMinutes = now.getHours() * 60 + now.getMinutes();
	const isBefore19 = currentMinutes < 19 * 60; 
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
					) ? (
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
								const disabled =
									shouldBeDisabled &&
									!(isToday && isLastInterval && isBefore19);

								return (
									<Radio.Button
										key={`${date}-${t[0]}`}
										value={`${date} в ${t[0]}`}
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
										{t[0]}
									</Radio.Button>
								);
							})}
						</Radio.Group>
					)}
				</Form.Item>
			),
		};
	});
};

export default CheckoutFormIntervals;
