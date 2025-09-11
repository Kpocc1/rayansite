import { List, Rate, Tag } from "antd";

import CartQtyButtonGroup from "components/cart/CartQtyButtonGroup";
import WishlistButton from "components/cart/WishlistButton";
import useSmartNavigate from "hooks/useSmartNavigate";
import { formatCurrency, formatWeightWithUnit } from "helpers/formatter";

const ProductItem = ({
  item,
  header,
  active = true,
  wishlistProps = {},
}) => {
  const { navigate } = useSmartNavigate();

  const handleGotoItem = () => {
    if (!active) return;
    navigate(`/product/${item.product_id}/${item.slug}`);
  };

  return (
    <List.Item>
      {header}
      <div className="rn-product-card">
        {active && (
          <div className="rn-product-card__wishlist">
            <WishlistButton
              active={item.in_wishlist}
              product_id={item.product_id}
              { ...wishlistProps }
            />
          </div>
        )}
        <img
          src={item.thumb}
          alt=""
          className="rn-product-card__img img-responsive"
          onClick={handleGotoItem}
        />
        <div className="rn-product-card__meta">
          <Rate
            allowHalf
            disabled
            value={item.rating}
            style={{ fontSize: 15, marginRight: 15 }}
          />
          <div
            className="rn-product-card__title"
            onClick={handleGotoItem}
          >
            {`${item.name}, ${formatWeightWithUnit(item.weight)}`}
          </div>
          <div className="rn-product-card__bottom">
            <div className="rn-product-card__bottom_l">
              <div className="rn-product-card__price">{formatCurrency(item.price)}</div>
              <Tag>{`за ${formatWeightWithUnit(item.weight)}`}</Tag>
              {/* {item.price_kg && (
                <p style={{ color: 'red', fontSize: 19 }}>{item.price_kg} руб</p>
              )} */}
            </div>
            {active && (
              <CartQtyButtonGroup item={item} />
            )}
          </div>
        </div>
      </div>
    </List.Item>
  );
};

export default ProductItem;
