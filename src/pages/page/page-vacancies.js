import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Skeleton } from 'antd';

import { fetchPage } from 'store/slices/pageSlice';
import { loadingStatus } from 'helpers/fetcher';

const PageVacancies = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { data, status } = useSelector(state => state.page.page);
	const mainInfo = useSelector(state => state.layout.mainInfo.data);

	useEffect(() => {
		const vacanciesId = mainInfo?.top_menu?.vacancies?.id;
		if (vacanciesId) {
			dispatch(fetchPage({ id: vacanciesId }));
		}
	}, [dispatch, mainInfo]);

	// Пример данных вакансий (в реальном приложении должны приходить с бэкенда)
	const vacancies = [
		'Инженер КиП и А',
		'Электрик-механик',
		'Работник в колбасный цех',
		'Обвальщица (жиловщица)',
		'Микробиолог-лаборант',
		'Торговый представитель',
		'Механик-электрик',
		'Водитель-экспедитор',
		'Мойщик автомобилей',
		'Разнорабочий на завод',
		'Мастер чистоты',
	];

	// Преимущества работы
	const benefits = [
		{
			icon: `${process.env.PUBLIC_URL}/icons/icon-benefit-comfort.svg`,
			title: 'Комфорт и Здоровье',
			text: 'На территории компании есть всё для вашего комфорта: разнообразное питание в столовой, медкабинет для оперативной помощи, уютная комната отдыха для релаксации и массажное кресло, чтобы снять напряжение.',
		},
		{
			icon: `${process.env.PUBLIC_URL}/icons/icon-benefit-rest.svg`,
			title: 'Отдых и Развлечения',
			text: 'В вашем распоряжении: настольный теннис для активного отдыха, а также шахматы для любителей спокойных игр. Насладитесь перерывом на нашей веранде с видом на цветочную клумбу, выпив чашку чая или кофе.',
		},
		{
			icon: `${process.env.PUBLIC_URL}/icons/icon-benefit-adventure.svg`,
			title: 'Сплочение и Приключения',
			text: 'Два раза в год мы организуем выездной корпоративный отдых на природе, куда вы можете отправиться вместе со своими родными и близкими! Это прекрасная возможность укрепить командный дух и отлично провести время.',
		},
	];

	return (
		<>
			<div className="region vacancies-section">
				{/* Breadcrumb */}
				<div className="contact-breadcrumb" style={{ marginTop: '64px' }}>
					<a
						href="/"
						onClick={e => {
							e.preventDefault();
							navigate('/');
						}}
						className="breadcrumb-link"
					>
						Главная
					</a>
					<span className="breadcrumb-separator"></span>
					<span className="breadcrumb-current">Вакансии</span>
				</div>

				{/* Title */}
				<h1 className="vacancies-title">ВАКАНСИИ</h1>

				{status === loadingStatus.SUCCEEDED && data ? (
					<>
						{/* Main content */}
						<div className="vacancies-content">
							<div className="vacancies-description">
								<p>
									Наша компания "РАЙЯН" - это прежде всего дружный, сплоченный,
									профессиональный коллектив единомышленников!
								</p>
								<p>
									Честность, добропорядочность, целеустремленность,
									ответственность, исполнительность, дисциплинированность,
									внимательность, пунктуальность,трудолюбие, коммуникабельность и
									доброжелательность - это ценности людей составляющих компанию.
								</p>
								<p>
									Именно таких людей мы приглашаем и рады видеть в нашей
									компании!
								</p>
							</div>
							<div className="vacancies-contacts">
								<div className="vacancies-contacts-item">
									<h4 className="vacancies-contacts-label">
										Телефон для справок
									</h4>
									<a href="tel:+78866277-78-80" className="vacancies-contacts-value">
										+7 (88662) 77-78-80
									</a>
									<a href="tel:+7918727-78-80" className="vacancies-contacts-value">
										+7 (918) 727-78-80
									</a>
								</div>
								<div className="vacancies-contacts-item">
									<h4 className="vacancies-contacts-label">Почта</h4>
									<a
										href="mailto:Rayan07@bk.ru"
										className="vacancies-contacts-value"
									>
										Rayan07@bk.ru
									</a>
								</div>
							</div>
						</div>

						{/* Benefits */}
						<div className="vacancies-benefits">
							{benefits.map((benefit, index) => (
								<div key={index} className="vacancies-benefit-card">
									<img
										src={benefit.icon}
										alt=""
										className="vacancies-benefit-icon"
									/>
									<h3 className="vacancies-benefit-title">{benefit.title}</h3>
									<p className="vacancies-benefit-text">{benefit.text}</p>
								</div>
							))}
						</div>

						{/* Vacancies list */}
						<div className="vacancies-list-section">
							<h2 className="vacancies-list-title">Все вакансии</h2>
							<div className="vacancies-grid">
								{vacancies.map((vacancy, index) => (
									<button key={index} className="vacancy-button">
										{vacancy}
									</button>
								))}
							</div>
						</div>
					</>
				) : status === loadingStatus.LOADING ? (
					<>
						<Skeleton
							active
							paragraph={{ rows: 4 }}
							style={{ marginBottom: '48px' }}
						/>
						<Skeleton
							active
							paragraph={{ rows: 6 }}
							style={{ marginBottom: '48px' }}
						/>
					</>
				) : (
					<div>Страница не найдена</div>
				)}
			</div>

			{/* Quality Section */}
			{status === loadingStatus.SUCCEEDED && data && (
				<div
					className="region news-quality-section"
					style={{ marginBottom: '60px' }}
				>
					<h2 className="quality-title">ДОВЕРЬТЕСЬ КАЧЕСТВУ</h2>
					<div className="quality-cards">
						<div className="quality-card quality-card-gray">
							<img
								src={`${process.env.PUBLIC_URL}/images/icon-halal.png`}
								alt=""
								className="quality-card-icon"
							/>
							<h4 className="quality-card-text">Без свинины и ее компонентов</h4>
						</div>
						<div className="quality-card quality-card-gray">
							<img
								src={`${process.env.PUBLIC_URL}/images/icon-eggs.png`}
								alt=""
								className="quality-card-icon"
							/>
							<h4 className="quality-card-text">Натуральные молоко и яйцо</h4>
						</div>
						<div className="quality-card quality-card-gray">
							<img
								src={`${process.env.PUBLIC_URL}/images/icon-cow.png`}
								alt=""
								className="quality-card-icon"
							/>
							<h4 className="quality-card-text">Мясо собственного забоя</h4>
						</div>
						<div className="quality-card quality-card-gray">
							<img
								src={`${process.env.PUBLIC_URL}/images/icon-nature.png`}
								alt=""
								className="quality-card-icon"
							/>
							<h4 className="quality-card-text">Без консервантов и красителей</h4>
						</div>
						<div
							className="quality-card quality-card-blue"
							style={{
								backgroundImage: `url(${process.env.PUBLIC_URL}/images/bg-quality-card.png)`,
								backgroundSize: 'cover',
								backgroundPosition: 'center',
								backgroundRepeat: 'no-repeat',
							}}
						>
							<img
								src={`${process.env.PUBLIC_URL}/icons/icon-dna.svg`}
								alt=""
								className="quality-card-icon"
							/>
							<h4 className="quality-card-text quality-card-text-white">
								Без ГМО и заменителей мяса
							</h4>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default PageVacancies;

