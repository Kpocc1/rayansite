import { useDispatch, useSelector } from "react-redux";
import { Button, Col, Divider, Form, Input, Row, Typography } from "antd";
import { PlusOutlined, EditOutlined } from "@ant-design/icons";

import { setDeliveryModalIsOpen } from "store/slices/layoutSlice";

const CheckoutFormAddress = () => {
  const dispatch = useDispatch();
  const { address } = useSelector((state) => state.layout.deliveryModalData);

  const handleDeliveryModalOpen = (e) => {
    e.preventDefault();
    dispatch(setDeliveryModalIsOpen(true));
  };

  return (
    <>
      <Typography.Title level={4}>Адрес доставки</Typography.Title>
      {address ? (
        <>
          <Typography.Link onClick={handleDeliveryModalOpen}>
            {address} <EditOutlined style={{ marginLeft: 5, fontSize: 20 }} />
          </Typography.Link>
          <Divider />
          <Row gutter={12}>
            <Col xs={12} sm={6}>
              <Form.Item name="room" label="Квартира/Офис"><Input /></Form.Item>
            </Col>
            <Col xs={12} sm={6}>
              <Form.Item name="entrance" label="Подъезд"><Input /></Form.Item>
            </Col>
            <Col xs={12} sm={6}>
              <Form.Item name="floor" label="Этаж"><Input /></Form.Item>
            </Col>
            <Col xs={12} sm={6}>
              <Form.Item name="intercom" label="Домофон"><Input /></Form.Item>
            </Col>
          </Row>
        </>
      ) : (
        <Button
          type="primary"
          danger
          icon={<PlusOutlined style={{ fontSize: 17 }} />}
          onClick={handleDeliveryModalOpen}
        >
          Добавьте адрес
        </Button>
      )}
      <Form.Item
        style={{ margin: 0 }}
        name="address_1"
        rules={[{ required: true, message: "Выберите адрес" }]}
      >
        <Input style={{ display: "none" }} />
      </Form.Item>
      <Form.Item
        style={{ display: "none" }}
        name="shipping_total"
      >
        <Input />
      </Form.Item>
      <Divider style={{ marginTop: 0 }} />
    </>
  );
};

export default CheckoutFormAddress;
