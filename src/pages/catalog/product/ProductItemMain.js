import React from "react";
import { useDispatch } from "react-redux";

import { addToCart, fetchCartProducts } from "store/slices/cartSlice";
import { setSigninModalIsOpen } from "store/slices/layoutSlice";
import useCustomer from "hooks/useCustomer";
import { formatCurrency, formatWeightWithUnit } from "helpers/formatter";
import { getStock } from "helpers/product";

const ProductItemMain = ({ product_id, data }) => {
  const dispatch = useDispatch();
  const { customer } = useCustomer();
  const stock = getStock(data);

  if (!data || !data.heading_title) {
    return null;
  }

  let stockText;
  if (stock.quantity === 0 || stock.stock === 0) {
    stockText = "нет в наличии";
  } else if (stock.quantity === 999 || stock.stock === 999) {
    stockText = "В наличии много";
  } else {
    stockText = `В наличии ${stock.quantity} шт.`;
  }

  // Форматируем отзывы - если уже есть слово "отзывов", не добавляем его снова
  const reviewsText = data.reviews 
    ? (data.reviews.includes("отзывов") ? data.reviews : `${data.reviews} отзывов`)
    : "12 отзывов";

  return (
    <div className="product-details-card">
      <div className="product-details">
        {/* Рейтинг, отзывы, артикул и избранное */}
        <div className="product-header-row" style={{ marginBottom: "24px", display: "flex", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
          <div className="popular-product-rating" style={{ position: "static", marginRight: "8px" }}>
            <img
              src={`${process.env.PUBLIC_URL}/icons/icon-star.svg`}
              alt="Рейтинг"
              className="popular-product-rating-icon"
            />
            <span className="popular-product-rating-value">{data.rating || "4,6"}</span>
          </div>
          <span className="product-reviews" style={{ marginRight: "16px" }}>{reviewsText}</span>
          <div className="product-article" style={{ marginRight: "auto" }}>
            <span className="product-article-label">Артикул:</span> <span className="product-article-value">{data.model || "A-133"}</span>
          </div>
          <button
            className="product-favorite-button"
            onClick={(e) => {
              e.preventDefault();
              // TODO: Добавить логику добавления в избранное
            }}
          >
            <img
              src={`${process.env.PUBLIC_URL}/icons/icon-heart.svg`}
              alt="Избранное"
              className="product-favorite-icon"
            />
          </button>
        </div>

      {/* Название товара */}
      <h1 className="product-title">
        {data.heading_title}, {formatWeightWithUnit(data.weight)}
      </h1>

      {/* Метки доставки */}
      <div className="product-delivery-tags">
        {data.weight && data.weight.includes("кг") && (
          <span className="product-delivery-tag">Весовой товар</span>
        )}
        <span className="product-delivery-tag">Курьер: {formatCurrency(200)}</span>
        <span className="product-delivery-tag">Самовывоз: {formatCurrency(0)}</span>
      </div>

      {/* Цена */}
      <div className="product-price-section">
        <div className="product-price-row">
          <div className="product-price-main">
            <span className="product-price-value">{formatCurrency(data.price)}</span>
            <span className="product-price-separator"> / </span>
            <span className="product-price-weight">{formatWeightWithUnit(data.weight)}</span>
          </div>
          <div className="product-price-details">
            {data.price_kg && (
              <div className="product-price-kg">
                <span className="product-price-label">Цена за кг:</span> <span className="product-price-value-small">{formatCurrency(data.price_kg)}</span>
              </div>
            )}
            {data.weight && (
              <div className="product-max-weight">
                <span className="product-price-label">Макс. вес:</span> <span className="product-price-value-small">{formatWeightWithUnit(data.weight)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Кнопка корзины и наличие */}
      <div className="product-cart-row" style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px" }}>
        <button
          className="popular-product-button"
          onClick={async (e) => {
            e.preventDefault();
            if (!customer.token) {
              dispatch(setSigninModalIsOpen(true));
              return;
            }
            await addToCart(product_id, data.minimum || 1);
            dispatch(fetchCartProducts());
          }}
          disabled={stock.quantity === 0 && stock.stock === 0}
          style={{ marginBottom: 0, flex: 1 }}
        >
          <img
            src={`${process.env.PUBLIC_URL}/icons/icon-shopping-cart.svg`}
            alt=""
            className="popular-product-button-icon"
          />
          <span>В корзину</span>
        </button>
        <div className={`product-stock ${stock.quantity === 0 || stock.stock === 0 ? 'product-stock-unavailable' : ''}`} style={{ marginTop: 0, whiteSpace: "nowrap" }}>
          {stockText}
        </div>
      </div>
      </div>
    </div>
  );
};

export default ProductItemMain;
