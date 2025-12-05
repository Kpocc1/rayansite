import { removeCustomer } from 'helpers/customer';
import useBreakpoint from 'hooks/useBreakpoint';

const AccountLogoutButton = () => {
	const { isMobile, isTablet } = useBreakpoint();
	const isMobileView = isMobile || isTablet;

	const handleLogout = () => {
		removeCustomer();
		window.location = '/';
	};

	// Только для мобильной версии
	if (!isMobileView) {
		return null;
	}

	return (
		<div className="account-logout-wrapper">
			<button type="button" className="account-menu-logout" onClick={handleLogout}>
				Выйти
			</button>
		</div>
	);
};

export default AccountLogoutButton;



