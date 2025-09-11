import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import fetcher, { loadingStatus } from "helpers/fetcher";
import { cart, checkout } from "constants/endpoints";

const addToCart = async (product_id, quantity = 1) => {
  const formData = new FormData();
  formData.append("product_id", product_id);
  formData.append("quantity", quantity);
  const response = await fetcher(cart.ADD, {
    method: "POST",
    body: formData,
  });
  return response.json();
};

const batchAddToCart = async (products) => {
  const response = await fetcher(cart.BATCH_ADD, {
    method: "POST",
    body: JSON.stringify({ products }),
  });
  return response.json();
};

const reduceFromCart = async (product_id, quantity = 1) => {
  const formData = new FormData();
  formData.append("product_id", product_id);
  formData.append("quantity", quantity);
  const response = await fetcher(cart.REDUCE, {
    method: "POST",
    body: formData,
  });
  return response.json();
};

const removeFromCart = async (key) => {
  const formData = new FormData();
  formData.append("key", key);
  const response = await fetcher(cart.REMOVE, {
    method: "POST",
    body: formData,
  });
  return response.json();
};

const checkoutSave = async (data) => {
  const formData = new FormData();
  Object.keys(data).forEach((k) => formData.append(k, data[k]));
  const response = await fetcher(checkout.SAVE, {
    method: "POST",
    body: formData,
  });
  return response.json();
};

const checkoutPayment = async (action) => {
  const response = await fetcher(action);
  return response.json();
};

const fetchCartProducts = createAsyncThunk("cart.PRODUCTS", async () => {
  const response = await fetcher(cart.CART);
  return response.json();
});

const fetchShippingMethods = createAsyncThunk("cart.SHIPPING_METHODS", async () => {
  const response = await fetcher("/index.php?route=checkout/shipping_method");
  return response.json();
});

const fetchPaymentMethods = createAsyncThunk("cart.PAYMENT_METHOD", async () => {
  const response = await fetcher("/index.php?route=checkout/payment_method");
  return response.json();
});

const fetchSuccessPage = createAsyncThunk("cart.SUCCESS_PAGE", async (orderId = "") => {
  const response = await fetcher(`/index.php?route=checkout/success${orderId ? `&order_id=${orderId}` : ""}`);
  return response.json();
});

const calcBasedOnYaTaxi = async (storeCoords, coords, cb) => {
  const formData = new FormData();
  formData.append("rll", storeCoords.join(',')  + '~' + coords.join(','));
  const response = await fetcher("/index.php?route=checkout/checkout/yandex_taxi", {
    method: "POST",
    body: formData,
  });
  const res = await response.json();
  const taxiPrice = (JSON.parse(res)).options[0].price;
  cb(taxiPrice);
};

const initialState = {
  cartProducts: {
    data: {},
    status: loadingStatus.IDLE,
  },
  shippingMethods: {
    data: {},
    status: loadingStatus.IDLE,
  },
  paymentMethods: {
    data: {},
    status: loadingStatus.IDLE,
  },
  successPage: {
    data: {},
    status: loadingStatus.IDLE,
  },
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchCartProducts.pending, (state, action) => {
        state.cartProducts.status = loadingStatus.LOADING;
      })
      .addCase(fetchCartProducts.fulfilled, (state, action) => {
        state.cartProducts.status = loadingStatus.SUCCEEDED;
        state.cartProducts.data = action.payload;
      })
      .addCase(fetchShippingMethods.pending, (state, action) => {
        state.shippingMethods.status = loadingStatus.LOADING;
      })
      .addCase(fetchShippingMethods.fulfilled, (state, action) => {
        state.shippingMethods.status = loadingStatus.SUCCEEDED;
        state.shippingMethods.data = action.payload;
      })
      .addCase(fetchPaymentMethods.pending, (state, action) => {
        state.paymentMethods.status = loadingStatus.LOADING;
      })
      .addCase(fetchPaymentMethods.fulfilled, (state, action) => {
        state.paymentMethods.status = loadingStatus.SUCCEEDED;
        state.paymentMethods.data = action.payload;
      })
      .addCase(fetchSuccessPage.fulfilled, (state, action) => {
        state.successPage.status = loadingStatus.SUCCEEDED;
        state.successPage.data = action.payload;
      })
  }
});

export default cartSlice.reducer;

// export const { postAdded, postUpdated, reactionAdded } = playerSlice.actions;
export {
  reduceFromCart,
  addToCart,
  removeFromCart,
  batchAddToCart,
  checkoutSave,
  checkoutPayment,
  calcBasedOnYaTaxi,
  fetchCartProducts,
  fetchShippingMethods,
  fetchPaymentMethods,
  fetchSuccessPage,
};
