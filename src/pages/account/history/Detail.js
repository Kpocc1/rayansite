import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button, Col, Divider, Flex, Layout, List, Row, Skeleton, Tag, Timeline } from "antd";
import { ReloadOutlined } from "@ant-design/icons";

import { batchAddToCart, fetchCartProducts } from "store/slices/cartSlice";
import { fetchHistory } from "store/slices/customerSlice";
import HeadingTitle from "components/HeadingTitle";
import Breadcrumb from "components/Breadcrumb";
import ProductItem from "components/product/ProductItem";
import AccountSider from "../AccountSider";
import useBreakpoint from "hooks/useBreakpoint";
import { formatCurrency } from "helpers/formatter";
import { loadingStatus } from "helpers/fetcher";
import { PRODUCTS_GRID } from "constants/breakpoints";

const History = () => {
  const [reorderIsLoad, setReorderIsload] = useState();
  const dispatch = useDispatch();
  const { data, status } = useSelector((state) => state.customer.history);
  const { isMobile } = useBreakpoint();
  const { "*": orderId } = useParams();

  const handleBatchAdd = async () => {
    setReorderIsload(true);
    const products = data.products
      .filter((p) => p.reorder)
      .map(({ product_id, quantity }) => ({ product_id, quantity }));
    await batchAddToCart(products);
    dispatch(fetchCartProducts());
    setReorderIsload(false);
  };

  useEffect(() => {
    dispatch(fetchHistory(orderId));
  }, [dispatch, orderId]);

  return (
    <div className="region">
      <Breadcrumb />
      <HeadingTitle
        title={`${data.heading_title} #${orderId}`}
        level={2}
        style={{ marginTop: 0, marginBottom: 30 }}
      />
      <Layout>
        <AccountSider />
        <Layout.Content>
          <div className="white p-30 mb-20">
            {status === loadingStatus.SUCCEEDED ? (
              <>
                <Row vertical={isMobile} justify="space-around">
                  <Col xs={24} md={8}>
                    <HeadingTitle
                      title="Детали заказа"
                      level={4}
                      style={{ marginTop: 0 }}
                    />
                    <div className="mb-10">
                      {data.text_order_id}<br /> 
                      <strong>{data.order_id}</strong>
                    </div>
                    <div className="mb-10">
                      {data.text_date_added}<br />
                      <strong>{data.date_added}</strong>
                    </div>
                    <div className="mb-10">
                      {data.text_payment_method}<br />
                      <strong>{data.payment_method}</strong>
                    </div>
                    <div className="mb-10">
                      {data.text_shipping_method}<br />
                      <strong>{data.shipping_method}</strong>
                    </div>
                    <br />
                  </Col>
                  <Col xs={24} md={8}>
                    <HeadingTitle
                      title={data.text_shipping_address}
                      level={4}
                      style={{ marginTop: 0 }}
                    />
                    <div
                      style={{ lineHeight: 1.6, fontSize: 15, marginTop: 6 }}
                      dangerouslySetInnerHTML={{ __html: data.shipping_address }}
                    />
                    <br />
                  </Col>
                  <Col xs={24} md={8}>
                    <HeadingTitle
                      title="История заказа"
                      level={4}
                      style={{ marginTop: 0, marginBottom: 30 }}
                    />
                    {data.histories.length > 0 ? (
                      <Timeline
                        items={data.histories.map((h, hindex) => ({
                          children: (
                            <>
                            <div>{h.status}</div>
                            <small>{h.date_added}</small>
                            {h.comment && (<div dangerouslySetInnerHTML={{ __html: h.comment}} />)}
                            </>
                          ),
                          color: "blue",
                        }))}
                      />
                    ) : (
                      <Tag>История пуста</Tag>
                    )}
                  </Col>
                </Row>
                <Divider />
                <Button
                  type="primary"
                  size="large"
                  onClick={handleBatchAdd}
                  loading={reorderIsLoad}
                >
                  <ReloadOutlined /> Повторить заказ
                </Button>
                <Divider />
                {data.totals?.filter((t) => t.code !== "total").map((t) => (
                  <div key={t.code}>
                    <Flex justify="space-between" align="flex-end">
                      <div>{t.title}:</div>
                      <strong>{formatCurrency(t.text)}</strong>
                    </Flex>
                    <Divider style={{ margin: 10 }} />
                  </div>
                ))}
              </>
            ) : (
              <Skeleton active paragraph={{ rows: 6 }} />
            )}
          </div>
          <HeadingTitle title="Товары в заказе" level={4} />
          <Divider />
          <List
            grid={PRODUCTS_GRID}
            className="rn-product-grid"
            itemLayout="horizontal"
            dataSource={data.products || Array(4).fill({})}
            renderItem={(item, index) => (
              <Skeleton active avatar loading={status !== loadingStatus.SUCCEEDED}>
                <ProductItem
                  item={item}
                  active={!!item.reorder}
                  header={
                    <div className="lightgray">
                      <strong>{`Вы заказывали ${item.quantity} шт`}</strong>
                    </div>
                  }
                />
              </Skeleton>
            )}
          />
        </Layout.Content>
      </Layout>
    </div>
  );
};

export default History;
