import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Dropdown, Flex, Menu, Button, Badge, Skeleton, Card } from 'antd';
import {
	DownOutlined,
	ShoppingCartOutlined,
	HeartOutlined,
	UserOutlined,
} from '@ant-design/icons';

import {
	setSigninModalIsOpen,
	fetchMainInfo,
	setDeliveryModalIsOpen,
} from 'store/slices/layoutSlice';
import { fetchCartProducts } from 'store/slices/cartSlice';
import Megamenu from 'components/menu/Megamenu';
import MiniCart from 'components/cart/MiniCart';
import SearchWithSuggest from 'components/form/SearchWithSuggest';
import InlineSpace from 'components/layout/InlineSpace';
import MobileHeader from './MobileHeader';
import useBreakpoint from 'hooks/useBreakpoint';
import useSmartNavigate from 'hooks/useSmartNavigate';
import useAdditionalMenu from 'hooks/useAdditionalMenu';
import useCustomer from 'hooks/useCustomer';
import { loadingStatus } from 'helpers/fetcher';
import { formatCurrency } from 'helpers/formatter';
import { getImage } from 'helpers';

const HeaderLayout = () => {
	const dispatch = useDispatch();
	const cartProducts = useSelector(state => state.cart.cartProducts);
	const { data, status } = useSelector(state => state.layout.mainInfo);
	const location = useLocation();
	const { navigate } = useSmartNavigate();
	const { customer, setCustomer } = useCustomer();
	const { isMobile, isTablet, breakpoint } = useBreakpoint();
	const additionalMenu = useAdditionalMenu();

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

	const handleMenuClick = ({ key, keyPath, domEvent }) => {
		navigate(key);
	};

	const handleSetDeliveryOpen = () => {
		dispatch(setDeliveryModalIsOpen(true));
	};

	useEffect(() => {
		dispatch(fetchMainInfo());
		dispatch(fetchCartProducts());
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
			<div className='tn-top-rail region'>
				<Flex vertical={false} justify='space-between' align='center'>
					<Dropdown
						menu={{ items: data.cities_list, onClick: handleCityClick }}
					>
						{status === loadingStatus.SUCCEEDED ? (
							<Button type='primary' ghost>
								{data.cities_list[customer.store_id].label} <DownOutlined />
							</Button>
						) : (
							<Skeleton.Button active />
						)}
					</Dropdown>
					<InlineSpace width={10} />
					{loadingStatus.SUCCEEDED === status ? (
						<Menu
							mode='horizontal'
							items={[{ label: 'Каталог', key: '/catalog' }, ...additionalMenu]}
							onClick={handleMenuClick}
							style={{ flex: 1, minWidth: 0 }}
						/>
					) : (
						<Skeleton.Button active block />
					)}
					{breakpoint === 'lg' && (
						<div className='rn-telephone'>
							<a href={`tel: ${data.telephone}`}>{data.telephone}</a>
						</div>
					)}
					<Button
						type='primary'
						size='small'
						onClick={handleSetDeliveryOpen}
						className='ml-20'
					>
						Стоимость доставки
					</Button>
				</Flex>
			</div>
			<div className='rn-header region'>
				<Flex
					align='center'
					style={{ width: ['xxl', 'xl'].includes(breakpoint) ? '60%' : '70%' }}
				>
					<a href='/' onClick={handleLogoClick}>
						<img
							src={getImage('catalog/logo_new-new-mirror.jpg')}
							style={{ width: 68 }}
							alt=''
						/>
					</a>
					<InlineSpace width={20} />
					<Megamenu />
					<InlineSpace width={20} />
					<SearchWithSuggest />
				</Flex>
				<Flex>
					<InlineSpace width={20} />
					{['xxl', 'xl'].includes(breakpoint) && (
						<div className='rn-telephone'>
							<a href={`tel: ${data.telephone}`}>{data.telephone}</a>
							<div className='rn-telephone__text text-gray'>
								{data.work_time}
							</div>
						</div>
					)}
					<InlineSpace width={20} />
					<Button
						size='large'
						type='text'
						icon={<UserOutlined style={{ fontSize: 25 }} />}
						onClick={
							customer.token
								? () => navigate('/account')
								: handleSigninModalOpen
						}
					>
						{breakpoint === 'xxl' ? (customer.token ? 'Кабинет' : 'Войти') : ''}
					</Button>
					<InlineSpace width={10} />
					<Button
						size='large'
						type='text'
						icon={<HeartOutlined style={{ fontSize: 25, color: '#F5222D' }} />}
						onClick={
							customer.token
								? () => navigate('/account/wishlist')
								: handleSigninModalOpen
						}
					/>
					<InlineSpace width={10} />
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
						<Badge
							count={cartProducts.data.count}
							offset={[-(total.length && 30 + total.length * 8), 5]}
						>
							<Button
								type='text'
								size='large'
								icon={<ShoppingCartOutlined style={{ fontSize: 25 }} />}
								loading={loadingStatus.SUCCEEDED !== cartProducts.status}
								onClick={() => navigate('/cart')}
							>
								{total ? formatCurrency(total) : ''}
							</Button>
						</Badge>
					</Dropdown>
				</Flex>
			</div>
		</div>
	);
};

export default HeaderLayout;
