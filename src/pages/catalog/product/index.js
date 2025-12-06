import React, { useEffect, useMemo, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Rate, Tabs, Skeleton, Col, Row } from 'antd';

import { fetchProduct, fetchReview } from 'store/slices/productSlice';
import HeadingTitle from 'components/HeadingTitle';
import ProductItemMain from './ProductItemMain';
import Reviews from './Reviews';
import { loadingStatus } from 'helpers/fetcher';
import useSmartNavigate from 'hooks/useSmartNavigate';
import { menuFlatter } from 'helpers';
import { formatCurrency, formatWeightWithUnit } from 'helpers/formatter';
import { getStock } from 'helpers/product';
import { addToCart, fetchCartProducts } from 'store/slices/cartSlice';
import { setSigninModalIsOpen } from 'store/slices/layoutSlice';
import useCustomer from 'hooks/useCustomer';
import WishlistButton from 'components/cart/WishlistButton';

const ProductDescription = ({ description, onExpand, onCollapse }) => {
	const [isExpanded, setIsExpanded] = useState(false);

	// Всегда показываем "Читать далее" если есть описание
	const hasDescription = description && description.trim().length > 0;

	const handleExpand = () => {
		setIsExpanded(true);
		if (onExpand) {
			onExpand();
		}
	};

	const handleCollapse = () => {
		setIsExpanded(false);
		if (onCollapse) {
			onCollapse();
		}
	};

	return (
		<div className='product-description-wrapper'>
			<div
				className={`rn-description product-description ${
					!isExpanded ? 'product-description-collapsed' : ''
				}`}
				dangerouslySetInnerHTML={{
					__html: description || '',
				}}
			/>
			{hasDescription && !isExpanded && (
				<button className='product-read-more-link' onClick={handleExpand}>
					Читать далее
				</button>
			)}
			{hasDescription && isExpanded && (
				<button className='product-read-more-link' onClick={handleCollapse}>
					Скрыть текст
				</button>
			)}
		</div>
	);
};

const ProductInfoTabs = ({
	data,
	review,
	onDescriptionExpand,
	onDescriptionCollapse,
}) => [
  {
		key: '1',
		label: 'О товаре',
    children: (
			<ProductDescription
				description={data?.onec_description}
				onExpand={onDescriptionExpand}
				onCollapse={onDescriptionCollapse}
      />
    ),
  },
  {
		key: '2',
		label: 'Отзывы',
		children: (
			<div className='product-reviews-placeholder'>
				<p>Отзывы пока отсутствуют. Будьте первым, кто оставит отзыв!</p>
			</div>
		),
  },
];

