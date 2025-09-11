import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const useAdditionalMenu = () => {
  const [additionalMenu, setAdditionalMenu] = useState([]);
  const { data } = useSelector((state) => state.layout.mainInfo);

  useEffect(() => {
    if (data.top_menu) {
      setAdditionalMenu(
        [
          { label: "Компания", key: "",
            children: [
              { label: "О компании", key: `/page/${data.top_menu.about.id}` },
              { label: "Вакансии", key: `/page/${data.top_menu.vacancies.id}` },
              { label: "Оставьте отзыв", key: "/reviews" },
              { label: "Наши сертификаты", key: `/page/${data.top_menu.certificate.id}` },
              { label: "Новости", key: "/news" },
            ],
          },
          { label: "Доставка", key: `/page/${data.top_menu.delivery.id}` },
          { label: "Оплата", key: `/page/${data.top_menu.payment.id}` },
          { label: "Контакты", key: "/contact" },
        ]
      );
    }
  }, [data]);

  return additionalMenu;
};

export default useAdditionalMenu;
