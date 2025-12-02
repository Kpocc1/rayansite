import { useEffect, useMemo, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Skeleton } from "antd";

import { fetchNewsDetail } from "store/slices/pageSlice";
import { loadingStatus } from "helpers/fetcher";

const PageNewsDetail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data, status } = useSelector((state) => state.page.newsDetail);
  const { "*": news_id } = useParams();

  useEffect(() => {
    dispatch(fetchNewsDetail(news_id));
  }, [dispatch, news_id]);

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

  // Форматирование даты
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    // Если дата в формате "23.10.2023", возвращаем как есть
    return dateStr;
  };

  // Форматирование даты публикации и обновления
  const getDateText = () => {
    if (!data?.posted) return "";
    const posted = formatDate(data.posted);
    const updated = data.updated ? formatDate(data.updated) : null;
    
    if (updated && updated !== posted) {
      return `Опубликовано ${posted} (обновлено ${updated})`;
    }
    return `Опубликовано ${posted}`;
  };

  // Получаем количество просмотров
  const getViews = () => {
    if (!data?.viewed) return "0 просмотров";
    const views = data.viewed.replace(/[()]/g, "").trim();
    return views;
  };

  // Обработка ошибок загрузки изображений
  const contentRef = useRef(null);
  const errorHandlersRef = useRef([]);

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
            <span className="breadcrumb-separator"></span>
            <a
              href="/news"
              onClick={(e) => {
                e.preventDefault();
                navigate("/news");
              }}
              className="breadcrumb-link"
            >
              Новости
            </a>
            <span className="breadcrumb-separator breadcrumb-separator-active"></span>
            <span className="breadcrumb-current">
              {data?.title || data?.heading_title || "Название статьи"}
            </span>
          </div>

          {/* Date and Views */}
          {status === loadingStatus.SUCCEEDED && data ? (
            <>
              <div className="news-detail-meta" style={{ marginBottom: "24px" }}>
                <h1 className="news-detail-date">{getDateText()}</h1>
                <div className="news-detail-views">
                  <img
                    src={`${process.env.PUBLIC_URL}/icons/icon-eye.svg`}
                    alt="Просмотры"
                    className="news-detail-views-icon"
                  />
                  <span className="news-detail-views-text">{getViews()}</span>
                </div>
              </div>

              {/* Title */}
              <h2 className="news-detail-title" style={{ marginBottom: "24px" }}>
                {data.title || data.heading_title || "НАЗВАНИЕ СТАТЬИ"}
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
                  <p>Ошибка загрузки содержимого статьи. Пожалуйста, попробуйте позже.</p>
                </div>
              )}
            </>
          ) : status === loadingStatus.LOADING ? (
            <>
              <Skeleton active paragraph={{ rows: 2 }} style={{ marginBottom: "24px" }} />
              <Skeleton active paragraph={{ rows: 8 }} />
            </>
          ) : (
            <div>Статья не найдена</div>
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

export default PageNewsDetail;