const Product = () => {
  const dispatch = useDispatch();
	const navigate = useNavigate();
	const { product, review } = useSelector(state => state.product);
	const { data: menuData } = useSelector(state => state.menu.categoriesList);
	const { customer } = useCustomer();
	const { '*': path } = useParams();
	const { navigate: smartNavigate } = useSmartNavigate();
	const [product_id] = path.split('/');
	const [tabsHeight, setTabsHeight] = useState(null);
	const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
	const [activeTabKey, setActiveTabKey] = useState('1');
	const imageRef = useRef(null);
	const detailsCardRef = useRef(null);
	const tabsSectionRef = useRef(null);

	const handleDescriptionExpand = () => {
		setIsDescriptionExpanded(true);
	};

	const handleDescriptionCollapse = () => {
		setIsDescriptionExpanded(false);
		// При сворачивании возвращаем ограничение высоты
		if (imageRef.current && detailsCardRef.current) {
			const imageHeight = imageRef.current.offsetHeight;
			const detailsCardHeight = detailsCardRef.current.offsetHeight;
			const marginBetween = 24;
			const calculatedHeight = imageHeight - detailsCardHeight - marginBetween;

			if (calculatedHeight > 0) {
				setTabsHeight(calculatedHeight);
			} else {
				setTabsHeight(null);
			}
		}
	};

  useEffect(() => {
    dispatch(fetchProduct(product_id));
    dispatch(fetchReview(product_id));
  }, [dispatch, product_id]);

	// Вычисляем высоту блока с вкладками на основе высоты картинки
	useEffect(() => {
		const calculateTabsHeight = () => {
			if (
				imageRef.current &&
				detailsCardRef.current &&
				tabsSectionRef.current
			) {
				const imageHeight = imageRef.current.offsetHeight;
				const detailsCardHeight = detailsCardRef.current.offsetHeight;
				const marginBetween = 24; // margin-top между блоками

				// Высота блока с вкладками = высота картинки - высота блока с ценой - отступ между ними
				const calculatedHeight =
					imageHeight - detailsCardHeight - marginBetween;

				if (calculatedHeight > 0) {
					setTabsHeight(calculatedHeight);
				} else {
					setTabsHeight(null);
				}
			}
		};

		// Вычисляем после загрузки изображения
		if (product.status === loadingStatus.SUCCEEDED && product.data) {
			const timer = setTimeout(() => {
				calculateTabsHeight();
			}, 100);

			window.addEventListener('resize', calculateTabsHeight);

			return () => {
				clearTimeout(timer);
				window.removeEventListener('resize', calculateTabsHeight);
			};
		}
	}, [product.status, product.data]);

	// Находим категорию товара для breadcrumbs
	const productCategory = useMemo(() => {
		if (!product.data?.category_id || !menuData?.categories)
			return { parent: null, current: null };

		const flat = menuFlatter(menuData.categories);
		const currentCategory = flat.find(
			cat =>
				cat.category_id === product.data.category_id ||
				cat.key === product.data.category_id
		);

		if (!currentCategory) return { parent: null, current: null };

		// Ищем родительскую категорию
		let parentCategory = null;
		const findParent = (categories, targetId, parent = null) => {
			for (const cat of categories || []) {
				if (cat.category_id === targetId || cat.key === targetId) {
					return parent;
				}
				if (cat.children) {
					const found = findParent(cat.children, targetId, cat);
					if (found !== null) return found;
				}
			}
			return null;
		};

		parentCategory = findParent(menuData.categories, product.data.category_id);

		return {
			parent: parentCategory,
			current: currentCategory,
		};
	}, [product.data?.category_id, menuData]);

  return (
		<div className='region product-section'>
			{/* Breadcrumb */}
			{product.status === loadingStatus.SUCCEEDED && product.data ? (
				<div className='contact-breadcrumb' style={{ marginTop: '64px' }}>
					<a
						href='/'
						onClick={e => {
							e.preventDefault();
							navigate('/');
						}}
						className='breadcrumb-link'
					>
						Главная
					</a>
					<span
						className={`breadcrumb-separator ${
							!productCategory.parent ? 'breadcrumb-separator-active' : ''
						}`}
					></span>
					{productCategory.parent && (
						<>
							<a
								href={`/catalog/${productCategory.parent.path}`}
								onClick={e => {
									e.preventDefault();
									smartNavigate(`/catalog/${productCategory.parent.path}`);
								}}
								className='breadcrumb-link'
							>
								{productCategory.parent.name ||
									productCategory.parent.label ||
									productCategory.parent.title}
							</a>
							<span className='breadcrumb-separator breadcrumb-separator-active'></span>
						</>
					)}
					{productCategory.current && (
						<>
							<a
								href={`/catalog/${productCategory.current.path}`}
								onClick={e => {
									e.preventDefault();
									smartNavigate(`/catalog/${productCategory.current.path}`);
								}}
								className='breadcrumb-link'
							>
								{productCategory.current.name ||
									productCategory.current.label ||
									productCategory.current.title}
							</a>
							<span className='breadcrumb-separator breadcrumb-separator-active'></span>
						</>
					)}
					<span className='breadcrumb-current'>
						{product.data.heading_title || product.data.name || 'Товар'}
					</span>
				</div>
			) : (
				<div className='contact-breadcrumb' style={{ marginTop: '64px' }}>
					<Skeleton active paragraph={{ rows: 1 }} />
				</div>
			)}

			<Row gutter={[48, 48]} className='mb-30' style={{ marginTop: '48px' }}>
				<Col xs={24} md={12}>
					<div className='product-image-wrapper'>
						{product.status === loadingStatus.SUCCEEDED &&
						product.data &&
						product.data.popup ? (
							<img
								ref={imageRef}
								src={product.data.popup}
								alt={product.data.heading_title || product.data.name}
								className='product-main-image'
								onLoad={() => {
									// Пересчитываем высоту после загрузки изображения
									setTimeout(() => {
										if (
											imageRef.current &&
											detailsCardRef.current &&
											tabsSectionRef.current
										) {
											const imageHeight = imageRef.current.offsetHeight;
											const detailsCardHeight =
												detailsCardRef.current.offsetHeight;
											const marginBetween = 24;
											const calculatedHeight =
												imageHeight - detailsCardHeight - marginBetween;
											if (calculatedHeight > 0) {
												setTabsHeight(calculatedHeight);
											} else {
												setTabsHeight(null);
											}
										}
									}, 100);
								}}
							/>
						) : product.status === loadingStatus.LOADING ? (
							<Skeleton.Image
								active
								style={{ width: '100%', height: '500px' }}
                />
						) : null}
					</div>
            </Col>
				<Col xs={24} md={12}>
					{product.status === loadingStatus.SUCCEEDED &&
					product.data &&
					product.data.heading_title ? (
						<>
							<div ref={detailsCardRef}>
								<ProductItemMain product_id={product_id} data={product.data} />
							</div>
							<div
								ref={tabsSectionRef}
								className={`product-tabs-section ${
									isDescriptionExpanded ? 'expanded' : ''
								}`}
								style={{
									marginTop: '24px',
									minHeight:
										isDescriptionExpanded || !tabsHeight
											? 'auto'
											: `${tabsHeight}px`,
								}}
							>
								<Tabs
									activeKey={activeTabKey}
									onChange={setActiveTabKey}
									items={ProductInfoTabs({
										data: product.data,
										review,
										onDescriptionExpand: handleDescriptionExpand,
										onDescriptionCollapse: handleDescriptionCollapse,
									})}
								/>
							</div>
						</>
					) : product.status === loadingStatus.LOADING ? (
						<Skeleton active paragraph={{ rows: 8 }} />
					) : (
						<div>Товар не найден</div>
              )}
            </Col>
          </Row>

			{product.status === loadingStatus.SUCCEEDED &&
			product.data &&
			product.data.heading_title ? (
				<>
					{product.data.text_related && (
						<div className='recommended-products-section'>
							<div
								className='recommended-products-header'
								style={{
									display: 'flex',
									justifyContent: 'space-between',
									alignItems: 'center',
									marginBottom: '24px',
								}}
							>
								<HeadingTitle
									title={product.data.text_related || 'РЕКОМЕНДУЕМЫЕ ТОВАРЫ'}
								/>
								{product.data.products && product.data.products.length > 0 && (
									<a
										href='/catalog'
										className='popular-products-link catalog-link-all'
										onClick={e => {
											e.preventDefault();
											navigate('/catalog');
										}}
									>
										<span className='catalog-link-text'>В каталог</span>
										<img
											src={`${process.env.PUBLIC_URL}/icons/icon-arrow-right-gray.svg`}
											alt=''
											className='catalog-link-arrow'
										/>
									</a>
								)}
							</div>
							<Row gutter={[24, 24]} className='popular-products-list'>
								{(product.data.products || Array(4).fill({}))
									.slice(0, 4)
									.map((item, index) => {
										if (
											product.status !== loadingStatus.SUCCEEDED ||
											!item.product_id
										) {
											return (
												<Col xs={12} sm={12} md={8} lg={6} key={index}>
													<Skeleton active avatar paragraph={{ rows: 4 }} />
        </Col>
											);
										}
										return (
											<Col
												xs={12}
												sm={12}
												md={8}
												lg={6}
												key={item.product_id || index}
											>
												<div
													className='popular-product-card'
													onClick={() =>
														navigate(`/product/${item.product_id}/${item.slug}`)
													}
													style={{ cursor: 'pointer' }}
												>
													<div className='popular-product-image-wrapper'>
														<img
															src={item.thumb}
															alt={item.name}
															className='popular-product-image'
														/>
														{item.rating && (
															<div className='popular-product-rating'>
																<img
																	src={`${process.env.PUBLIC_URL}/icons/icon-star.svg`}
																	alt='Рейтинг'
																	className='popular-product-rating-icon'
																/>
																<span className='popular-product-rating-value'>
																	{item.rating}
																</span>
															</div>
            )}
          </div>
													<div
														className='popular-product-favorite'
														onClick={e => e.stopPropagation()}
													>
														<WishlistButton
															product_id={item.product_id}
															active={item.in_wishlist}
          />
        </div>
													<h3 className='popular-product-title'>
														{item.name}, {formatWeightWithUnit(item.weight)}
													</h3>
													<div className='popular-product-price-row'>
														<span className='popular-product-price'>
															{formatCurrency(item.price)}
														</span>
														<span className='popular-product-weight'>
															{formatWeightWithUnit(item.weight)}
														</span>
													</div>
													<div onClick={e => e.stopPropagation()}>
														<button
															className='popular-product-button'
															onClick={async e => {
																e.preventDefault();
																if (!customer.token) {
																	dispatch(setSigninModalIsOpen(true));
																	return;
																}
																await dispatch(
																	addToCart({
																		product_id: item.product_id,
																		quantity: item.minimum || 1,
																	})
																);
																dispatch(fetchCartProducts());
															}}
															disabled={
																getStock(item).quantity === 0 &&
																getStock(item).stock === 0
															}
														>
															<img
																src={`${process.env.PUBLIC_URL}/icons/icon-shopping-cart.svg`}
																alt=''
																className='popular-product-button-icon'
															/>
															<span>В корзину</span>
														</button>
													</div>
													{(() => {
														const stock = getStock(item);
														if (stock.stock === 0) {
															return (
																<div className='popular-product-stock popular-product-stock-unavailable'>
																	Нет в наличии
																</div>
															);
														}
														return (
															<div className='popular-product-stock'>
																{stock.stock === 999
																	? 'В наличии много'
																	: `В наличии ${stock.stock} шт.`}
															</div>
														);
													})()}
												</div>
											</Col>
										);
									})}
							</Row>
						</div>
					)}
				</>
			) : product.status === loadingStatus.LOADING ? (
				<>
					<Skeleton active paragraph={{ rows: 4 }} />
          <Skeleton active paragraph={{ rows: 4 }} />
				</>
			) : null}
			<div className='region quality-section' style={{ marginTop: '60px' }}>
				<h2 className='quality-title'>ДОВЕРЬТЕСЬ КАЧЕСТВУ</h2>
				<div className='quality-cards'>
					<div className='quality-card quality-card-gray'>
						<img
							src={`${process.env.PUBLIC_URL}/images/icon-halal.png`}
							alt=''
							className='quality-card-icon'
						/>
						<h4 className='quality-card-text'>Без свинины и ее компонентов</h4>
					</div>
					<div className='quality-card quality-card-gray'>
						<img
							src={`${process.env.PUBLIC_URL}/images/icon-eggs.png`}
							alt=''
							className='quality-card-icon'
						/>
						<h4 className='quality-card-text'>Натуральные молоко и яйцо</h4>
					</div>
					<div className='quality-card quality-card-gray'>
						<img
							src={`${process.env.PUBLIC_URL}/images/icon-cow.png`}
							alt=''
							className='quality-card-icon'
						/>
						<h4 className='quality-card-text'>Мясо собственного забоя</h4>
					</div>
					<div className='quality-card quality-card-gray'>
						<img
							src={`${process.env.PUBLIC_URL}/images/icon-nature.png`}
							alt=''
							className='quality-card-icon'
						/>
						<h4 className='quality-card-text'>Без консервантов и красителей</h4>
					</div>
					<div
						className='quality-card quality-card-blue'
						style={{
							backgroundImage: `url(${process.env.PUBLIC_URL}/images/bg-quality-card.png)`,
							backgroundSize: 'cover',
							backgroundPosition: 'center',
							backgroundRepeat: 'no-repeat',
						}}
					>
						<img
							src={`${process.env.PUBLIC_URL}/icons/icon-dna.svg`}
							alt=''
							className='quality-card-icon'
						/>
						<h4 className='quality-card-text quality-card-text-white'>
							Без ГМО и заменителей мяса
						</h4>
					</div>
				</div>
			</div>
    </div>
  );
};

export default Product;
