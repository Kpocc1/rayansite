import { useState } from "react";
import { useDispatch } from "react-redux";
import { message, Popover } from "antd";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";

import { setSigninModalIsOpen } from "store/slices/layoutSlice";
import { addToWishlist, deleteFromWishlist } from "store/slices/customerSlice";
import useCustomer from "hooks/useCustomer";

const WishlistButton = ({
  product_id,
  active = false,
  size = 26,
  wrapStyle = {},
  actionAfterDelete = () => {},
}) => {
  const [isActive, setIsActive] = useState(active);
  const dispatch = useDispatch();
  const { customer } = useCustomer();

  const handleAddToWishlist = async () => {
    if (customer.token) {
      const res = await addToWishlist(product_id);
      if (res.success) {
        message.success(res.success);
        setIsActive(true);
      }
    } else {
      dispatch(setSigninModalIsOpen(true));
    }
  };

  const handleDeleteFromWishlist = async () => {
    if (customer.token) {
      const res = await deleteFromWishlist(product_id);
      if (res.success) {
        message.warning(res.success);
        setIsActive(false);
        actionAfterDelete();
      }
    } else {
      dispatch(setSigninModalIsOpen(true));
    }
  };

  const content = isActive ? "Удалить из избранного" : "Добавить в избранное";
  const action = isActive ? handleDeleteFromWishlist : handleAddToWishlist;

  return (
    <div
      className={`wishlist-buttons ${isActive ? "wishlist-active" : ""}`}
      style={wrapStyle}
    >
      <HeartOutlined
        className="wishlist-notactive-icon"
        style={{ fontSize: size, color: "red" }}
        onClick={handleAddToWishlist}
      />
      <Popover content={content} className="wishlist-active-icon">
        <HeartFilled
          style={{ fontSize: size, color: "red" }}
          onClick={action}
        />
      </Popover>
    </div>
  );
};

export default WishlistButton;
