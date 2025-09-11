import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";

const YookassaWidget = () => {
  const widgetIsInit = useRef();
  const { confirmationToken, lastOrderId } = useSelector((state) => state.layout.yookassaWidgetData);
  // const { data } = useSelector((state) => state.layout.mainInfo);

  useEffect(() => {
    if (!confirmationToken) {
      return;
    }
    
    const yooKassaWidget = (token, lastOrderId) => {
      const returnUrl = `${process.env.REACT_APP_SERVER_URL.replace("/site", "")}/cart/success/${lastOrderId}`;
      console.log(returnUrl);
      widgetIsInit.current = new window.YooMoneyCheckoutWidget({
        confirmation_token: token,
        return_url: returnUrl,
        //При необходимости можно изменить цвета виджета, подробные настройки см. в документации
        //customization: {
          //Настройка цветовой схемы, минимум один параметр, значения цветов в HEX
          //colors: {
            //Цвет акцентных элементов: кнопка Заплатить, выбранные переключатели, опции и текстовые поля
            //control_primary: '#00BF96', //Значение цвета в HEX
            //Цвет платежной формы и ее элементов
            //background: '#F2F3F5' //Значение цвета в HEX
          //}
        //},
        error_callback: function(error) {
          console.log(error);
        }
      });
      widgetIsInit.current.render("yookassa-widget-form");
    };


    if (widgetIsInit.current) {
      widgetIsInit.current.destroy();
    }

    yooKassaWidget(confirmationToken, lastOrderId);
  }, [confirmationToken, lastOrderId]);

  return (
    <div id="yookassa-widget-form" style={{ height: 782 }} />
  );
};

export default YookassaWidget;
