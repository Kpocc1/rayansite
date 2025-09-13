import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Col, Divider, Flex, Form, Input, Radio, Row, Skeleton, Tag, Typography } from "antd";
import { TruckOutlined, ShopOutlined } from "@ant-design/icons";

import { checkoutSave, checkoutPayment, fetchPaymentMethods, fetchShippingMethods } from "store/slices/cartSlice";
import { setYookassaWidgetModalIsOpen, setYookassaWidgetData } from "store/slices/layoutSlice";
import CheckoutFormAddress from "./CheckoutFormAddress";
import CheckoutFormIntervals from "./CheckoutFormIntervals";
import useBreakpoint from "hooks/useBreakpoint";
import useSmartNavigate from "hooks/useSmartNavigate";
import { loadingStatus } from "helpers/fetcher";
import { formatCurrency } from "helpers/formatter";
import { getStock } from "helpers/product";
import { getImage } from "helpers";

const SHIPPINGS = [
  {code: "mileage.oblast", label: "Курьерская доставка"},
  {code: "pickup.pickup", label: "Самовывоз"},
];

const CheckoutForm = ({ customer, data }) => {
  const [loading, setLoading] = useState();
  const [currentShippingMethod, setCurrentShippingMethod] = useState();
  const dispatch = useDispatch();
  const shippingMethods = useSelector((state) => state.cart.shippingMethods);
  const paymentMethods = useSelector((state) => state.cart.paymentMethods);
  const { address, costAddress } = useSelector((state) => state.layout.deliveryModalData);
  // const { confirmationToken } = useSelector((state) => state.layout.yookassaWidgetData);
  const { navigate } = useSmartNavigate();
  const { isMobile } = useBreakpoint();
  const [form] = Form.useForm();

  // const isDisabledSubmit = data.products?.findIndex(({ stock_qty, weight, quantity, unit, main_unit, pre_order }) => {
  //   const stock = getStock({ quantity: stock_qty, weight, unit, main_unit, pre_order });
  //   console.log(stock.stock)
  //   console.log(quantity)
  //   console.log(stock.stock < quantity)
  //   return stock.stock < quantity;
  // }) !== -1

  const subTotal = data.totals?.find((t) => t.code === "sub_total").text || "";
  const paymentMethodsList = Object.values(
    paymentMethods.data.payment_methods || {}
  );
  paymentMethodsList.sort((a, b) => a.sort - b.sort);

  const displayYookassaWidget = (confirmationToken, lastOrderId) => {
    dispatch(setYookassaWidgetModalIsOpen( true ));
    dispatch(setYookassaWidgetData({ confirmationToken, lastOrderId }));
  };

  const handleCurrentShippingMethod = (e) => {
    setCurrentShippingMethod(e.target.value);
  };

  const onFinish = async (values) => {
    setLoading(true);
    const [shippingCode] = values.shipping_method.split(".");
    // coords: coords,

    /****** */
    /****** */
    /****** */
    /******Починить */
    console.log(shippingMethods.data.shipping_methods)
    const shm = {
      ...shippingMethods.data.shipping_methods,
      pickup: {title: "Самовывоз из магазина", sort_order: "1"},
    };
    console.log(shm)
    /****** */
    /****** */
    /****** */

    const saveRes = await checkoutSave({
      ...values,
      payment_title: paymentMethods.data.payment_methods[values.payment_method].title,
      shipping_title: shm[shippingCode].title,
      room: values.room || "",
      entrance: values.entrance || "",
      intercom: values.intercom || "",
      floor: values.floor || "",
      comment: values.comment || "",
    });

    // if (values.payment_method === "rn_yookassa" && confirmationToken) {
    //   displayYookassaWidget(confirmationToken);
    //   setLoading(false);
    //   console.log("re init widget");
    //   return;
    // }

    if (saveRes.payment.action) {
      // Пересылка на контроллер для оплаты
      const confirmRes = await checkoutPayment(saveRes.payment.action);
      if (confirmRes.continue === "modal") {
        displayYookassaWidget(confirmRes.token, saveRes.payment.order_id);
      } else if (confirmRes.continue === "redirect") {
        navigate(confirmRes.redirect);
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    dispatch(fetchShippingMethods());
    dispatch(fetchPaymentMethods());
  }, [dispatch]);

  useEffect(() => {
    form.setFieldsValue(customer);
  }, [form, customer]);

  useEffect(() => {
    if (paymentMethodsList.length > 0) {
      form.setFieldsValue({
        payment_method: paymentMethods.data.code || paymentMethodsList[0].code,
      });
    }
  }, [form, paymentMethods, paymentMethodsList]);

  useEffect(() => {
    if (Object.keys(shippingMethods.data).length > 0) {
      const _val = shippingMethods.data.code || SHIPPINGS[0].code;
      form.setFieldsValue({ shipping_method: _val });
      setCurrentShippingMethod(_val)
    }
  }, [form, shippingMethods]);

  useEffect(() => {
    if (address && costAddress) {
      form.setFieldsValue({ address_1: address, shipping_total: costAddress });
    }
  }, [form, address, costAddress]);
console.log(shippingMethods?.data)
  // Проверка доступности доставки
  const deliveryEnabled = shippingMethods?.data?.delivery_enabled !== undefined ? shippingMethods.data.delivery_enabled : true;

  return (
    <Form
      form={form}
      name="checkout-form"
      onFinish={onFinish}
      layout="vertical"
    >
      <div className={`white ${isMobile ? "p-20" : "p-30"}`}>
        <Typography.Title level={4} style={{ marginTop: 0 }}>
          Способ доставки
        </Typography.Title>

        {!deliveryEnabled && currentShippingMethod !== "pickup.pickup" && (
          <div style={{ marginBottom: 16 }}>
            <Tag color="red">Курьерская доставка временно недоступна. Пожалуйста, выберите самовывоз.</Tag>
          </div>
        )}

        <Form.Item
          name="shipping_method"
          rules={[{ required: true, message: "Выберите способ доставки" }]}
        >
          <Radio.Group
            buttonStyle="solid"
            onChange={handleCurrentShippingMethod}
            style={isMobile ? { display: "block" } : {}}
          >
            <Radio.Button
              value={SHIPPINGS[0].code}
              style={{ height: 68, width: isMobile ? "100%" : "auto" }}
            >
              <TruckOutlined style={{ fontSize: 24, verticalAlign: "top", marginTop: 20 }} />
              <span style={{ fontSize: 16, display: "inline-block", marginLeft: 20 }}>
                {SHIPPINGS[0].label}<br />
                <Tag color="green">
                  {costAddress ? `стоимость: ${formatCurrency(costAddress)}` : "укажите адрес"}
                </Tag>
              </span>
            </Radio.Button>
            <Radio.Button
              value={SHIPPINGS[1].code}
              style={{ height: 68, width: isMobile ? "100%" : "auto" }}
            >
              <ShopOutlined style={{ fontSize: 24, verticalAlign: "top", marginTop: 20 }} />
              <span style={{ fontSize: 16, display: "inline-block", marginLeft: 20 }}>
                {SHIPPINGS[1].label}<br />
                <Tag color="green">бесплатно</Tag>
              </span>
            </Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Divider />

        <Typography.Title level={4}>Ваши данные</Typography.Title>
        <Row gutter={12} vertical={isMobile}>
          <Col xs={24} md={8}>
            <Form.Item name="firstname" label="Имя">
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              name="telephone"
              label="Телефон"
              rules={[{ required: true, message: "Введите номер телефона" }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item name="email" label="E-mail">
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Divider />

        <Form.Item
          noStyle
          shouldUpdate={(prev, current) => prev.shipping_method !== current.shipping_method}
        >
          {({ getFieldValue }) => (
            getFieldValue("shipping_method") === SHIPPINGS[0].code && (
              <CheckoutFormAddress />
            )
          )}
        </Form.Item>

        <Typography.Title level={4}>Способ оплаты</Typography.Title>
        {paymentMethods.status === loadingStatus.SUCCEEDED ? (
          <Form.Item
            name="payment_method"
            rules={[{ required: true, message: "Выберите способ оплаты" }]}
          >
            <Radio.Group
              buttonStyle="solid"
              style={isMobile ? { display: "block" } : {}}
              className="payment-methods-list"
            >
              {paymentMethodsList.map((p) => (
                <Fragment key={p.code}>
                  <Radio.Button
                    value={p.code}
                    className="mb-10"
                    style={{ width: isMobile ? "100%" : "auto", height: "auto" }}
                  >
                    {p.logo ? (
                      <img
                        src={getImage(p.logo)}
                        alt={p.title}
                        className="payment-methods-list-logo"
                      />
                    ) : ""}
                    {p.title}
                  </Radio.Button>
                  <br />
                </Fragment>
              ))}
            </Radio.Group>
          </Form.Item>
        ) : (
          <Skeleton active paragraph={{ rows: 2 }} />
        )}
        <Form.Item
          noStyle
          shouldUpdate={(prev, current) => prev.payment_method !== current.payment_method}
        >
          {({ getFieldValue }) => (
            getFieldValue("payment_method") === "cod" && (
              <Row>
                <Form.Item name="change_amount" label="Подготовить сдачу с суммы">
                  <Input placeholder="Например: 5000" />
                </Form.Item>
              </Row>
            )
          )}
        </Form.Item>
        <Divider />

        <Typography.Title level={4}>Комментарий к заказу</Typography.Title>
        <Form.Item name="comment" style={{ marginBottom: 0 }}>
          <Input.TextArea defaultValue="" />
        </Form.Item>
      </div>

      <Form.Item
        noStyle
        shouldUpdate={(prev, current) => prev.shipping_method !== current.shipping_method}
      >
        {({ getFieldValue }) => (
          getFieldValue("shipping_method") === SHIPPINGS[0].code && deliveryEnabled && (
            <CheckoutFormIntervals shippingMethods={shippingMethods} deliveryEnabled={deliveryEnabled} />
          )
        )}
      </Form.Item>
      <Divider style={{ marginTop: 0 }} />

      <div className="white p-20 mb-20">
        <Flex justify="space-between" align="flex-end">
          <Typography.Title level={5} style={{ marginTop: 0 }}>
            Итог:
          </Typography.Title>
          <div>
            <Typography.Title level={4} style={{ marginTop: 0 }}>
              {formatCurrency(subTotal, currentShippingMethod !== "pickup.pickup" ? costAddress : 0)}
            </Typography.Title>
            {(!costAddress && currentShippingMethod !== "pickup.pickup") && (
              <Typography.Text type="danger">без учета доставки</Typography.Text>
            )}
          </div>
        </Flex>
        <Divider style={{ margin: 10 }} />
        {data.totals?.filter((t) => t.code !== "total").map((t) => (
          <div key={t.code}>
            <Flex justify="space-between" align="flex-end">
              <div>{t.title}:</div>
              <strong>{formatCurrency(t.text)}</strong>
            </Flex>
            <Divider style={{ margin: 10 }} />
          </div>
        ))}
        {(costAddress && currentShippingMethod !== "pickup.pickup") ? (
          <>
            <Flex justify="space-between" align="flex-end">
              <div>Доставка:</div>
              <strong>{formatCurrency(costAddress)}</strong>
            </Flex>
            <Divider style={{ margin: 10 }} />
          </>
        ) : ""}
        <Flex justify="space-between" align="flex-end">
          <div>Вес заказа:</div>
          <strong>{data.weight}</strong>
        </Flex>
        <br />
        <br />
        <Form.Item>
          <Button
            type="primary"
            size="large"
            htmlType="submit"
            block
            loading={loading}
            disabled={!deliveryEnabled && currentShippingMethod !== "pickup.pickup"}
            // disabled={isDisabledSubmit}
          >
            Оформить заказ
          </Button>
          {/* {data.products?.findIndex(({ stock }) => !stock) !== -1 ? (
            <div class="text-red text-center">
              Некоторых товаров нет в нужном количестве
            </div>
          ) : ""} */}
        </Form.Item>
      </div>
    </Form>
  );
};

export default CheckoutForm;
