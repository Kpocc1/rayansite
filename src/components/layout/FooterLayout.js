import { useSelector } from 'react-redux';
import useSmartNavigate from 'hooks/useSmartNavigate';
import { loadingStatus } from 'helpers/fetcher';

const FooterLayout = () => {
	const { data, status } = useSelector(state => state.layout.mainInfo);
	const { navigate } = useSmartNavigate();

	return (
		<div
			className='rn-footer'
			style={{
				backgroundImage: `url(${process.env.PUBLIC_URL}/images/bg-footer.png)`,
				backgroundSize: 'cover',
				backgroundPosition: 'center',
				backgroundRepeat: 'no-repeat',
			}}
		>
			<div className='footer-content'>
				<div className='footer-main'>
					{/* Левая колонка */}
					<div className='footer-column footer-column-left'>
						<img
							src={`${process.env.PUBLIC_URL}/icons/logo.svg`}
							alt='РАЙЯН'
							className='footer-logo'
						/>
						<p className='footer-subtitle'>Интернет-магазин</p>
						{status === loadingStatus.SUCCEEDED && data.telephone ? (
							<a href={`tel:${data.telephone}`} className='footer-phone'>
								{data.telephone}
							</a>
						) : (
							<a href='tel:+79182494242' className='footer-phone'>
								+7 (918) 249 42-42
							</a>
						)}
						<p className='footer-label'>Служба качества</p>
						{status === loadingStatus.SUCCEEDED && data.email_quality ? (
							<a href={`mailto:${data.email_quality}`} className='footer-email'>
								{data.email_quality}
							</a>
						) : (
							<a
								href='mailto:hygieneQuality@rayanhalal.ru'
								className='footer-email'
							>
								hygieneQuality@rayanhalal.ru
							</a>
						)}
					</div>

					{/* Колонки справа */}
					<div className='footer-columns-right'>
						{/* 2 колонка */}
						<div className='footer-column'>
							<ul className='footer-links'>
								<li>
									<a
										href='#'
										onClick={e => {
											e.preventDefault();
											navigate('/page/vacancies');
										}}
										className='footer-link-bold'
									>
										Вакансии
									</a>
								</li>
								<li>
									<a
										href='#'
										onClick={e => {
											e.preventDefault();
											navigate('/reviews');
										}}
									>
										Оставьте отзыв
									</a>
								</li>
								<li>
									<a
										href='#'
										onClick={e => {
											e.preventDefault();
											navigate('/news');
										}}
									>
										Новости
									</a>
								</li>
								<li>
									<a
										href='#'
										onClick={e => {
											e.preventDefault();
											navigate('/page/certificates');
										}}
									>
										Сертификаты
									</a>
								</li>
							</ul>
						</div>

						{/* 3 колонка */}
						<div className='footer-column'>
							<ul className='footer-links'>
								<li>
									<a
										href='#'
										onClick={e => {
											e.preventDefault();
											navigate('/page/promotions');
										}}
									>
										<img
											src={`${process.env.PUBLIC_URL}/icons/icon-percent-badge.svg`}
											alt=''
											className='footer-link-icon'
										/>
										Акции
									</a>
								</li>
								<li>
									<a
										href='#'
										onClick={e => {
											e.preventDefault();
											navigate('/page/about');
										}}
									>
										<img
											src={`${process.env.PUBLIC_URL}/icons/icon-info-circle.svg`}
											alt=''
											className='footer-link-icon'
										/>
										О компании
									</a>
								</li>
								<li>
									<a
										href='#'
										onClick={e => {
											e.preventDefault();
											navigate('/page/delivery');
										}}
									>
										<img
											src={`${process.env.PUBLIC_URL}/icons/icon-shipping-fast.svg`}
											alt=''
											className='footer-link-icon'
										/>
										Доставка и оплата
									</a>
								</li>
								<li>
									<a
										href='#'
										onClick={e => {
											e.preventDefault();
											navigate('/contact');
										}}
									>
										<img
											src={`${process.env.PUBLIC_URL}/icons/icon-envelope-footer.svg`}
											alt=''
											className='footer-link-icon'
										/>
										Контакты
									</a>
								</li>
							</ul>
						</div>

						{/* 4 колонка */}
						<div className='footer-column'>
							<ul className='footer-links'>
								<li>
									<a
										href='#'
										onClick={e => {
											e.preventDefault();
											navigate('/page/stores');
										}}
									>
										Магазины и кафе с нашей продукцией
									</a>
								</li>
								<li>
									<a
										href='#'
										onClick={e => {
											e.preventDefault();
											navigate('/page/payment');
										}}
									>
										Как оплатить заказ
									</a>
								</li>
								<li>
									<a
										href='#'
										onClick={e => {
											e.preventDefault();
											navigate('/page/delivery-method');
										}}
									>
										Способ доставки
									</a>
								</li>
								<li>
									<a
										href='#'
										onClick={e => {
											e.preventDefault();
											navigate('/reviews');
										}}
									>
										Отзывы
									</a>
								</li>
							</ul>
						</div>
					</div>
				</div>

				{/* Иконки соцсетей и платежных систем */}
				<div className='footer-bottom'>
					<div className='footer-social'>
						<a href='#' className='footer-social-link'>
							<img
								src={`${process.env.PUBLIC_URL}/icons/Telegram.svg`}
								alt='Telegram'
							/>
						</a>
						<a href='#' className='footer-social-link'>
							<img src={`${process.env.PUBLIC_URL}/icons/VK.svg`} alt='VK' />
						</a>
						<a href='#' className='footer-social-link'>
							<img
								src={`${process.env.PUBLIC_URL}/icons/WhatsApp.svg`}
								alt='WhatsApp'
							/>
						</a>
					</div>
					<div className='footer-payments'>
						<img
							src={`${process.env.PUBLIC_URL}/icons/Visa.svg`}
							alt='Visa'
							className='footer-payment-icon'
						/>
						<img
							src={`${process.env.PUBLIC_URL}/icons/Mastercard.svg`}
							alt='Mastercard'
							className='footer-payment-icon'
						/>
						<img
							src={`${process.env.PUBLIC_URL}/icons/mir.svg`}
							alt='Mir'
							className='footer-payment-icon'
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default FooterLayout;
