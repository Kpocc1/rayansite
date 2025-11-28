import React from "react";
import { useDispatch } from "react-redux";
import { Flex, Divider, Col, Alert } from "antd";
import { StarFilled, TruckOutlined, ShopOutlined, SlidersOutlined } from "@ant-design/icons";

import { setDeliveryModalIsOpen } from "store/slices/layoutSlice";
import WishlistButton from "components/cart/WishlistButton";
import CartQtyButtonGroup from "components/cart/CartQtyButtonGroup";
import HeadingTitle from "components/HeadingTitle";
import useBreakpoint from "hooks/useBreakpoint";
import useCustomer from "hooks/useCustomer";
import { formatCurrency, formatWeightWithUnit } from "helpers/formatter";

const ProductItemMain = ({ product_id, data }) => {
  const dispatch = useDispatch();
  const { customer } = useCustomer();
  const { breakpoint } = useBreakpoint();

  const handleDeliveryModalOpen = (e) => {
    e.preventDefault();
    dispatch(setDeliveryModalIsOpen(true));
  };

  if (!data || !data.heading_title) {
    return null;
  }

  return (
    <>
      <HeadingTitle
        title={`${data.heading_title}, ${formatWeightWithUnit(data.weight)}`}
        style={{ marginTop: 0 }}
      />
      <div className="mb-10">Артикул: {data.model}</div>
      <Flex align="center">
        <strong>{data.reviews}</strong>
        <div className="ml-30">
          <StarFilled style={{ fontSize: 17, color: "#fadb14" }} />{" "}
          {data.rating}
        </div>
      </Flex>
      <Divider />

      <Flex vertical={!["xxl", "xl"].includes(breakpoint)} justify="space-between">
        <Col md={24} lg={24} xl={12}>
          <div className="lightgray p-20">
            <HeadingTitle
              title={
                <>
                  <span>{formatCurrency(data.price)}</span>
                  <small className="text-gray">
                    {" "} / {formatWeightWithUnit(data.weight)}
                  </small>
                </>
              }
              style={{ marginTop: 0, marginBottom: 15 }}
            />
            {data.weight && data.weight.indexOf("кг") && (
              <>
                {data.price_kg && (
                  <div>
                    <span style={{ marginRight: 8 }}>Цена за кг:</span>
                    <strong>{formatCurrency(data.price_kg)}</strong>
                  </div>
                )}
                <div>
                  <span style={{ marginRight: 12 }}>Макс. вес:</span>
                  <strong>{formatWeightWithUnit(data.weight)}</strong>
                </div>
              </>
            )}
          </div>
          <Flex className="mt-30">
            <CartQtyButtonGroup item={data} size="large" block />
            <WishlistButton
              product_id={product_id}
              active={data.in_wishlist}
              size={28}
              wrapStyle={{ margin: "6px 0 0 20px" }}
            />
          </Flex>
        </Col>
        <Col md={22} lg={22} xl={10}>
          {data.weight && data.weight.indexOf("кг") && (
            <Alert
              message={<><SlidersOutlined style={{ fontSize: 18, marginRight: 5 }} /> Это весовой товар</>}
              description="Цена указана за максимальный вес фасовки"
              type="success"
              style={{ padding: "8px 15px", margin: "10px 0" }}
            />
          )}

          <Alert
            message={<><TruckOutlined style={{ fontSize: 18, marginRight: 5 }} /> Курьерская доставка</>}
            description={
              <>
                {+customer.store_id === 0 ? (
                  `${formatCurrency(200)} по городу`
                ) : (
                  <a href="#" onClick={handleDeliveryModalOpen}>
                    ввести адрес
                  </a>
                )}
              </>
            }
            type="info"
            style={{ padding: "8px 15px", margin: "10px 0" }}
            />
          <Alert
            message={<><ShopOutlined style={{ fontSize: 18, marginRight: 5 }} /> Самовывоз</>}
            description="бесплатно"
            type="info"
            style={{ padding: "8px 15px", margin: "10px 0" }}
            />
        </Col>
      </Flex>
    </>
  );
};

export default ProductItemMain;
