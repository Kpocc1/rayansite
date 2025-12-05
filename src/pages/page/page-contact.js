import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Skeleton } from 'antd';

import { fetchPage } from 'store/slices/pageSlice';
import { loadingStatus } from 'helpers/fetcher';
import useSmartNavigate from 'hooks/useSmartNavigate';

const PageContact = () => {
  const dispatch = useDispatch();
	const { data, status } = useSelector(state => state.page.page);
	const { '*': path } = useParams();
	const { navigate } = useSmartNavigate();
	const [formData, setFormData] = useState({
		name: '',
		phone: '',
		comment: '',
	});
	const [focusedFields, setFocusedFields] = useState({
		name: false,
		phone: false,
		comment: false,
	});

  useEffect(() => {
		dispatch(fetchPage({ id: null, route: 'information/contact' }));
  }, [dispatch, path]);

	const handleInputChange = e => {
		const { name, value } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: value,
		}));
	};

	const handleFocus = fieldName => {
		setFocusedFields(prev => ({
			...prev,
			[fieldName]: true,
		}));
	};

	const handleBlur = fieldName => {
		setFocusedFields(prev => ({
			...prev,
			[fieldName]: false,
		}));
	};

	const handleSubmit = e => {
		e.preventDefault();
		// TODO: Add form submission logic
		console.log('Form submitted:', formData);
	};

  return (
		<div className='region contact-section'>
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
				<span className='breadcrumb-separator breadcrumb-separator-active'></span>
				<span className='breadcrumb-current'>Контакты</span>
			</div>

			{/* Title */}
			<h1 className='contact-title'>КОНТАКТЫ</h1>

			{/* Contact Form */}
			<div
				className='contact-form-wrapper'
				style={{
					backgroundImage: `url(${process.env.PUBLIC_URL}/images/bg-contact-form.png)`,
				}}
			>
				<form className='contact-form' onSubmit={handleSubmit}>
					<h2 className='contact-form-title'>Оставить заявку</h2>

					<div className='contact-form-field'>
						<input
							type='text'
							name='name'
							value={formData.name}
							onChange={handleInputChange}
							onFocus={() => handleFocus('name')}
							onBlur={() => handleBlur('name')}
							className='contact-form-input'
						/>
						<label
							className={`contact-form-label ${
								focusedFields.name || formData.name
									? 'contact-form-label-active'
									: ''
							}`}
						>
							ФИО
						</label>
					</div>

					<div className='contact-form-field'>
						<input
							type='tel'
							name='phone'
							value={formData.phone}
							onChange={handleInputChange}
							onFocus={() => handleFocus('phone')}
							onBlur={() => handleBlur('phone')}
							className='contact-form-input'
						/>
						<label
							className={`contact-form-label ${
								focusedFields.phone || formData.phone
									? 'contact-form-label-active'
									: ''
							}`}
						>
							Номер телефона
						</label>
					</div>

					<div className='contact-form-field contact-form-field-textarea'>
						<textarea
							name='comment'
							value={formData.comment}
							onChange={handleInputChange}
							onFocus={() => handleFocus('comment')}
							onBlur={() => handleBlur('comment')}
							className='contact-form-textarea'
							maxLength={100}
						/>
						<label
							className={`contact-form-label ${
								focusedFields.comment || formData.comment
									? 'contact-form-label-active'
									: ''
							}`}
						>
							Комментарий
						</label>
						<span className='contact-form-counter'>
							{formData.comment.length}/100
						</span>
					</div>

					<button type='submit' className='contact-form-button'>
						Оставить заявку
					</button>

					<p className='contact-form-disclaimer'>
						<span className='contact-form-disclaimer-text'>
							Нажимая на кнопку, вы соглашаетесь с{' '}
						</span>
						<a
							href='#'
							onClick={e => {
								e.preventDefault();
							}}
							className='contact-form-disclaimer-link'
						>
							политикой конфиденциальности
						</a>
					</p>
				</form>
			</div>

			{/* Contact Information */}
			<div className='contact-info-section'>
				<div className='contact-info-grid'>
					{/* Отдел продаж */}
					<div className='contact-info-item'>
						<h3 className='contact-info-title contact-info-title-blue'>
							Отдел продаж
						</h3>
						<ul className='contact-info-list'>
							<li>
								<a href='tel:+79889200068' className='contact-info-phone'>
									+7 (988) 920 00-68
								</a>
							</li>
							<li>
								<a
									href='mailto:sales@rayanhalal.ru'
									className='contact-info-email'
								>
									sales@rayanhalal.ru
								</a>
							</li>
						</ul>
					</div>

					{/* По всем вопросам */}
					<div className='contact-info-item'>
						<h3 className='contact-info-title contact-info-title-blue'>
							По всем вопросам
						</h3>
						<ul className='contact-info-list'>
							<li>
								<a href='tel:+79889200068' className='contact-info-phone'>
									+7 (988) 920 00-68
								</a>
							</li>
							<li>
								<a
									href='mailto:sales@rayanhalal.ru'
									className='contact-info-email'
								>
									sales@rayanhalal.ru
								</a>
							</li>
						</ul>
					</div>

					{/* Гигиена и качество */}
					<div className='contact-info-item'>
						<h3 className='contact-info-title contact-info-title-blue'>
							Гигиена и качество
						</h3>
						<ul className='contact-info-list'>
							<li>
								<a
									href='mailto:sales@rayanhalal.ru'
									className='contact-info-email'
								>
									sales@rayanhalal.ru
								</a>
							</li>
						</ul>
					</div>

					{/* Магазин на Кирова */}
					<div className='contact-info-item'>
						<h3 className='contact-info-title contact-info-title-red'>
							Магазин на Кирова
						</h3>
						<ul className='contact-info-list'>
							<li>
								<a href='tel:+79187277880' className='contact-info-phone'>
									+7 (918) 727 78-80
								</a>
							</li>
							<li className='contact-info-address'>
								г. Нальчик, ул. кирова 294
							</li>
						</ul>
						<a
							href='#'
							onClick={e => {
								e.preventDefault();
							}}
							className='contact-info-map-link'
						>
							На карте{' '}
							<img
								src={`${process.env.PUBLIC_URL}/icons/icon-arrow-link.svg`}
								alt=''
								className='contact-info-map-icon'
							/>
						</a>
					</div>

					{/* Магазин в Чегем */}
					<div className='contact-info-item'>
						<h3 className='contact-info-title contact-info-title-red'>
							Магазин в Чегем
						</h3>
						<ul className='contact-info-list'>
							<li>
								<a href='tel:+79889200068' className='contact-info-phone'>
									+7 (988) 920 00-68
								</a>
							</li>
							<li className='contact-info-address'>
								г. Чегем, баксанское ш. 96
							</li>
						</ul>
						<a
							href='#'
							onClick={e => {
								e.preventDefault();
							}}
							className='contact-info-map-link'
						>
							На карте{' '}
							<img
								src={`${process.env.PUBLIC_URL}/icons/icon-arrow-link.svg`}
								alt=''
								className='contact-info-map-icon'
							/>
						</a>
					</div>

					{/* Время работы */}
					<div className='contact-info-item'>
						<h3 className='contact-info-title contact-info-title-red'>
							Время работы
						</h3>
						<ul className='contact-info-list'>
							<li>8:00–20:00 (ПН–СБ)</li>
							<li>8:00–19:00 (ВС)</li>
							<li className='contact-info-break'>12:00–14:00 (ПТ перерыв)</li>
						</ul>
					</div>
				</div>
			</div>

			{/* Company Details */}
			<div className='company-details-section'>
				<h2 className='company-details-title'>Реквизиты компании</h2>
				<div className='company-details-divider'></div>
				<div className='company-details-grid'>
					<div className='company-details-item'>
						<h4 className='company-details-label'>Наименование юр. лица:</h4>
						<p className='company-details-value'>
							ООО «Нальчикский мясокомбинат»
						</p>
					</div>
					<div className='company-details-item'>
						<h4 className='company-details-label'>ИНН / КПП:</h4>
						<p className='company-details-value'>0701011 / 072201001</p>
					</div>
					<div className='company-details-item'>
						<h4 className='company-details-label'>ОГРН:</h4>
						<p className='company-details-value'>1040700251514</p>
					</div>
					<div className='company-details-item'>
						<h4 className='company-details-label'>Фактический адрес:</h4>
						<p className='company-details-value'>
							360001, Кабардино-Балкарская Респ, Нальчик г, Кирова ул, дом 294
						</p>
					</div>
					<div className='company-details-item'>
						<h4 className='company-details-label'>Юридический адрес:</h4>
						<p className='company-details-value'>
							361534, Кабардино-Балкарская Респ, Баксан г, Ленина пр-кт, дом
							132, кв. 9
						</p>
					</div>
				</div>
			</div>

			{/* Quality Section */}
			<div className='quality-section'>
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
    </div>
  );
};

export default PageContact;
