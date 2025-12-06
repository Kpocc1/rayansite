import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Carousel, Skeleton, Row, Col } from 'antd';

import { fetchTopModules } from 'store/slices/moduleSlice';
import { fetchCategory } from 'store/slices/productSlice';
import Catalog from 'pages/catalog';
import { menuFlatter } from 'helpers';
import useSmartNavigate from 'hooks/useSmartNavigate';
import { loadingStatus } from 'helpers/fetcher';
import { PRODUCTS_GRID } from 'constants/breakpoints';
import WishlistButton from 'components/cart/WishlistButton';
import CartQtyButtonGroup from 'components/cart/CartQtyButtonGroup';
import { formatCurrency, formatWeightWithUnit } from 'helpers/formatter';
import { getStock } from 'helpers/product';

const Home = () => {
  const dispatch = useDispatch();
  const [popularProducts, setPopularProducts] = useState([]);
  const [popularLoading, setPopularLoading] = useState(true);
  // const bottomModules = useSelector((state) => state.module.bottomModules);
	const topModules = useSelector(state => state.module.topModules);
	const { data: menuData } = useSelector(state => state.menu.categoriesList);
  const { navigate } = useSmartNavigate();

	const slideshow = topModules.data.modules?.find(d => d.code === 'slideshow');
  // const featured = bottomModules.data.modules?.find((d) => d.code === "featured");

  useEffect(() => {
    dispatch(fetchTopModules());
    // dispatch(fetchBottomModules());
  }, [dispatch]);
  
  // Загружаем товары из мясных категорий когда данные меню доступны
  useEffect(() => {
		if (!menuData?.categories) return;
		
		const loadPopularProducts = async () => {
			setPopularLoading(true);
			// Мясные категории по slug: говядина, баранина, птица, колбасные изделия
			const meatCategoryPaths = ['govyadina', 'baranina', 'ptitsa', 'kolbasnye-izdeliya', 'delikatesy', 'subprodukty'];
			const allProducts = [];
			
			// Получаем плоский список категорий
			const flatCategories = menuFlatter(menuData.categories);
			
			// Находим href для мясных категорий и загружаем товары
			for (const path of meatCategoryPaths) {
				const category = flatCategories.find(c => c.path === path);
				if (!category?.href) continue;
				
				try {
					// Используем тот же подход что и fetchCategory
					const result = await dispatch(fetchCategory({ 
						url: category.href, 
						searchParams: 'limit=10' 
					})).unwrap();
					
					if (result.products && result.products.length > 0) {
						allProducts.push(...result.products);
					}
					// Если уже набрали достаточно товаров в наличии, прекращаем
					const inStock = allProducts.filter(item => {
						if (!item) return false;
						const stock = getStock(item);
						return stock.stock > 0;
					});
					if (inStock.length >= 4) break;
				} catch (e) {
					// Продолжаем с другими категориями
				}
			}
			
			// Фильтруем только товары в наличии
			const inStockProducts = allProducts.filter(item => {
				if (!item) return false;
				const stock = getStock(item);
				return stock.stock > 0;
			});
			
			// Убираем дубликаты
			const uniqueProducts = inStockProducts.filter((item, index, self) => 
				self.findIndex(p => p.product_id === item.product_id) === index
			);
			
			setPopularProducts(uniqueProducts.slice(0, 4));
			setPopularLoading(false);
		};
		
		loadPopularProducts();
  }, [menuData, dispatch]);

  return (
    <>
			<div className='region hero-banner-wrapper'>
				<div className='text-center'>
          {loadingStatus.SUCCEEDED === topModules.status ? (
            <Carousel autoplay>
              {slideshow.banners.map((b, index) => (
                <div key={index} onClick={() => navigate(b.link)}>
									<img
										src={b.image}
										alt={b.title}
										style={{
											margin: '0 auto',
											width: '100%',
											height: 'auto',
											display: 'block',
										}}
									/>
                </div>
              ))}
            </Carousel>
          ) : (
            <Skeleton.Image active style={{ width: 859, height: 360 }} />
          )}
        </div>
      </div>

      {/* <HeadingTitle title={featured?.heading_title} />
      <List
        grid={PRODUCTS_GRID}
        className="rn-product-grid"
        dataSource={featured?.products || Array(5).fill({})}
        renderItem={(item) => (
          <Skeleton active loading={loadingStatus.SUCCEEDED !== bottomModules.status}>
            <ProductItem item={item} />
          </Skeleton>
        )}
      /> */}

			<Catalog
				breadcrumb={<></>}
				grid={{ ...PRODUCTS_GRID, xs: 2, gutter: 24 }}
			/>

			<div className='region popular-products-section'>
				<div className='popular-products-header'>
					<h2 className='popular-products-title'>ПОПУЛЯРНЫЕ ТОВАРЫ</h2>
					<a
						href='#'
						onClick={e => {
							e.preventDefault();
							navigate('/catalog');
						}}
						className='popular-products-link catalog-link-all'
					>
						<span className='catalog-link-text'>В каталог</span>
						<img
							src={`${process.env.PUBLIC_URL}/icons/icon-arrow-right-gray.svg`}
							alt=''
							className='catalog-link-icon'
						/>
					</a>
				</div>
				{!popularLoading && popularProducts.length > 0 ? (
					<Row gutter={24} className='popular-products-list'>
						{popularProducts
							.map((item, index) => {
							const stock = getStock(item);
							const handleGotoItem = () => {
								if (item.product_id && item.slug) {
									navigate(`/product/${item.product_id}/${item.slug}`);
								}
							};

							return (
								<Col xs={12} sm={12} md={6} key={item.product_id || index}>
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
						{Array(4)
							.fill({})
							.map((_, index) => (
								<Col xs={12} sm={12} md={6} key={index}>
									<Skeleton active avatar paragraph={{ rows: 4 }} />
								</Col>
							))}
					</Row>
				)}
			</div>

			<div className='region quality-section'>
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

			{/* <div className='region discounts-section'>
				<div className='popular-products-header'>
					<h2 className='popular-products-title'>ВАШИ СКИДКИ</h2>
					<a
						href='/catalog'
						onClick={e => {
							e.preventDefault();
							navigate('/catalog');
						}}
						className='popular-products-link catalog-link-all'
					>
						<span className='catalog-link-text'>В каталог</span>
						<img
							src={`${process.env.PUBLIC_URL}/icons/icon-arrow-right-gray.svg`}
							alt=''
							className='catalog-link-icon'
						/>
					</a>
				</div>
				<Row gutter={24} className='popular-products-list'>
					{[
						{
							name: 'Ягненок задняя часть (целиком)',
							image: 'catalog/cat-cover/cat-baranina.jpg',
							price: 3956,
							weight: '4,11 кг',
							stock: '6',
							product_id: 1,
							slug: 'yagnenok-zadnyaya-chast',
						},
						{
							name: 'Говядина премиум',
							image: 'catalog/cat-cover/cat-goviadina.jpg',
							price: 2450,
							weight: '2,5 кг',
							stock: '12',
							product_id: 2,
							slug: 'govyadina-premium',
						},
						{
							name: 'Куриные окорочка',
							image: 'catalog/cat-cover/cat-ptica.jpg',
							price: 890,
							weight: '1,2 кг',
							stock: '24',
							product_id: 3,
							slug: 'kurinye-okorochka',
						},
						{
							name: 'Колбаса домашняя',
							image: 'catalog/cat-cover/cat-kolbasy.jpg',
							price: 1250,
							weight: '0,8 кг',
							stock: '8',
							product_id: 4,
							slug: 'kolbasa-domashnyaya',
						},
					].map((product, index) => {
						const discountPercent = Math.floor(Math.random() * 11) + 10; // 10-20%
						const discountedPrice = product.price;
						const originalPrice = Math.round(
							product.price / (1 - discountPercent / 100)
						);
						const formattedDiscountedPrice =
							discountedPrice.toLocaleString('ru-RU');
						const formattedOriginalPrice =
							originalPrice.toLocaleString('ru-RU');

						return (
							<Col xs={12} sm={12} md={6} key={index}>
								<div
									className='popular-product-card'
									onClick={() =>
										navigate(`/product/${product.product_id}/${product.slug}`)
									}
									style={{ cursor: 'pointer' }}
								>
									<div className='popular-product-image-wrapper'>
										<img
											src={getImage(product.image)}
											alt={product.name}
											className='popular-product-image'
										/>
										<div className='discount-badge'>
											<span className='discount-badge-text'>
												-{discountPercent}%
											</span>
										</div>
										<div className='popular-product-rating'>
											<img
												src={`${process.env.PUBLIC_URL}/icons/icon-star.svg`}
												alt='Рейтинг'
												className='popular-product-rating-icon'
											/>
											<span className='popular-product-rating-value'>4,6</span>
										</div>
									</div>
									<div
										className='popular-product-favorite'
										onClick={e => e.stopPropagation()}
									>
										<WishlistButton
											product_id={product.product_id}
											active={product.in_wishlist}
										/>
									</div>
									<h3 className='popular-product-title'>
										{product.name}, {product.weight}
									</h3>
									<div className='discount-product-price-row'>
										<div className='discount-price-wrapper'>
											<span className='discount-product-price'>
												{formattedDiscountedPrice} ₽
											</span>
											<span className='discount-product-price-old'>
												{formattedOriginalPrice} ₽
											</span>
										</div>
										<span className='popular-product-weight'>
											{product.weight}
										</span>
									</div>
									<button
										className='popular-product-button'
										onClick={e => {
											e.stopPropagation();
											// TODO: Добавить логику добавления в корзину
										}}
									>
										<img
											src={`${process.env.PUBLIC_URL}/icons/icon-shopping-cart.svg`}
											alt=''
											className='popular-product-button-icon'
										/>
										<span>В корзину</span>
									</button>
									<div className='popular-product-stock'>
										В наличии {product.stock} шт.
									</div>
								</div>
							</Col>
						);
					})}
				</Row>
			</div> */}

			<div className='region about-section'>
				<div className='about-content'>
					<div className='about-text'>
						<h2 className='about-title'>
							<span className='about-title-brand'>«РАЙЯН»</span>: ГОРДОСТЬ
							КАВКАЗА, ВКУС ПРИРОДЫ
						</h2>
						<div className='about-main-text'>
							<p>
								Почти все самые высокие вершины Европы, в том числе и Эльбрус,
								расположены на территории этой небольшой республики.
							</p>
							<p>
								Скот здесь выращивают на высокогорных пастбищах в зоне
								альпийских лугов. Животные питаются сочной травой пьют
								ледниковую талую воду и дышат звенящим горным воздухом.
							</p>
							<p>
								Мясо таких животных обладает особой ценностью. Мы понимаем, что
								качество начинается уже с откорма животных, поэтому имеем
								собственную животноводческую ферму, где выращиваются животные на
								естественных кормах, без применения антибиотиков и стимуляторов
								роста, что позволяет получить высококачественное сырье для
								комбината.
							</p>
						</div>
						<p className='about-brand-text'>
							Вся продукция мясокомбината выпускается под брендом «РАЙЯН»
						</p>
					</div>
					<div className='about-image'>
						<img
							src={`${process.env.PUBLIC_URL}/images/about-landscape.png`}
							alt='Горный пейзаж'
							className='about-image-img'
						/>
					</div>
        </div>
      </div>
    </>
  );
};

export default Home;
