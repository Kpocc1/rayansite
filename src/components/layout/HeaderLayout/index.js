import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Dropdown, Flex, Button, Badge, Skeleton, Card } from 'antd';
// import { Menu } from 'antd'; // Закомментировано, может пригодиться
// import {
// 	ShoppingCartOutlined,
// 	HeartOutlined,
// 	UserOutlined,
// } from '@ant-design/icons'; // Закомментировано, используем SVG иконки

import {
	setSigninModalIsOpen,
	fetchMainInfo,
	// setDeliveryModalIsOpen, // Закомментировано, может пригодиться
} from 'store/slices/layoutSlice';
import { fetchCartProducts } from 'store/slices/cartSlice';
import { fetchCategoriesList } from 'store/slices/menuSlice';
// import Megamenu from 'components/menu/Megamenu'; // Закомментировано, может пригодиться
import MiniCart from 'components/cart/MiniCart';
import SearchWithSuggest from 'components/form/SearchWithSuggest';
// import InlineSpace from 'components/layout/InlineSpace'; // Закомментировано, может пригодиться
import MobileHeader from './MobileHeader';
import useBreakpoint from 'hooks/useBreakpoint';
import useSmartNavigate from 'hooks/useSmartNavigate';
// import useAdditionalMenu from 'hooks/useAdditionalMenu'; // Закомментировано, может пригодиться
import useCustomer from 'hooks/useCustomer';
import { loadingStatus } from 'helpers/fetcher';
// import { formatCurrency } from 'helpers/formatter'; // Закомментировано, может пригодиться
import { getImage } from 'helpers';

