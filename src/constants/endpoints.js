const raw = {
  MAIN: "/index.php?route=common/main",
  CATEGORIES_LIST: "/index.php?route=common/megamenu",
  MODULE_TOP: "/index.php?route=common/content_top&layout_route=",
  MODULE_BOTTOM: "/index.php?route=common/content_bottom&layout_route=",
  WISHLIST_ADD: "/index.php?route=account/wishlist/add",
  WISHLIST_DELETE: "/index.php?route=account/wishlist/remove",
};

const cart = {
  CART: "/index.php?route=checkout/cart",
  ADD: "/index.php?route=checkout/cart/add",
  REDUCE: "/index.php?route=checkout/cart/minus",
  REMOVE: "/index.php?route=checkout/cart/remove",
  BATCH_ADD: "/index.php?route=checkout/cart/batchAdd",
};

const checkout = {
  SAVE: "/index.php?route=checkout/checkout/save",
};

const product = {
  INDEX: "/index.php?route=product/product", // product_id=133
  CATALOG: "/index.php?route=product/category&path=1",
  SEARCH: "/index.php?route=product/search",
};

export {
  raw,
  cart,
  checkout,
  product,
};
