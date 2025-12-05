import { useEffect, useState, useRef, useMemo } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Skeleton } from 'antd';

import { fetchCategory } from 'store/slices/productSlice';
import CartQtyButtonGroup from 'components/cart/CartQtyButtonGroup';
import WishlistButton from 'components/cart/WishlistButton';
import useSmartNavigate from 'hooks/useSmartNavigate';
import { loadingStatus } from 'helpers/fetcher';
import { formatCurrency, formatWeightWithUnit } from 'helpers/formatter';
import { getStock } from 'helpers/product';
import { menuFlatter } from 'helpers';

const Category = () => {
  const dispatch = useDispatch();
	const navigate = useNavigate();
	const { data, status } = useSelector(state => state.product.category);
	const { data: menuData } = useSelector(state => state.menu.categoriesList);
	const { '*': path } = useParams();
  let [searchParams, setSearchParams] = useSearchParams();
	const { navigate: smartNavigate, getHref } = useSmartNavigate();
  const url = getHref(path);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const dropdownRef = useRef(null);

	// Находим родительскую категорию и текущую категорию
	const categoryPath = useMemo(() => {
		if (!path || !menuData?.categories)
			return { parent: null, current: null, siblings: [] };

		const flat = menuFlatter(menuData.categories);
		const currentCategory = flat.find(cat => cat.path === path);

		if (!currentCategory) return { parent: null, current: null, siblings: [] };

		// Ищем родительскую категорию в структуре и её подкатегории
		let parentCategory = null;
		let siblings = [];

		const findParent = (categories, targetPath, parent = null) => {
			for (const cat of categories || []) {
				if (cat.path === targetPath) {
					// Если нашли текущую категорию, возвращаем родителя и его подкатегории
					if (parent && parent.children) {
						siblings = parent.children.map(child => ({
							...child,
							name: child.name || child.label || child.title,
							path: child.path || child.slug,
						}));
					}
					return parent;
				}
				if (cat.children) {
					const found = findParent(cat.children, targetPath, cat);
					if (found !== null) return found;
				}
			}
			return null;
		};

		parentCategory = findParent(menuData.categories, path);

		// Если нет родителя, значит это родительская категория, берём её подкатегории
		if (!parentCategory && currentCategory.children) {
			siblings = currentCategory.children.map(child => ({
				...child,
				name: child.name || child.label || child.title,
				path: child.path || child.slug,
			}));
		}

		return {
			parent: parentCategory,
			current: currentCategory,
			siblings: siblings,
		};
	}, [path, menuData]);

  const handleSortSelect = (_, obj) => {
    const params = new URLSearchParams(searchParams);
    const params2 = new URLSearchParams(obj.query);
		params.set('sort', params2.get('sort'));
		params.set('order', params2.get('order'));
    setSearchParams(`&${params.toString()}`);
		setIsDropdownOpen(false);
  };

	const handlePagination = page => {
    const params = new URLSearchParams(searchParams);
		params.set('page', page);
    setSearchParams(`&${params.toString()}`);
  };

	const handleCategoryClick = categoryPathValue => {
		// Если категория уже активна, переходим на родительскую категорию
		if (categoryPathValue === path) {
			if (categoryPath.parent?.path) {
				smartNavigate(`/catalog/${categoryPath.parent.path}`);
			} else {
				// Если нет родителя, переходим на главную страницу каталога
				smartNavigate('/catalog');
			}
		} else {
			smartNavigate(`/catalog/${categoryPathValue}`);
		}
  };

  useEffect(() => {
    if (url) dispatch(fetchCategory({ url, searchParams }));
  }, [dispatch, url, searchParams]);

	// Закрытие дропдауна при клике вне его
	useEffect(() => {
		const handleClickOutside = event => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setIsDropdownOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	const currentSortLabel =
		data.sorts?.find(
			s =>
				s.value === `${data.sort}-${data.order}` ||
				s.value === `${data.sort}_${data.order}`
		)?.label || 'По дате публикации';

  return (
		<>
			<div className='region category-section'>
				{/* Breadcrumb */}
				<div className='contact-breadcrumb'>
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
							!categoryPath.parent ? 'breadcrumb-separator-active' : ''
						}`}
					></span>
					{categoryPath.parent && (
						<>
							<a
								href={`/catalog/${categoryPath.parent.path}`}
								onClick={e => {
									e.preventDefault();
									smartNavigate(`/catalog/${categoryPath.parent.path}`);
								}}
								className='breadcrumb-link'
							>
								{categoryPath.parent.name ||
									categoryPath.parent.label ||
									categoryPath.parent.title}
							</a>
							<span className='breadcrumb-separator breadcrumb-separator-active'></span>
						</>
					)}
					<span className='breadcrumb-current'>
						{data?.heading_title ||
							categoryPath.current?.name ||
							categoryPath.current?.label ||
							categoryPath.current?.title ||
							'Категория'}
					</span>
				</div>

				{/* Header with Title and Sort */}
				{status === loadingStatus.SUCCEEDED && data ? (
					<>
						<div className='category-header'>
							<h1 className='category-title'>
								{data.heading_title?.toUpperCase() || 'КАТЕГОРИЯ'}
							</h1>
							{data.sorts?.length > 0 && (
								<div className='category-sort-wrapper' ref={dropdownRef}>
									<button
										type='button'
										className={`category-sort-button ${
											isDropdownOpen ? 'active' : ''
										}`}
										onClick={() => setIsDropdownOpen(!isDropdownOpen)}
									>
										<span>{currentSortLabel}</span>
										<img
											src={`${process.env.PUBLIC_URL}/icons/icon-chevron-down.svg`}
											alt='Сортировать'
											className={`category-sort-icon ${
												isDropdownOpen ? 'rotated' : ''
											}`}
										/>
									</button>
									{isDropdownOpen && (
										<div className='category-sort-dropdown-menu'>
											{data.sorts.map(sort => {
												const sortValue =
													sort.value || `${sort.sort}-${sort.order}`;
												const isActive =
													sortValue === `${data.sort}-${data.order}` ||
													sortValue === `${data.sort}_${data.order}`;
												return (
													<div
														key={sortValue}
														className={`category-sort-dropdown-item ${
															isActive ? 'active' : ''
														}`}
														onClick={() =>
															handleSortSelect(null, {
																query: sort.query || sortValue,
															})
														}
													>
														{sort.label}
													</div>
												);
											})}
										</div>
									)}
								</div>
							)}
						</div>

						{/* Category Filters */}
						{(data.categories && data.categories.length > 0) ||
						(categoryPath.siblings && categoryPath.siblings.length > 0) ? (
							<div className='category-filters'>
								{(data.categories && data.categories.length > 0
									? data.categories
									: categoryPath.siblings
								).map((c, index) => {
									const categoryPathValue = c.path || c.slug;
									const isActive =
										categoryPathValue === path ||
										c.category_id === data.category_id ||
										c.key === categoryPath.current?.key;
									return (
										<button
											key={c.category_id || c.key || index}
											type='button'
											className={`category-filter-button ${
												isActive ? 'active' : ''
											}`}
											onClick={() => handleCategoryClick(categoryPathValue)}
										>
											{c.name || c.label || c.title}
										</button>
									);
								})}
							</div>
						) : null}
					</>
            ) : (
					<Skeleton active paragraph={{ rows: 2 }} />
            )}

				{/* Products Grid */}
				{status === loadingStatus.SUCCEEDED && data?.products ? (
					<Row gutter={24} className='popular-products-list'>
						{data.products.map((item, index) => {
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
										className='popular-product-card'
										onClick={handleGotoItem}
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
											<CartQtyButtonGroup item={item} block size='large' />
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
					<Row gutter={24} className='popular-products-list'>
						{Array(6)
							.fill({})
							.map((_, index) => (
								<Col xs={12} sm={12} md={8} lg={6} key={index}>
									<Skeleton active avatar paragraph={{ rows: 4 }} />
								</Col>
                  ))}
                </Row>
              )}

				{/* Pagination */}
				{status === loadingStatus.SUCCEEDED && data?.product_total > 0 && (
					<div className='text-center mt-30'>
						<div className='pagination-wrapper'>
							{/* Можно добавить пагинацию позже если нужно */}
						</div>
                </div>
              )}
			</div>

			{/* Quality Section */}
			<div
				className='region news-quality-section'
				style={{ marginBottom: '60px' }}
			>
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
		</>
  );
};

export default Category;
