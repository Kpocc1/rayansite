import { BrowserRouter } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ConfigProvider, Layout, Modal } from 'antd';

import DeliveryCalculate from 'components/modal/DeliveryCalculate';
import SignIn from 'components/modal/SignIn';
import YookassaWidget from 'components/modal/YookassaWidget';
import CityConfirm from 'components/modal/CityConfirm';
import SearchWithSuggest from 'components/form/SearchWithSuggest';
import HeaderLayout from './HeaderLayout';
import FooterLayout from './FooterLayout';
import {
	setDeliveryModalIsOpen,
	setMobileSearchModalIsOpen,
	setSigninModalIsOpen,
	setYookassaWidgetModalIsOpen,
	setCityConfirmModalIsOpen,
} from 'store/slices/layoutSlice';

const MainLayout = ({ children }) => {
	const dispatch = useDispatch();
	const {
		deliveryModalIsOpen,
		signinModalIsOpen,
		yookassaWidgetModalIsOpen,
		mobileSearchModalIsOpen,
		cityConfirmModalIsOpen,
	} = useSelector(state => state.layout);

	const handleDeliveryModalClose = () => {
		dispatch(setDeliveryModalIsOpen(false));
	};

	const handleSigninModalClose = () => {
		dispatch(setSigninModalIsOpen(false));
	};

	const handleYookassaWidgetModalClose = () => {
		dispatch(setYookassaWidgetModalIsOpen(false));
	};

	const handleMobileSearchModalClose = () => {
		dispatch(setMobileSearchModalIsOpen(false));
	};

	const handleCityConfirmModalClose = () => {
		dispatch(setCityConfirmModalIsOpen(false));
	};

	// Проверяем, нужно ли показать окно выбора города
	useEffect(() => {
		const cityConfirmed = localStorage.getItem('cityConfirmed');
		if (!cityConfirmed) {
			// Небольшая задержка, чтобы окно появилось после загрузки страницы
			const timer = setTimeout(() => {
				dispatch(setCityConfirmModalIsOpen(true));
			}, 1000);
			return () => clearTimeout(timer);
		}
	}, [dispatch]);

	return (
		<Layout className='rn-layout'>
			<BrowserRouter>
				<HeaderLayout />
				<Layout.Content className='rm-main'>{children}</Layout.Content>
				<FooterLayout />

				<Modal
					width={1000}
					open={deliveryModalIsOpen}
					onCancel={handleDeliveryModalClose}
					footer={null}
				>
					<DeliveryCalculate />
				</Modal>
				<Modal
					width={420}
					centered
					open={signinModalIsOpen}
					onCancel={handleSigninModalClose}
					footer={null}
				>
					<SignIn />
				</Modal>
				<Modal
					width={500}
					centered
					open={yookassaWidgetModalIsOpen}
					onCancel={handleYookassaWidgetModalClose}
					footer={null}
				>
					<YookassaWidget />
				</Modal>
				<ConfigProvider
					modal={{
						styles: {
							content: { padding: 0, boxShadow: 'none', border: 'none' },
							mask: { background: 'white' },
							header: { padding: '10px 15px 15px 15px', margin: 0 },
						},
					}}
				>
					<Modal
						style={{ top: 5, padding: 0 }}
						open={mobileSearchModalIsOpen}
						title='Поиск'
						onCancel={handleMobileSearchModalClose}
						footer={null}
					>
						<SearchWithSuggest
							listHeight={window.innerHeight - 165}
							isDesktop={false}
							onClose={handleMobileSearchModalClose}
						/>
					</Modal>
				</ConfigProvider>

				{/* Модальное окно подтверждения города */}
				<Modal
					open={cityConfirmModalIsOpen}
					onCancel={handleCityConfirmModalClose}
					footer={null}
					closable={false}
					mask={false}
					width='auto'
					style={{
						position: 'fixed',
						top: 20,
						right: 20,
						margin: 0,
						paddingBottom: 0,
					}}
					styles={{
						body: { padding: 0 },
						content: { padding: 0 },
					}}
				>
					<CityConfirm onClose={handleCityConfirmModalClose} />
				</Modal>
			</BrowserRouter>
		</Layout>
	);
};

export default MainLayout;
