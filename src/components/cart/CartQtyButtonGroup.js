import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Input, Space, Tag } from "antd";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";

import { addToCart, fetchCartProducts, reduceFromCart } from "store/slices/cartSlice";
import { setSigninModalIsOpen } from "store/slices/layoutSlice";
import useCustomer from "hooks/useCustomer";
import { getStock } from "helpers/product";
import { formatWeightWithUnit } from "helpers/formatter";

const CartQtyButtonGroup = ({
  item,
  size = "middle",
  block = false,
}) => {
  const [stock, setStock] = useState(() => getStock(item));
  const dispatch = useDispatch();
  const { customer } = useCustomer();
  const { data } = useSelector((state) => state.cart.cartProducts);
  const inCart = data.products?.find((p) => +p.product_id === +item.product_id);

  const handleAddToCart = async (product_id, quantity = 1, e) => {
    e.stopPropagation();
    // для яндекс браузера
    if (
      // (window.navigator.userAgent.includes("YaBrowser") && window.navigator.userAgent.includes("Mobile")) ||
      // (window.navigator.userAgent.includes("Tablet") ||
      // window.navigator.userAgent.includes("iPhone") ||
      // window.navigator.userAgent.includes("iPad"))
      window.navigator.userAgent.toLowerCase().includes("tablet") ||
      window.navigator.userAgent.toLowerCase().includes("mobile") ||
      window.navigator.userAgent.toLowerCase().includes("iphone") ||
      window.navigator.userAgent.toLowerCase().includes("ipad")
    ) {
      if (!customer.token) {
        dispatch(setSigninModalIsOpen(true));
        return;
      }
    }

    await addToCart(product_id, quantity);
    dispatch(fetchCartProducts());
  };

  const handleReduceToCart = async (e) => {
    e.stopPropagation();
    await reduceFromCart(item.product_id, 1);
    dispatch(fetchCartProducts());
  };

  return (
    <div className="text-right" style={{ width: "100%" }}>
      <Space.Compact size={size} block={block}>
        {inCart ? (
          <>
            <Button
              onClick={handleReduceToCart}
              type="default"
              icon={<MinusOutlined style={{ fontSize: 22 }} />}
            />
            <Input
              value={`${inCart.quantity} ${item.main_unit}`}
              className={`quantity-input quantity-input__${size}`}
            />
            <Button
              type="primary"
              icon={<PlusOutlined style={{ fontSize: 22 }} />}
              disabled={stock.stock <= inCart.quantity}
              onClick={(e) => handleAddToCart(item.product_id, item.minimum, e)}
            />
          </>
        ) : (
          <Button
            block={block}
            type="primary"
            disabled={stock.stock < item.minimum}
            onClick={(e) => handleAddToCart(item.product_id, item.minimum, e)}
          >
            <small>В КОРЗИНУ</small>
          </Button>
        )}
      </Space.Compact>
    </div>
  );
};

export default CartQtyButtonGroup;
