import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import fetcher, { loadingStatus } from "helpers/fetcher";
import { product } from "constants/endpoints";

const fetchCategory = createAsyncThunk("product.CATEGORY", async ({ url, searchParams }) => {
  let _url = url.replace(/&amp;/g, "&");
  if (searchParams) {
    const params = new URLSearchParams(searchParams);
    // params.set("page", page);
    _url += `&${params.toString()}`;
  }
  const response = await fetcher(_url);
  return response.json();
});
// const fetchCategory = createAsyncThunk("product.CATEGORY", async (category_id) => {
//   const response = await fetcher(`/index.php?route=product/category&path=${category_id}`);
//   return response.json();
// });

const fetchProduct = createAsyncThunk("product.PRODUCT", async (product_id) => {
  const response = await fetcher(`${product.INDEX}&product_id=${product_id}`);
  return response.json();
});

const fetchReview = createAsyncThunk("product.REVIEW", async (product_id) => {
  const response = await fetcher(`${product.INDEX}/review&product_id=${product_id}`);
  return response.json();
});

const fetchSearch = createAsyncThunk("product.SEARCH", async (search) => {
  const response = await fetcher(`${product.SEARCH}&search=${search}`);
  return response.json();
});

const initialState = {
  category: {
    data: {},
    status: loadingStatus.IDLE,
  },
  product: {
    data: {},
    status: loadingStatus.IDLE,
  },
  review: {
    data: {},
    status: loadingStatus.IDLE,
  },
  search: {
    data: {},
    status: loadingStatus.IDLE,
  },
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchCategory.pending, (state, action) => {
        state.category.status = loadingStatus.LOADING;
      })
      .addCase(fetchCategory.fulfilled, (state, action) => {
        state.category.status = loadingStatus.SUCCEEDED;
        state.category.data = action.payload;
      })

      .addCase(fetchProduct.pending, (state, action) => {
        state.product.status = loadingStatus.LOADING;
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.product.status = loadingStatus.SUCCEEDED;
        state.product.data = action.payload;
      })

      .addCase(fetchSearch.pending, (state, action) => {
        state.search.status = loadingStatus.LOADING;
      })
      .addCase(fetchSearch.fulfilled, (state, action) => {
        state.search.status = loadingStatus.SUCCEEDED;
        state.search.data = action.payload;
      })

      .addCase(fetchReview.pending, (state, action) => {
        state.review.status = loadingStatus.LOADING;
      })
      .addCase(fetchReview.fulfilled, (state, action) => {
        state.review.status = loadingStatus.SUCCEEDED;
        state.review.data = action.payload;
      })
  }
});

export default productSlice.reducer;

// export const { postAdded, postUpdated, reactionAdded } = playerSlice.actions;
export {
  fetchCategory,
  fetchProduct,
  fetchReview,
  fetchSearch,
};
