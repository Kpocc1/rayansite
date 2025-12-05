import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Row, Col, Skeleton } from 'antd';

import { batchAddToCart, fetchCartProducts } from 'store/slices/cartSlice';
import { fetchHistory } from 'store/slices/customerSlice';
import AccountMenu from 'components/menu/AccountMenu';
import AccountLogoutButton from 'components/menu/AccountMenu/AccountLogoutButton';
import CartQtyButtonGroup from 'components/cart/CartQtyButtonGroup';
import WishlistButton from 'components/cart/WishlistButton';
import useSmartNavigate from 'hooks/useSmartNavigate';
import { formatCurrency, formatWeightWithUnit } from 'helpers/formatter';
import { loadingStatus } from 'helpers/fetcher';
import { getStock } from 'helpers/product';

const HistoryDetail = () => {
  const [reorderIsLoad, setReorderIsload] = useState();
  const dispatch = useDispatch();
	const navigate = useNavigate();
	const { navigate: smartNavigate } = useSmartNavigate();
	const { data, status } = useSelector(state => state.customer.history);
	const { '*': orderId } = useParams();

  const handleBatchAdd = async () => {
    setReorderIsload(true);
    const products = data.products
			.filter(p => p.reorder)
      .map(({ product_id, quantity }) => ({ product_id, quantity }));
    await batchAddToCart(products);
    dispatch(fetchCartProducts());
    setReorderIsload(false);
  };

  useEffect(() => {
    dispatch(fetchHistory(orderId));
  }, [dispatch, orderId]);

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
			<h1 className="account-title">ЗАКАЗ #{orderId}</h1>

			{/* Layout */}
			<div className="account-layout">
				{/* Sidebar */}
				<div className="account-sidebar">
					<AccountMenu />
				</div>

				{/* Content */}
				<div className="account-content">
            {status === loadingStatus.SUCCEEDED ? (
              <>
							<div className="account-order-detail-card">
								<div className="account-order-detail-grid">
									{/* Order Details */}
									<div className="account-order-detail-section">
										<h3 className="account-order-detail-title">
											Детали заказа
										</h3>
										<p className="account-order-detail-label">№ Заказа</p>
										<p className="account-order-detail-value">{data.order_id}</p>
										<p className="account-order-detail-label">Добавлено</p>
										<p className="account-order-detail-value">
											{data.date_added}
										</p>
										<p className="account-order-detail-label">Способ оплаты</p>
										<p className="account-order-detail-value">
											{data.payment_method}
										</p>
										<p className="account-order-detail-label">
											Способ доставки
										</p>
										<p className="account-order-detail-value">
											{data.shipping_method}
										</p>
                <Button
                  type="primary"
											className="account-order-detail-button"
                  onClick={handleBatchAdd}
                  loading={reorderIsLoad}
                >
											Повторить заказ
                </Button>
									</div>

									{/* Shipping Address */}
									<div className="account-order-detail-section">
										<h3 className="account-order-detail-title">
											Адрес доставки
										</h3>
										<p className="account-order-detail-label">{data.name}</p>
										<div
											className="account-order-detail-value"
											dangerouslySetInnerHTML={{
												__html: data.shipping_address,
											}}
										/>
									</div>

									{/* Order History Timeline */}
									<div className="account-order-detail-section">
										<h3 className="account-order-detail-title">
											История заказа
										</h3>
										{data.histories?.length > 0 ? (
											data.histories.map((h, index) => (
												<div
													key={index}
													className="account-order-timeline-item"
												>
													<div
														className={`account-order-timeline-dot ${
															index === data.histories.length - 1
																? 'account-order-timeline-dot-active'
																: ''
														}`}
													></div>
													<div className="account-order-timeline-content">
														<p className="account-order-timeline-status">
															{h.status}
														</p>
														<p className="account-order-timeline-date">
															{h.date_added}
														</p>
													</div>
												</div>
											))
										) : (
											<p className="account-order-detail-value">
												История пуста
											</p>
										)}
									</div>
								</div>

								{/* Order Summary */}
								<div className="account-order-summary">
									{data.totals
										?.filter(t => t.code !== 'total')
										.map(t => (
											<div key={t.code} className="account-order-summary-row">
												<span className="account-order-summary-label">
													{t.title}
												</span>
												<span className="account-order-summary-value">
													{formatCurrency(t.text)}
												</span>
                  </div>
                ))}
									{data.totals?.find(t => t.code === 'total') && (
										<div className="account-order-summary-row account-order-summary-total">
											<span className="account-order-summary-label">Итого</span>
											<span className="account-order-summary-value">
												{formatCurrency(
													data.totals.find(t => t.code === 'total').text
												)}
											</span>
										</div>
            )}
          </div>
                    </div>

							{/* Products in Order */}
							<h2 className="account-products-title">Товары в заказе</h2>
							<Row gutter={24} className="popular-products-list">
								{(data.products || []).map((item, index) => {
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
														active={item.in_wishlist}
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
						</>
					) : (
						<div className="account-order-detail-card">
							<Skeleton active paragraph={{ rows: 10 }} />
						</div>
					)}
				</div>
			</div>

			{/* Кнопка выхода для мобильных */}
			<AccountLogoutButton />
    </div>
  );
};

export default HistoryDetail;
