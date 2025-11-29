import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { fetchNewsList } from 'store/slices/pageSlice';

const PageNewsList = () => {
	const [visibleCount, setVisibleCount] = useState(12); // сначала 12 статей
	const [sortBy, setSortBy] = useState('date'); // 'date', 'alphabet', 'views'
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const dropdownRef = useRef(null);
	const dispatch = useDispatch();
	const { data } = useSelector(state => state.page.newsList);
	const navigate = useNavigate();

	useEffect(() => {
		// Загружаем список новостей один раз
		dispatch(fetchNewsList());
	}, [dispatch]);

	const handleCardClick = newsId => {
		navigate(`/news/${newsId}`);
	};

	const handleLoadMore = () => {
		const list = data?.news_list || [];
		if (!list.length) return;
		setVisibleCount(prev => Math.min(prev + 3, list.length));
	};

	const handleSortChange = sortType => {
		setSortBy(sortType);
		setIsDropdownOpen(false);
		setVisibleCount(12); // Сбрасываем видимое количество при смене сортировки
	};

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

	const list = data?.news_list || [];

	// Сортировка списка
	let sortedList = [...list];
	if (sortBy === 'alphabet') {
		sortedList.sort((a, b) => {
			const titleA = (a.title || '').toLowerCase();
			const titleB = (b.title || '').toLowerCase();
			return titleA.localeCompare(titleB, 'ru');
		});
	} else if (sortBy === 'views') {
		sortedList.sort((a, b) => {
			const viewsA = parseInt((a.viewed || '0').replace(/\D/g, '')) || 0;
			const viewsB = parseInt((b.viewed || '0').replace(/\D/g, '')) || 0;
			return viewsB - viewsA; // По убыванию просмотров
		});
	} else {
		// По дате публикации (по умолчанию) - уже отсортировано с бэка
		// Можно оставить как есть или дополнительно отсортировать по дате
	}

	const itemsToRender = sortedList.slice(0, visibleCount);
	const hasMore = visibleCount < sortedList.length;

	const sortOptions = [
		{ value: 'date', label: 'По дате публикации' },
		{ value: 'alphabet', label: 'По алфавиту (А-Я)' },
		{ value: 'views', label: 'По просмотрам' },
	];

	const currentSortLabel =
		sortOptions.find(opt => opt.value === sortBy)?.label ||
		'По дате публикации';

	return (
		<>
			<div className='region news-section'>
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
					<span className='breadcrumb-separator breadcrumb-separator-active'></span>
					<span className='breadcrumb-current'>Новости</span>
				</div>
				<div className='news-header'>
					<h1 className='news-title'>НОВОСТИ</h1>
					<div className='news-sort-wrapper' ref={dropdownRef}>
						<button
							type='button'
							className='news-sort-button'
							onClick={() => setIsDropdownOpen(!isDropdownOpen)}
						>
							<span>{currentSortLabel}</span>
							<img
								src={`${process.env.PUBLIC_URL}/icons/down.svg`}
								alt=''
								className={`news-sort-icon ${
									isDropdownOpen ? 'news-sort-icon-open' : ''
								}`}
							/>
						</button>
						{isDropdownOpen && (
							<div className='news-sort-dropdown'>
								{sortOptions.map(option => (
									<button
										key={option.value}
										type='button'
										className={`news-sort-option ${
											sortBy === option.value ? 'news-sort-option-active' : ''
										}`}
										onClick={() => handleSortChange(option.value)}
									>
										{option.label}
									</button>
								))}
							</div>
						)}
					</div>
				</div>

				<div className='news-grid'>
					{itemsToRender.map(item => (
						<div
							key={item.news_id || item.title}
							className='news-card'
							onClick={() => item.news_id && handleCardClick(item.news_id)}
						>
							<div className='news-card-image-wrapper'>
								{item.thumb ? (
									<img
										src={item.thumb}
										alt={item.title}
										className='news-card-image'
									/>
								) : (
									<div className='news-card-image-placeholder'>
										Нет изображения
									</div>
								)}
							</div>
							<div className='news-card-body'>
								<h3 className='news-card-title'>{item.title}</h3>
								<p className='news-card-excerpt'>{item.description}</p>
								<div className='news-card-meta'>
									<div className='news-card-meta-item'>
										<img
											src={`${process.env.PUBLIC_URL}/icons/icon-clock-news.svg`}
											alt='Дата'
											className='news-card-meta-icon'
										/>
										<span>{item.posted}</span>
									</div>
									<div className='news-card-meta-item'>
										<img
											src={`${process.env.PUBLIC_URL}/icons/icon-eye.svg`}
											alt='Просмотры'
											className='news-card-meta-icon'
										/>
										<span>
											{item.viewed
												? item.viewed.replace(/[()]/g, '').trim()
												: ''}
										</span>
									</div>
								</div>
							</div>
						</div>
					))}
				</div>

				{hasMore && itemsToRender.length > 0 && (
					<button
						type='button'
						className='news-load-more'
						onClick={handleLoadMore}
					>
						<span>Смотреть еще</span>
						<img
							src={`${process.env.PUBLIC_URL}/icons/icon-arrow-down-small.svg`}
							alt='Показать еще'
							className='news-load-more-icon'
						/>
					</button>
				)}
			</div>

			<div className='region news-quality-section'>
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

export default PageNewsList;
