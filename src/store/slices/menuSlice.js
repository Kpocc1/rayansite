import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import fetcher, { loadingStatus } from "helpers/fetcher";
import { raw } from "constants/endpoints";

const fetchCategoriesList = createAsyncThunk("menu.CATEGORIES_LIST", async () => {
  const response = await fetcher(raw.CATEGORIES_LIST);
  return response.json();
});

const initialState = {
  categoriesList: {
    data: {},
    status: loadingStatus.IDLE,
  },
};

const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchCategoriesList.pending, (state, action) => {
        state.categoriesList.status = loadingStatus.LOADING;
      })
      .addCase(fetchCategoriesList.fulfilled, (state, action) => {
        state.categoriesList.status = loadingStatus.SUCCEEDED;
        state.categoriesList.data = action.payload;
      })
  }
});

export default menuSlice.reducer;

// export const { postAdded, postUpdated, reactionAdded } = playerSlice.actions;
export {
  fetchCategoriesList,
};
