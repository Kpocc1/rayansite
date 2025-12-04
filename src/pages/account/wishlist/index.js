import { Row, Col, Skeleton } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';

import { loadingStatus } from 'helpers/fetcher';
import { fetchWishlist } from 'store/slices/customerSlice';
import AccountMenu from 'components/menu/AccountMenu';
import CartQtyButtonGroup from 'components/cart/CartQtyButtonGroup';
import WishlistButton from 'components/cart/WishlistButton';
import useSmartNavigate from 'hooks/useSmartNavigate';
import { formatCurrency, formatWeightWithUnit } from 'helpers/formatter';
import { getStock } from 'helpers/product';

const Wishlist = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { navigate: smartNavigate } = useSmartNavigate();
	const { data, status } = useSelector(state => state.customer.wishlist);

	useEffect(() => {
		dispatch(fetchWishlist());
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
			<h1 className="account-title">ИЗБРАННЫЕ</h1>

			{/* Layout */}
			<div className="account-layout">
				{/* Sidebar */}
				<div className="account-sidebar">
					<AccountMenu />
				</div>

				{/* Content */}
				<div className="account-content">
					{status === loadingStatus.SUCCEEDED ? (
						<Row gutter={24} className="popular-products-list">
							{(data?.products || []).map((item, index) => {
								const stock = getStock(item);
								const handleGotoItem = () => {
									if (item.product_id && item.slug) {
										smartNavigate(`/product/${item.product_id}/${item.slug}`);
									}
								};

								return (
									<Col
										xs={12}
										sm={12}
										md={8}
										lg={6}
										key={item.product_id || index}
									>
										<div
											className="popular-product-card"
											onClick={handleGotoItem}
											style={{ cursor: 'pointer' }}
										>
											<div className="popular-product-image-wrapper">
												<img
													src={item.thumb}
													alt={item.name}
													className="popular-product-image"
												/>
												{item.rating && (
													<div className="popular-product-rating">
														<img
															src={`${process.env.PUBLIC_URL}/icons/icon-star.svg`}
															alt="Рейтинг"
															className="popular-product-rating-icon"
														/>
														<span className="popular-product-rating-value">
															{item.rating}
														</span>
													</div>
												)}
											</div>
											<div
												className="popular-product-favorite"
												onClick={e => e.stopPropagation()}
											>
												<WishlistButton
													product_id={item.product_id}
													active={true}
													actionAfterDelete={() => dispatch(fetchWishlist())}
												/>
											</div>
											<h3 className="popular-product-title">
												{item.name}, {formatWeightWithUnit(item.weight)}
											</h3>
											<div className="popular-product-price-row">
												<span className="popular-product-price">
													{formatCurrency(item.price)}
												</span>
												<span className="popular-product-weight">
													{formatWeightWithUnit(item.weight)}
												</span>
											</div>
											<div onClick={e => e.stopPropagation()}>
												<CartQtyButtonGroup item={item} block size="large" />
											</div>
											<div
												className={`popular-product-stock ${
													stock.stock === 0
														? 'popular-product-stock-unavailable'
														: ''
												}`}
											>
												{stock.stock === 0
													? 'Нет в наличии'
													: stock.stock === 999
													? 'В наличии много'
													: `В наличии ${stock.stock} шт.`}
											</div>
										</div>
									</Col>
								);
							})}
						</Row>
					) : (
						<Row gutter={24} className="popular-products-list">
							{Array(4)
								.fill({})
								.map((_, index) => (
									<Col xs={12} sm={12} md={8} lg={6} key={index}>
										<Skeleton active avatar paragraph={{ rows: 4 }} />
									</Col>
								))}
						</Row>
					)}
				</div>
			</div>
		</div>
	);
};

export default Wishlist;