const HeaderLayout = () => {
	const dispatch = useDispatch();
	const cartProducts = useSelector(state => state.cart.cartProducts);
	const { data, status } = useSelector(state => state.layout.mainInfo);
	const { data: categoriesData, status: categoriesStatus } = useSelector(
		state => state.menu.categoriesList
	);
	const location = useLocation();
	const { navigate } = useSmartNavigate();
	const { customer, setCustomer } = useCustomer();
	const { isMobile, isTablet } = useBreakpoint();
	// const { breakpoint } = useBreakpoint(); // Закомментировано, может пригодиться
	const scrollRef = useRef(null);
	const [showLeftArrow, setShowLeftArrow] = useState(false);
	const [showRightArrow, setShowRightArrow] = useState(false);
	const [catalogMenuOpen, setCatalogMenuOpen] = useState(false);
	const [selectedCategory, setSelectedCategory] = useState(null);

	const checkScrollPosition = () => {
		if (scrollRef.current) {
			const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
			setShowLeftArrow(scrollLeft > 5);
			setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 5);
		}
	};

	useEffect(() => {
		const scrollElement = scrollRef.current;
		if (scrollElement) {
			// Проверяем сразу и после небольшой задержки для корректной инициализации
			setTimeout(() => {
				checkScrollPosition();
			}, 100);
			scrollElement.addEventListener('scroll', checkScrollPosition);
			window.addEventListener('resize', checkScrollPosition);
		}
		return () => {
			if (scrollElement) {
				scrollElement.removeEventListener('scroll', checkScrollPosition);
			}
			window.removeEventListener('resize', checkScrollPosition);
		};
	}, [categoriesStatus, categoriesData]);
	// const additionalMenu = useAdditionalMenu(); // Закомментировано, может пригодиться

	const total =
		cartProducts.data.totals?.find(t => t.code === 'total').text || '';

	const handleCityClick = async ({ key, keyPath, domEvent }) => {
		setCustomer({ ...customer, store_id: key });
		window.location.reload();
	};

	const handleLogoClick = e => {
		e.preventDefault();
		navigate('/');
	};

	const handleSigninModalOpen = () => {
		dispatch(setSigninModalIsOpen(true));
	};

	// const handleMenuClick = ({ key, keyPath, domEvent }) => {
	// 	navigate(key);
	// }; // Закомментировано, может пригодиться

	// const handleSetDeliveryOpen = () => {
	// 	dispatch(setDeliveryModalIsOpen(true));
	// }; // Закомментировано, может пригодиться

	useEffect(() => {
		dispatch(fetchMainInfo());
		dispatch(fetchCartProducts());
		dispatch(fetchCategoriesList());
	}, [dispatch]);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [location]);

	return isMobile || isTablet ? (
		<MobileHeader
			customer={customer}
			handleSigninModalOpen={handleSigninModalOpen}
			data={data}
			total={total}
			handleCityClick={handleCityClick}
			handleLogoClick={handleLogoClick}
		/>
	) : (
		<div className='white'>
			<div
				className='tn-top-rail'
				style={{
					backgroundImage: `url(${process.env.PUBLIC_URL}/images/header-background.png)`,
					backgroundSize: 'cover',
					backgroundPosition: 'center',
					backgroundRepeat: 'no-repeat',
				}}
			>
				<div className='region'>
					<Flex vertical={false} justify='flex-start' align='center'>
						<Dropdown
							trigger={['click']}
							menu={{
								items: data.cities_list,
								onClick: handleCityClick,
							}}
							overlayClassName='city-dropdown-overlay'
							dropdownRender={menu => (
								<div className='city-dropdown-menu'>{menu}</div>
							)}
						>
							{status === loadingStatus.SUCCEEDED ? (
								<Button type='text' className='city-select-button'>
									<img
										src={`${process.env.PUBLIC_URL}/icons/icon-map-marker.svg`}
										alt=''
										className='city-icon'
									/>
									<span className='city-name'>
										{data.cities_list[customer.store_id].label}
									</span>
									<img
										src={`${process.env.PUBLIC_URL}/icons/icon-arrow-down.svg`}
										alt=''
										className='city-arrow'
									/>
								</Button>
							) : (
								<Skeleton.Button active />
							)}
						</Dropdown>
						{status === loadingStatus.SUCCEEDED && data.telephone && (
							<a href={`tel:${data.telephone}`} className='top-rail-telephone'>
								<img
									src={`${process.env.PUBLIC_URL}/icons/icon-phone.svg`}
									alt=''
									className='phone-icon'
								/>
								<span className='phone-link'>{data.telephone}</span>
							</a>
						)}
						{/* <InlineSpace width={10} />
					{loadingStatus.SUCCEEDED === status ? (
						<Menu
							mode='horizontal'
								items={[
									{ label: 'Каталог', key: '/catalog' },
									...additionalMenu,
								]}
							onClick={handleMenuClick}
							style={{ flex: 1, minWidth: 0 }}
						/>
					) : (
						<Skeleton.Button active block />
					)}
					<Button
						type='primary'
						size='small'
						onClick={handleSetDeliveryOpen}
						className='ml-20'
					>
						Стоимость доставки
						</Button> */}
						{status === loadingStatus.SUCCEEDED && data.top_menu && (
							<div className='top-rail-menu-right'>
								<a
									href={`/page/${data.top_menu.vacancies.id}`}
									className='top-rail-menu-item'
									onClick={e => {
										e.preventDefault();
										navigate(`/page/${data.top_menu.vacancies.id}`);
									}}
								>
									Вакансии
								</a>
								<a
									href='/reviews'
									className='top-rail-menu-item'
									onClick={e => {
										e.preventDefault();
										navigate('/reviews');
									}}
								>
									Оставьте отзыв
								</a>
								<a
									href='/news'
									className='top-rail-menu-item'
									onClick={e => {
										e.preventDefault();
										navigate('/news');
									}}
								>
									Новости
								</a>
								<a
									href={`/page/${data.top_menu.certificate.id}`}
									className='top-rail-menu-item'
									onClick={e => {
										e.preventDefault();
										navigate(`/page/${data.top_menu.certificate.id}`);
									}}
								>
									Сертификаты
								</a>
							</div>
						)}
					</Flex>
				</div>
			</div>
			<div className='rn-header region'>
				<Flex align='center' style={{ width: '100%' }}>
					<a href='/' onClick={handleLogoClick} className='header-logo'>
						<img
							src={getImage('catalog/logo_new-new-mirror.jpg')}
							style={{ width: 68 }}
							alt=''
						/>
					</a>
					<Dropdown
						open={catalogMenuOpen}
						onOpenChange={setCatalogMenuOpen}
						trigger={['click']}
						dropdownRender={() => (
							<div className='catalog-dropdown-menu'>
								<div className='catalog-menu-content'>
									<div className='catalog-menu-left'>
										{categoriesStatus === loadingStatus.LOADING ? (
											<div>Загрузка...</div>
										) : categoriesStatus === loadingStatus.SUCCEEDED &&
										  categoriesData?.categories?.length > 0 ? (
											categoriesData.categories.map((category, index) => {
												// Проверяем структуру данных - может быть key вместо category_id
												const categoryId = category.category_id || category.key;
												const hasChildren =
													category.children && category.children.length > 0;
												const categoryName =
													category.name ||
													category.label ||
													category.title ||
													'';
												return (
													<div
														key={categoryId || index}
														className={`catalog-menu-item ${
															selectedCategory?.category_id === categoryId ||
															selectedCategory?.key === categoryId
																? 'active'
																: ''
														}`}
														onMouseEnter={() => {
															if (hasChildren) {
																setSelectedCategory(category);
															}
														}}
														onClick={() => {
															if (hasChildren) {
																// Если есть подкатегории, проверяем, не выбрана ли уже эта категория
																if (
																	selectedCategory?.category_id ===
																		categoryId ||
																	selectedCategory?.key === categoryId
																) {
																	// Если уже выбрана, сбрасываем выбор
																	setSelectedCategory(null);
																} else {
																	// Если не выбрана, выбираем категорию
																	setSelectedCategory(category);
																}
															} else {
																// Если нет подкатегорий, переходим на страницу
																if (category.path || category.slug) {
																	navigate(
																		`/catalog/${category.path || category.slug}`
																	);
																	setCatalogMenuOpen(false);
																}
															}
														}}
													>
														<span className='catalog-menu-item-text'>
															{categoryName}
														</span>
														{hasChildren && (
															<img
																src={`${process.env.PUBLIC_URL}/icons/icon-arrow-right-small.svg`}
																alt=''
																className='catalog-menu-item-arrow'
															/>
														)}
													</div>
												);
											})
										) : (
											<div>Нет категорий</div>
										)}
									</div>
									{selectedCategory?.children &&
										selectedCategory.children.length > 0 && (
											<div className='catalog-menu-right'>
												{selectedCategory.children.map((child, index) => {
													const childName =
														child.name || child.label || child.title || '';
													return (
														<div
															key={child.category_id || child.key || index}
															className='catalog-menu-item'
															onClick={() => {
																if (child.path || child.slug) {
																	navigate(
																		`/catalog/${child.path || child.slug}`
																	);
																	setCatalogMenuOpen(false);
																}
															}}
														>
															<span className='catalog-menu-item-text'>
																{childName}
															</span>
														</div>
													);
												})}
											</div>
										)}
								</div>
							</div>
						)}
					>
						<Button
							type='primary'
							className={`catalog-button ${
								catalogMenuOpen ? 'catalog-button-open' : ''
							}`}
							onClick={() => setCatalogMenuOpen(!catalogMenuOpen)}
						>
							<img
								src={`${process.env.PUBLIC_URL}/icons/${
									catalogMenuOpen ? 'icon-close.svg' : 'icon-catalog.svg'
								}`}
								alt=''
								className='catalog-icon'
							/>
							<span className='catalog-text'>Каталог</span>
						</Button>
					</Dropdown>
					<div className='search-wrapper'>
						<SearchWithSuggest />
					</div>
				</Flex>
				<Flex align='flex-start' gap={30} style={{ height: '50px' }}>
					<a
						href='/account/history'
						className='header-action-item'
						onClick={e => {
							e.preventDefault();
							if (customer.token) {
								navigate('/account/history');
							} else {
								handleSigninModalOpen();
							}
						}}
					>
						<img
							src={`${process.env.PUBLIC_URL}/icons/icon-clock.svg`}
							alt=''
							className='header-action-icon'
						/>
						<span className='header-action-text'>Заказы</span>
					</a>
					<a
						href='/account/wishlist'
						className='header-action-item'
						onClick={e => {
							e.preventDefault();
							if (customer.token) {
								navigate('/account/wishlist');
							} else {
								handleSigninModalOpen();
							}
						}}
					>
						<img
							src={`${process.env.PUBLIC_URL}/icons/icon-heart.svg`}
							alt=''
							className='header-action-icon'
						/>
						<span className='header-action-text'>Избранное</span>
					</a>
					<Dropdown
						trigger={['hover']}
						menu={{ items: cartProducts.data.products || [] }}
						dropdownRender={({ props }) =>
							cartProducts.data.products?.length > 0 ? (
								<Card bordered hoverable style={{ cursor: 'default' }}>
									<MiniCart
										products={props.items}
										status={cartProducts.status}
									/>
									<div style={{ textAlign: 'right' }}>
										<Button
											type='primary'
											size='large'
											danger
											block
											onClick={() => navigate('/cart')}
										>
											К оформлению
										</Button>
									</div>
								</Card>
							) : (
								''
							)
						}
					>
						<a
							href='/cart'
							className='header-action-item'
							onClick={e => {
								e.preventDefault();
								navigate('/cart');
							}}
						>
							<Badge count={cartProducts.data.count} offset={[0, 0]}>
								<img
									src={`${process.env.PUBLIC_URL}/icons/icon-cart.svg`}
									alt=''
									className='header-action-icon'
								/>
							</Badge>
							<span className='header-action-text'>Корзина</span>
						</a>
					</Dropdown>
					<a
						href='/account'
						className='header-action-item'
						onClick={e => {
							e.preventDefault();
							if (customer.token) {
								navigate('/account');
							} else {
								handleSigninModalOpen();
							}
						}}
					>
						<img
							src={`${process.env.PUBLIC_URL}/icons/icon-user.svg`}
							alt=''
							className='header-action-icon'
						/>
						<span className='header-action-text'>Кабинет</span>
					</a>
				</Flex>
			</div>
			{status === loadingStatus.SUCCEEDED && data.top_menu && (
				<div className='rn-header-bottom region'>
					<div className='rn-header-bottom-nav'>
						<a
							href='/page/promotions'
							className='rn-header-bottom-nav-item promotion'
							onClick={e => {
								e.preventDefault();
								navigate('/page/promotions');
							}}
						>
							<img
								src={`${process.env.PUBLIC_URL}/icons/icon-percent.svg`}
								alt=''
								className='header-bottom-icon'
							/>
							<span className='rn-header-bottom-nav-text'>Акции</span>
						</a>
						<a
							href={`/page/${data.top_menu.about.id}`}
							className='rn-header-bottom-nav-item'
							onClick={e => {
								e.preventDefault();
								navigate(`/page/${data.top_menu.about.id}`);
							}}
						>
							<img
								src={`${process.env.PUBLIC_URL}/icons/icon-info.svg`}
								alt=''
								className='header-bottom-icon'
							/>
							<span className='rn-header-bottom-nav-text'>О компании</span>
						</a>
						<a
							href={`/page/${data.top_menu.delivery.id}`}
							className='rn-header-bottom-nav-item'
							onClick={e => {
								e.preventDefault();
								navigate(`/page/${data.top_menu.delivery.id}`);
							}}
						>
							<img
								src={`${process.env.PUBLIC_URL}/icons/icon-shipping.svg`}
								alt=''
								className='header-bottom-icon'
							/>
							<span className='rn-header-bottom-nav-text'>
								Доставка и оплата
							</span>
						</a>
						<a
							href='/contact'
							className='rn-header-bottom-nav-item'
							onClick={e => {
								e.preventDefault();
								navigate('/contact');
							}}
						>
							<img
								src={`${process.env.PUBLIC_URL}/icons/icon-envelope.svg`}
								alt=''
								className='header-bottom-icon'
							/>
							<span className='rn-header-bottom-nav-text'>Контакты</span>
						</a>
					</div>
					<div className='rn-header-bottom-divider'></div>
					<div className='rn-header-bottom-scroll-wrapper'>
						<div className='rn-header-bottom-scroll' ref={scrollRef}>
							{categoriesStatus === loadingStatus.SUCCEEDED &&
								categoriesData?.categories
									?.filter(cat => cat.children && cat.children.length > 0)
									.flatMap(cat => cat.children)
									.map((category, index) => (
										<a
											key={index}
											href={`/catalog/${category.path || category.slug}`}
											className='rn-header-bottom-scroll-item'
											onClick={e => {
												e.preventDefault();
												navigate(`/catalog/${category.path || category.slug}`);
											}}
										>
											{category.name || 'Сорт говядины'}
										</a>
									))}
						</div>
						{showLeftArrow && (
							<img
								src={`${process.env.PUBLIC_URL}/icons/icon-arrow-right.svg`}
								alt=''
								className='rn-header-bottom-scroll-arrow left'
								onClick={e => {
									e.stopPropagation();
									if (scrollRef.current) {
										scrollRef.current.scrollBy({
											left: -200,
											behavior: 'smooth',
										});
									}
								}}
							/>
						)}
						{showRightArrow && (
							<img
								src={`${process.env.PUBLIC_URL}/icons/icon-arrow-right.svg`}
								alt=''
								className='rn-header-bottom-scroll-arrow'
								onClick={e => {
									e.stopPropagation();
									if (scrollRef.current) {
										scrollRef.current.scrollBy({
											left: 200,
											behavior: 'smooth',
										});
									}
								}}
							/>
						)}
					</div>
				</div>
			)}
		</div>
	);
};

export default HeaderLayout;
