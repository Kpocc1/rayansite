import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import fetcher, { loadingStatus } from "helpers/fetcher";

const fetchPage = createAsyncThunk("page.PAGE", async ({ id, route }) => {
  let response;
  if (route) {
    response = await fetcher(`/index.php?route=${route}`);
  } else {
    response = await fetcher(`/index.php?route=information/information&information_id=${id}`);
  }
  return response.json();
});

const fetchNewsList = createAsyncThunk("page.NEWS.LIST", async () => {
  // Ходим на продовый бэк точно так же, как страница /news на сайте
  const baseUrl = "https://rayanhalal.ru";
  const response = await fetch(
    `${baseUrl}/site/index.php?route=information/news&store_id=0`
  );
  return response.json();
});

const fetchNewsDetail = createAsyncThunk("page.NEWS.DETAIL", async (id) => {
  const response = await fetcher(`/index.php?route=information/news/info/&news_id=${id}`);
  return response.json();
});

const initialState = {
  page: {
    data: {},
    status: loadingStatus.IDLE,
  },
  newsList: {
    data: {},
    status: loadingStatus.IDLE,
  },
  newsDetail: {
    data: {},
    status: loadingStatus.IDLE,
  },
};

const pageSlice = createSlice({
  name: "page",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchPage.pending, (state, action) => {
        state.page.status = loadingStatus.LOADING;
      })
      .addCase(fetchPage.fulfilled, (state, action) => {
        state.page.status = loadingStatus.SUCCEEDED;
        state.page.data = action.payload;
      })
      .addCase(fetchNewsList.pending, (state, action) => {
        state.newsList.status = loadingStatus.LOADING;
      })
      .addCase(fetchNewsList.fulfilled, (state, action) => {
        state.newsList.status = loadingStatus.SUCCEEDED;
        state.newsList.data = action.payload;
      })
      .addCase(fetchNewsDetail.pending, (state, action) => {
        state.newsDetail.status = loadingStatus.LOADING;
      })
      .addCase(fetchNewsDetail.fulfilled, (state, action) => {
        state.newsDetail.status = loadingStatus.SUCCEEDED;
        state.newsDetail.data = action.payload;
      })
  }
});

export default pageSlice.reducer;

// export const { postAdded, postUpdated, reactionAdded } = playerSlice.actions;
export {
  fetchPage,
  fetchNewsList,
  fetchNewsDetail,
};
