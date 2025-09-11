import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Divider, Flex, List } from "antd";
import {  CloseOutlined } from "@ant-design/icons";

import { fetchCartProducts, removeFromCart } from "store/slices/cartSlice";
import { formatCurrency, formatWeightWithUnit } from "helpers/formatter";
import { loadingStatus } from "helpers/fetcher";
import CartQtyButtonGroup from "./CartQtyButtonGroup";

const MiniCart = ({ products, status }) => {
  const dispatch = useDispatch();

  const handleRemoveFromCart = async (cart_id) => {
    await removeFromCart(cart_id);
    dispatch(fetchCartProducts());
  };

  useEffect(() => {
    dispatch(fetchCartProducts());
  }, [dispatch]);

  return (
    <List
      itemLayout="horizontal"
      loading={status !== loadingStatus.SUCCEEDED}
      dataSource={products}
      renderItem={(item, index) => (
        <>
          <Flex justify="space-between">
            <Flex>
              <img
                alt={item.name}
                src={item.thumb}
                style={{ maxWidth: 60, maxHeight: 50 }}
              />
              <div style={{ width: 180, margin: "0 15px", lineHeight: 1.1 }}>
                {`${item.name}, ${formatWeightWithUnit(item.weight)}`}
              </div>
            </Flex>
            <Flex>
              <div>
                <strong style={{ display: "block", marginBottom: 8 }}>
                  {formatCurrency(item.total)}
                </strong>
                <CartQtyButtonGroup item={item} size="small" />
              </div>
              <div>
                <CloseOutlined
                  className="ml-20"
                  style={{ color: "red" }}
                  onClick={() => handleRemoveFromCart(item.cart_id)}
                />
              </div>
            </Flex>
          </Flex>
          <Divider style={{ margin: "15px 0" }}/>
        </>
      )}
    />
  );
};

export default MiniCart;
