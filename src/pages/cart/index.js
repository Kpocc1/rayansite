import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Alert,
  Button,
  Col,
  Divider,
  Flex,
  List,
  Popconfirm,
  Result,
  Row,
  Tag,
  Typography,
} from "antd";
import { LeftOutlined, CloseOutlined } from "@ant-design/icons";

import SignIn from "components/modal/SignIn";
import Breadcrumb from "components/Breadcrumb";
import CheckoutForm from "components/cart/CheckoutForm";
import { fetchCartProducts, removeFromCart } from "store/slices/cartSlice";
import useCustomer from "hooks/useCustomer";
import useBreakpoint from "hooks/useBreakpoint";
import { loadingStatus } from "helpers/fetcher";
import { formatCurrency, formatWeightWithUnit } from "helpers/formatter";
import CartQtyButtonGroup from "components/cart/CartQtyButtonGroup";
import HeadingTitle from "components/HeadingTitle";
import useSmartNavigate from "hooks/useSmartNavigate";

const Cart = () => {
  const dispatch = useDispatch();
  const { data, status } = useSelector((state) => state.cart.cartProducts);
  const { customer } = useCustomer();
  const { isMobile } = useBreakpoint();
  const { navigate } = useSmartNavigate();

  const handleRemoveFromCart = async (cart_id) => {
    await removeFromCart(cart_id);
    dispatch(fetchCartProducts());
  };

  useEffect(() => {
    dispatch(fetchCartProducts());
  }, [dispatch]);


  if (status === loadingStatus.SUCCEEDED && !data.products) {
    return (
      <div className="region">
        <HeadingTitle
          title="Моя корзина"
          level={2}
          style={{ marginTop: 0, marginBottom: 10 }}
        />
        <Result
          className="white"
          status="404"
          title="Корзина пуста"
          subTitle="Положите в корзину товары и возвращайтесь"
          extra={<Button type="primary" onClick={() => navigate("/catalog")}>Перейти в каталог</Button>}
        />
      </div>
    );
  }

  return (
    <div className="region">
      <Breadcrumb />
      <HeadingTitle
        title="Моя корзина"
        level={2}
        style={{ marginTop: 0, marginBottom: 10 }}
      />
      <Typography.Link onClick={() => navigate("/catalog")}>
        <LeftOutlined /> Продолжить покупки
      </Typography.Link>

      <Row gutter={16} className="white mt-30">
        <Col xs={24} xl={13} className="rn-cart">
          <List
            loading={status !== loadingStatus.SUCCEEDED}
            itemLayout="horizontal"
            dataSource={data.products}
            renderItem={(item, index) => (
              <div>
                <Flex
                  vertical={isMobile}
                  justify="space-between"
                  className={`white ${!isMobile ? "p-20" : ""}`}
                >
                  <Col sm={24} md={15}>
                    <Flex
                      vertical={isMobile}
                      className={isMobile ? "text-center" : ""}
                    >
                      <div className="mr-10">
                        <img alt={item.name} src={item.thumb} />
                      </div>
                      <div>
                        <Typography.Title level={5}>
                          {`${item.name}, ${formatWeightWithUnit(item.weight)}`}
                        </Typography.Title>
                        {item.weight?.indexOf("кг") !== -1 && (
                          <Tag color="green">{`Фасовка ~ ${formatWeightWithUnit(
                            item.weight
                          )}`}</Tag>
                        )}
                      </div>
                    </Flex>
                    {isMobile && <div className="mb-30" />}
                  </Col>
                  <Col sm={24} md={9}>
                    <Flex
                      vertical={isMobile}
                      className={isMobile ? "text-center" : ""}
                    >
                      <div>
                        <Typography.Title level={4}>
                          {formatCurrency(item.total)}
                        </Typography.Title>
                        <Typography.Paragraph>
                          {`${formatCurrency(
                            item.price
                          )} x ${formatWeightWithUnit(
                            item.weight,
                            item.quantity
                          )}`}
                        </Typography.Paragraph>
                        <CartQtyButtonGroup item={item} />
                      </div>
                      {isMobile && <div className="mb-30" />}
                      <div>
                        <Popconfirm
                          title="Удалить товар?"
                          onConfirm={() => handleRemoveFromCart(item.cart_id)}
                          okText="Да, удалить"
                          cancelText="Нет"
                        >
                          <Button type="text" className="ml-20">
                            <CloseOutlined style={{ color: "red" }} />
                          </Button>
                        </Popconfirm>
                      </div>
                    </Flex>
                  </Col>
                </Flex>
                <Divider
                  style={{ margin: "0 auto", minWidth: "80%", width: "80%" }}
                />
              </div>
            )}
          />
        </Col>
        <Col xs={24} xl={11}>
          {customer.token ? (
            <CheckoutForm customer={customer} data={data} />
           ) : (
           <div className="p-30 white">
               <SignIn />
             </div>
           )}
        </Col>
      </Row>
    </div>
  );
};

export default Cart;
