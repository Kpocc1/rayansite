import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Dropdown, Skeleton } from 'antd';

import useSmartNavigate from 'hooks/useSmartNavigate';
import { getImage } from 'helpers';
import { loadingStatus } from 'helpers/fetcher';

const MobileHeader = ({
  customer,
  handleSigninModalOpen,
  data,
  total,
  handleCityClick,
  handleLogoClick,
	status,
}) => {
	const { navigate, categoryNavigate } = useSmartNavigate();
	const [menuOpen, setMenuOpen] = useState(false);
	const [catalogOpen, setCatalogOpen] = useState(false);
	const [expandedCategories, setExpandedCategories] = useState({});
	const [searchValue, setSearchValue] = useState('');
	const cartProducts = useSelector(state => state.cart.cartProducts);
	const { data: menuData, status: menuStatus } = useSelector(state => state.menu.categoriesList);

	const handleSearch = () => {
		if (searchValue.trim()) {
			navigate(`/catalog?search=${encodeURIComponent(searchValue.trim())}`);
			setSearchValue('');
		}
	};

	const handleMenuItemClick = (path, requiresAuth = false) => {
		setMenuOpen(false);
		if (requiresAuth && !customer.token) {
			handleSigninModalOpen();
		} else {
			navigate(path);
		}
	};

	const handleCategoryClick = (category) => {
		setCatalogOpen(false);
		categoryNavigate({ key: category.key });
	};

	const toggleCategory = (categoryKey) => {
		setExpandedCategories(prev => ({
			...prev,
			[categoryKey]: !prev[categoryKey]
		}));
	};

	const cartTotal = cartProducts.data.totals?.find(t => t.code === 'total')?.text || '';

  return (
    <>
			{/* Верхний бар с городом и телефоном */}
			<div 
				className='mobile-top-bar'
				style={{
					backgroundImage: `url(${process.env.PUBLIC_URL}/images/header-background.png)`,
					backgroundSize: 'cover',
					backgroundPosition: 'center',
					backgroundRepeat: 'no-repeat',
				}}
			>
				<div className='mobile-container'>
					<Dropdown
						trigger={['click']}
						menu={{
							items: data.cities_list,
							onClick: handleCityClick,
						}}
						overlayClassName='city-dropdown-overlay'
					>
						{status === loadingStatus.SUCCEEDED ? (
							<button className='mobile-city-button'>
								<img
									src={`${process.env.PUBLIC_URL}/icons/icon-map-marker.svg`}
									alt=''
									className='mobile-city-icon'
								/>
								<span className='mobile-city-name'>
									{data.cities_list?.[customer.store_id]?.label || 'Город'}
								</span>
								<img
									src={`${process.env.PUBLIC_URL}/icons/icon-arrow-down.svg`}
									alt=''
									className='mobile-city-arrow'
								/>
							</button>
						) : (
							<Skeleton.Button active size='small' />
						)}
					</Dropdown>
					{status === loadingStatus.SUCCEEDED && data.telephone && (
						<a href={`tel:${data.telephone}`} className='mobile-phone-link'>
							<img
								src={`${process.env.PUBLIC_URL}/icons/icon-phone.svg`}
								alt=''
								className='mobile-phone-icon'
							/>
							<span>{data.telephone}</span>
						</a>
					)}
				</div>
			</div>

			{/* Основной хедер с логотипом, каталогом и бургером */}
			<div className='mobile-header'>
				<div className='mobile-container'>
					<a href='/' onClick={handleLogoClick} className='mobile-logo'>
						<img
							src={getImage('catalog/logo_new-new-mirror.jpg')}
							alt='Райян'
						/>
					</a>
					<div className='mobile-header-right'>
						<button
							className='mobile-catalog-button'
							onClick={() => setCatalogOpen(true)}
						>
							<img
								src={`${process.env.PUBLIC_URL}/icons/icon-catalog.svg`}
								alt=''
								className='mobile-catalog-icon'
							/>
							<span>Каталог</span>
						</button>
						<button
							type='button'
							className='mobile-burger-button'
							onClick={() => setMenuOpen(true)}
						>
							<img
								src={`${process.env.PUBLIC_URL}/icons/icon-burger-menu.svg`}
								alt='Меню'
								className='mobile-burger-icon'
							/>
						</button>
					</div>
				</div>
			</div>

			{/* Строка поиска */}
			<div className='mobile-search'>
				<div className='mobile-container'>
					<div className='mobile-search-wrapper'>
						<img
							src={`${process.env.PUBLIC_URL}/icons/icon-search.svg`}
							alt=''
							className='mobile-search-icon'
						/>
						<input
							type='text'
							placeholder='Мясо баранина'
							value={searchValue}
							onChange={e => setSearchValue(e.target.value)}
							onKeyDown={e => e.key === 'Enter' && handleSearch()}
							className='mobile-search-input'
						/>
						<button className='mobile-search-button' onClick={handleSearch}>
							Найти
						</button>
					</div>
				</div>
			</div>

			{/* Бургер меню */}
			{menuOpen && (
				<div className='mobile-menu-overlay' onClick={() => setMenuOpen(false)}>
					<div
						className='mobile-menu'
						onClick={e => e.stopPropagation()}
					>
						<div className='mobile-menu-header'>
							<span className='mobile-menu-title'>МЕНЮ</span>
							<button
								className='mobile-menu-close'
								onClick={() => setMenuOpen(false)}
							>
								<img
									src={`${process.env.PUBLIC_URL}/icons/icon-close.svg`}
									alt='Закрыть'
								/>
							</button>
						</div>
						<div className='mobile-menu-content'>
							{/* Корзина */}
							<a
								href='/cart'
								className={`mobile-menu-item ${cartProducts.data.count && cartProducts.data.count > 0 ? 'mobile-menu-item-cart-active' : ''}`}
								onClick={e => {
									e.preventDefault();
									handleMenuItemClick('/cart');
								}}
							>
								<img
									src={`${process.env.PUBLIC_URL}/icons/${cartProducts.data.count && cartProducts.data.count > 0 ? 'icon-cart-red.svg' : 'icon-cart.svg'}`}
									alt=''
								/>
								<span className='mobile-menu-cart-badge'>
									{cartTotal || '0 ₽'}
								</span>
							</a>

							{/* Кабинет */}
							<a
								href='/account'
								className='mobile-menu-item'
								onClick={e => {
									e.preventDefault();
									handleMenuItemClick('/account', true);
								}}
							>
								<img
									src={`${process.env.PUBLIC_URL}/icons/icon-user.svg`}
									alt=''
								/>
								<span>Кабинет</span>
							</a>

							{/* Заказы */}
							<a
								href='/account/history'
								className='mobile-menu-item'
								onClick={e => {
									e.preventDefault();
									handleMenuItemClick('/account/history', true);
								}}
							>
								<img
									src={`${process.env.PUBLIC_URL}/icons/icon-clock.svg`}
									alt=''
								/>
								<span>Заказы</span>
							</a>

							{/* Избранное */}
							<a
								href='/account/wishlist'
								className='mobile-menu-item'
								onClick={e => {
									e.preventDefault();
									handleMenuItemClick('/account/wishlist', true);
								}}
							>
								<img
									src={`${process.env.PUBLIC_URL}/icons/icon-heart.svg`}
									alt=''
								/>
								<span>Избранное</span>
							</a>

							{/* Вакансии */}
							{data.top_menu?.vacancies && (
								<a
									href={`/page/${data.top_menu.vacancies.id}`}
									className='mobile-menu-item mobile-menu-item-text'
									onClick={e => {
										e.preventDefault();
										handleMenuItemClick(`/page/${data.top_menu.vacancies.id}`);
									}}
								>
									<span>Вакансии</span>
								</a>
							)}

							{/* Оставьте отзыв */}
							<a
								href='/reviews'
								className='mobile-menu-item mobile-menu-item-text'
								onClick={e => {
									e.preventDefault();
									handleMenuItemClick('/reviews');
								}}
							>
								<span>Оставьте отзыв</span>
							</a>

							{/* Новости */}
							<a
								href='/news'
								className='mobile-menu-item mobile-menu-item-text'
								onClick={e => {
									e.preventDefault();
									handleMenuItemClick('/news');
								}}
							>
								<span>Новости</span>
							</a>

							{/* Сертификаты */}
							{data.top_menu?.certificate && (
								<a
									href={`/page/${data.top_menu.certificate.id}`}
									className='mobile-menu-item mobile-menu-item-text'
									onClick={e => {
										e.preventDefault();
										handleMenuItemClick(`/page/${data.top_menu.certificate.id}`);
									}}
								>
									<span>Сертификаты</span>
								</a>
							)}

							{/* Акции */}
							<a
								href='/page/promotions'
								className='mobile-menu-item mobile-menu-item-promo'
								onClick={e => {
									e.preventDefault();
									handleMenuItemClick('/page/promotions');
								}}
							>
								<img
									src={`${process.env.PUBLIC_URL}/icons/icon-percent.svg`}
									alt=''
								/>
								<span>Акции</span>
							</a>

							{/* О компании */}
							{data.top_menu?.about && (
								<a
									href={`/page/${data.top_menu.about.id}`}
									className='mobile-menu-item'
									onClick={e => {
										e.preventDefault();
										handleMenuItemClick(`/page/${data.top_menu.about.id}`);
									}}
								>
									<img
										src={`${process.env.PUBLIC_URL}/icons/icon-info.svg`}
										alt=''
									/>
									<span>О компании</span>
								</a>
							)}

							{/* Доставка и оплата */}
							{data.top_menu?.delivery && (
								<a
									href={`/page/${data.top_menu.delivery.id}`}
									className='mobile-menu-item'
									onClick={e => {
										e.preventDefault();
										handleMenuItemClick(`/page/${data.top_menu.delivery.id}`);
									}}
								>
									<img
										src={`${process.env.PUBLIC_URL}/icons/icon-shipping.svg`}
										alt=''
									/>
									<span>Доставка и оплата</span>
								</a>
							)}

							{/* Контакты */}
							<a
								href='/contact'
								className='mobile-menu-item'
								onClick={e => {
									e.preventDefault();
									handleMenuItemClick('/contact');
								}}
							>
            <img
									src={`${process.env.PUBLIC_URL}/icons/icon-envelope.svg`}
									alt=''
								/>
								<span>Контакты</span>
							</a>
						</div>
					</div>
				</div>
			)}

			{/* Меню каталога */}
			{catalogOpen && (
				<div className='mobile-menu-overlay' onClick={() => setCatalogOpen(false)}>
					<div
						className='mobile-menu mobile-catalog-menu'
						onClick={e => e.stopPropagation()}
					>
						<div className='mobile-menu-header'>
							<span className='mobile-menu-title'>КАТАЛОГ</span>
							<button
								className='mobile-menu-close'
								onClick={() => setCatalogOpen(false)}
							>
								<img
									src={`${process.env.PUBLIC_URL}/icons/icon-close.svg`}
									alt='Закрыть'
            />
							</button>
						</div>
						<div className='mobile-menu-content mobile-catalog-content'>
							{menuStatus === loadingStatus.SUCCEEDED && menuData.categories ? (
								menuData.categories.map(category => (
									<div key={category.key} className='mobile-catalog-category'>
										<div
											className='mobile-catalog-item'
											onClick={() => {
												if (category.children && category.children.length > 0) {
													toggleCategory(category.key);
												} else {
													handleCategoryClick(category);
												}
											}}
										>
											<span className={expandedCategories[category.key] ? 'mobile-catalog-item-active' : ''}>
												{category.label}
											</span>
											{category.children && category.children.length > 0 && (
												<img
													src={`${process.env.PUBLIC_URL}/icons/icon-arrow-down-small.svg`}
													alt=''
													className={`mobile-catalog-arrow ${expandedCategories[category.key] ? 'mobile-catalog-arrow-open' : ''}`}
												/>
											)}
										</div>
										{expandedCategories[category.key] && category.children && (
											<div className='mobile-catalog-subcategories'>
												{category.children.map(subcategory => (
													<div
														key={subcategory.key}
														className='mobile-catalog-subcategory'
														onClick={() => handleCategoryClick(subcategory)}
													>
														{subcategory.label}
													</div>
												))}
											</div>
										)}
									</div>
								))
							) : (
								<div className='mobile-catalog-loading'>
									<Skeleton active paragraph={{ rows: 8 }} />
								</div>
							)}
						</div>
					</div>
      </div>
			)}
    </>
  );
};

export default MobileHeader;
