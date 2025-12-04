import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Skeleton } from 'antd';
import { useNavigate } from 'react-router-dom';

import { fetchHistories } from 'store/slices/customerSlice';
import AccountMenu from 'components/menu/AccountMenu';
import useSmartNavigate from 'hooks/useSmartNavigate';
import { loadingStatus } from 'helpers/fetcher';
import { formatCurrency } from 'helpers/formatter';

const History = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { data, status } = useSelector(state => state.customer.histories);
	const { navigate: smartNavigate } = useSmartNavigate();

	useEffect(() => {
		dispatch(fetchHistories());
	}, [dispatch]);

	const getStatusClass = statusText => {
		const lowerStatus = (statusText || '').toLowerCase();
		if (lowerStatus.includes('доставлен') || lowerStatus.includes('завершен')) {
			return '';
		}
		return 'account-history-status-pending';
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
				<span className="breadcrumb-separator"></span>
				<span className="breadcrumb-current">Личный кабинет</span>
			</div>

			{/* Title */}
			<h1 className="account-title">ИСТОРИЯ ЗАКАЗОВ</h1>

			{/* Layout */}
			<div className="account-layout">
				{/* Sidebar */}
				<div className="account-sidebar">
					<AccountMenu />
				</div>

				{/* Content */}
				<div className="account-content">
					{status === loadingStatus.SUCCEEDED ? (
						<div className="account-history-grid">
							{(data.orders || []).map((item, index) => (
								<div key={index} className="account-history-card">
									<div className="account-history-header">
										<span className="account-history-order-id">
											#{item.order_id}
										</span>
										<span
											className={`account-history-status ${getStatusClass(item.status)}`}
										>
											{item.status}
										</span>
									</div>

									<div className="account-history-images">
										{item.products?.slice(0, 4).map(p => (
											<img
												key={p.product_id}
												src={p.image}
												alt={p.name}
												className="account-history-image"
											/>
										))}
									</div>

									<div className="account-history-customer">{item.name}</div>

									<div className="account-history-footer">
										<span className="account-history-total">
											{formatCurrency(item.total)}
										</span>
										<span className="account-history-date">
											{item.date_added}
										</span>
									</div>

									<Button
										type="primary"
										block
										className="account-history-button"
										onClick={() =>
											smartNavigate(`/account/history/${item.order_id}`)
										}
									>
										Детали заказа
										<img 
											src={`${process.env.PUBLIC_URL}/icons/icon-arrow-right-circle.svg`}
											alt=""
											className="account-history-button-icon"
										/>
									</Button>
								</div>
							))}
						</div>
					) : (
						<div className="account-history-grid">
							{Array(3)
								.fill({})
								.map((_, index) => (
									<div key={index} className="account-history-card">
										<Skeleton active paragraph={{ rows: 4 }} />
									</div>
								))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default History;
