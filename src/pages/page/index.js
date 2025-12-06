import { useEffect, useMemo, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Skeleton } from "antd";

import { fetchPage } from "store/slices/pageSlice";
import { loadingStatus } from "helpers/fetcher";
import PageVacancies from "./page-vacancies";
import PageCertificates from "./page-certificates";

const PageDefault = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data, status } = useSelector((state) => state.page.page);
  const mainInfo = useSelector((state) => state.layout.mainInfo.data);
  const { "*": id } = useParams();

  // Определяем id страницы вакансий
  const vacanciesId = mainInfo?.top_menu?.vacancies?.id;
  const isVacanciesPage = vacanciesId && id === String(vacanciesId);

  // Определяем id страницы сертификатов
  const certificateId = mainInfo?.top_menu?.certificate?.id;
  const isCertificatePage = certificateId && id === String(certificateId);

  // Обработка HTML - проверяем на ошибки и фильтруем text_error
  const processedDescription = useMemo(() => {
    if (!data?.description) return "";
    // Удаляем text_error из описания
    let description = data.description;
    if (description.includes("text_error")) {
      description = description.replace(/text_error/gi, "").trim();
    }
    return description;
  }, [data?.description]);

  const hasError = useMemo(() => {
    if (!data?.description) return false;
    return data.description.includes("text_error");
  }, [data?.description]);

  // Обработка ошибок загрузки изображений
  const contentRef = useRef(null);
  const errorHandlersRef = useRef([]);

  useEffect(() => {
    dispatch(fetchPage({ id }));
  }, [dispatch, id]);

  useEffect(() => {
    if (status === loadingStatus.SUCCEEDED && data?.description && contentRef.current) {
      const images = contentRef.current.querySelectorAll("img");
      errorHandlersRef.current = [];

      images.forEach((img) => {
        const handleError = (e) => {
          const target = e?.target || img;
          target.style.backgroundColor = "#d9d9d9";
          target.style.minHeight = "200px";
          target.style.display = "block";
          target.style.borderRadius = "20px";
          target.alt = "Изображение не загружено";
          // Устанавливаем прозрачный пиксель вместо битого изображения
          target.onerror = null; // Предотвращаем бесконечный цикл
          target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1' height='1'%3E%3C/svg%3E";
        };
        
        errorHandlersRef.current.push({ img, handleError });
        
        // Если изображение уже загружено с ошибкой
        if (img.complete && img.naturalHeight === 0) {
          handleError({ target: img });
        } else {
          img.addEventListener("error", handleError);
        }
      });

      // Очистка обработчиков при размонтировании
      return () => {
        errorHandlersRef.current.forEach(({ img, handleError }) => {
          img.removeEventListener("error", handleError);
        });
        errorHandlersRef.current = [];
      };
    }
  }, [status, data?.description]);

  // Если это страница вакансий - рендерим специальный компонент
  if (isVacanciesPage) {
    return <PageVacancies />;
  }

  if (isCertificatePage) {
    return <PageCertificates />;
  }

  return (
    <>
      <div className="region news-detail-section">
        <div className="news-detail-wrapper">
          {/* Breadcrumb */}
          <div className="contact-breadcrumb" style={{ marginTop: "64px" }}>
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                navigate("/");
              }}
              className="breadcrumb-link"
            >
              Главная
            </a>
            <span className="breadcrumb-separator breadcrumb-separator-active"></span>
            <span className="breadcrumb-current">
              {data?.heading_title || "Страница"}
            </span>
          </div>

          {/* Title */}
          {status === loadingStatus.SUCCEEDED && data ? (
            <>
              <h2 className="news-detail-title" style={{ marginBottom: "24px" }}>
                {data.heading_title || "ЗАГОЛОВОК"}
              </h2>

              {/* Content - изображения на всю ширину, текст в контейнере 860px */}
              {processedDescription && !hasError && (
                <div
                  ref={contentRef}
                  className="news-detail-content"
                  dangerouslySetInnerHTML={{ __html: processedDescription }}
                />
              )}
              
              {/* Если есть ошибка, показываем сообщение */}
              {hasError && (
                <div className="news-detail-error">
                  <p>Ошибка загрузки содержимого. Пожалуйста, попробуйте позже.</p>
                </div>
              )}
            </>
          ) : status === loadingStatus.LOADING ? (
            <>
              <Skeleton active paragraph={{ rows: 2 }} style={{ marginBottom: "24px" }} />
              <Skeleton active paragraph={{ rows: 8 }} />
          </>
          ) : (
            <div>Страница не найдена</div>
        )}
      </div>
    </div>

      {/* Quality Section */}
      {status === loadingStatus.SUCCEEDED && data && (
        <div className="region news-quality-section" style={{ marginBottom: "60px" }}>
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
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
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

export default PageDefault;
