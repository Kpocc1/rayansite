import { useState } from 'react';
import useSmartNavigate from 'hooks/useSmartNavigate';
import { removeCustomer } from 'helpers/customer';
import { useLocation } from 'react-router-dom';
import useBreakpoint from 'hooks/useBreakpoint';

const accountItems = [
  {
		label: 'Профиль',
		key: '/account',
		icon: `${process.env.PUBLIC_URL}/icons/icon-profile.svg`,
		iconActive: `${process.env.PUBLIC_URL}/icons/icon-profile-active.svg`,
  },
  {
		label: 'Безопасность',
		key: '/account/password',
		icon: `${process.env.PUBLIC_URL}/icons/icon-lock-account.svg`,
		iconActive: `${process.env.PUBLIC_URL}/icons/icon-lock-account-active.svg`,
  },
  {
		label: 'История заказов',
		key: '/account/history',
		icon: `${process.env.PUBLIC_URL}/icons/icon-clock-account.svg`,
		iconActive: `${process.env.PUBLIC_URL}/icons/icon-clock-account-active.svg`,
  },
  {
		label: 'Избранное',
		key: '/account/wishlist',
		icon: `${process.env.PUBLIC_URL}/icons/icon-heart-account.svg`,
		iconActive: `${process.env.PUBLIC_URL}/icons/icon-heart-account-active.svg`,
	},
];

const AccountMenu = () => {
  const { navigate } = useSmartNavigate();
	const location = useLocation();
	const { isMobile, isTablet } = useBreakpoint();
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);

	const isMobileView = isMobile || isTablet;

	const handleMenuClick = key => {
		if (isMobileView) {
			setIsDropdownOpen(false);
		}
    navigate(key);
  };

  const handleLogout = () => {
    removeCustomer();
		window.location = '/';
	};

	const isActive = key => {
		if (key === '/account') {
			return location.pathname === '/account';
		}
		return location.pathname.startsWith(key);
  };

	// Найти активный пункт меню
	const activeItem = accountItems.find(item => isActive(item.key)) || accountItems[0];

	// Мобильная версия - дропдаун (без кнопки выхода, она добавляется отдельно)
	if (isMobileView) {
		return (
			<div className="account-menu account-menu-mobile">
				{/* Выбранный раздел - кнопка дропдауна */}
				<button
					type="button"
					className={`account-menu-dropdown-trigger ${isDropdownOpen ? 'open' : ''}`}
					onClick={() => setIsDropdownOpen(!isDropdownOpen)}
				>
					<img
						src={activeItem.iconActive}
						alt=""
						className="account-menu-icon"
					/>
					<span className="account-menu-label">{activeItem.label}</span>
					<img
						src={`${process.env.PUBLIC_URL}/icons/icon-chevron-down.svg`}
						alt=""
						className={`account-menu-dropdown-arrow ${isDropdownOpen ? 'open' : ''}`}
					/>
				</button>

				{/* Выпадающий список */}
				{isDropdownOpen && (
					<div className="account-menu-dropdown">
						{accountItems.map(item => (
							<button
								key={item.key}
								type="button"
								className={`account-menu-item ${isActive(item.key) ? 'account-menu-item-active' : ''}`}
								onClick={() => handleMenuClick(item.key)}
							>
								<img
									src={isActive(item.key) ? item.iconActive : item.icon}
									alt=""
									className="account-menu-icon"
								/>
								<span className="account-menu-label">{item.label}</span>
							</button>
						))}
					</div>
				)}
			</div>
		);
	}

	// Десктопная версия
  return (
		<div className="account-menu">
			<div className="account-menu-items">
				{accountItems.map(item => (
					<button
						key={item.key}
						type="button"
						className={`account-menu-item ${isActive(item.key) ? 'account-menu-item-active' : ''}`}
						onClick={() => handleMenuClick(item.key)}
					>
						<img
							src={isActive(item.key) ? item.iconActive : item.icon}
							alt=""
							className="account-menu-icon"
						/>
						<span className="account-menu-label">{item.label}</span>
					</button>
				))}
			</div>
			<button type="button" className="account-menu-logout" onClick={handleLogout}>
				Выйти
			</button>
		</div>
  );
};

export default AccountMenu;
