import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Skeleton } from 'antd';

import { fetchPage } from 'store/slices/pageSlice';
import { loadingStatus } from 'helpers/fetcher';

const PageCertificates = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { data, status } = useSelector(state => state.page.page);
	const mainInfo = useSelector(state => state.layout.mainInfo.data);

	useEffect(() => {
		const certificateId = mainInfo?.top_menu?.certificate?.id;
		if (certificateId) {
			dispatch(fetchPage({ id: certificateId }));
		}
	}, [dispatch, mainInfo]);

	// Сертификаты
	const certificates = [
		{
			image: `${process.env.PUBLIC_URL}/images/Наши декларации.png`,
			title: 'Приложение к свидетельству о соответствии нормам «Халяль»',
			link: 'https://rayanhalal.ru/files/deklarat.pdf',
		},
		{
			image: `${process.env.PUBLIC_URL}/images/Свидетельство о соответствии нормам Халяль.png`,
			title: 'Свидетельство о соответствии нормам «Халяль»',
			link: 'https://rayanhalal.ru/files/sertifikat_halal.pdf',
		},
		{
			image: `${process.env.PUBLIC_URL}/images/Товарный знак.png`,
			title: 'Свидетельство на товарный знак',
			link: 'https://rayanhalal.ru/files/tovarnyi_znak.pdf',
		},
	];

	const handleCertificateClick = link => {
		window.open(link, '_blank');
	};

	return (
		<>
			<div className="region certificates-section">
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
					<span className="breadcrumb-current">Сертификаты</span>
				</div>

				{/* Title */}
				<h1 className="certificates-title">СЕРТИФИКАТЫ</h1>

				{status === loadingStatus.SUCCEEDED && data ? (
					<>
						{/* Certificates grid */}
						<div className="certificates-grid">
							{certificates.map((cert, index) => (
								<div key={index} className="certificate-card">
									<button
										type="button"
										className="certificate-image-button"
										onClick={() => handleCertificateClick(cert.link)}
									>
										<img
											src={cert.image}
											alt={cert.title}
											className="certificate-image"
										/>
									</button>
									<button
										type="button"
										className="certificate-title-button"
										onClick={() => handleCertificateClick(cert.link)}
									>
										{cert.title}
									</button>
								</div>
							))}
						</div>
					</>
				) : status === loadingStatus.LOADING ? (
					<>
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

export default PageCertificates;

