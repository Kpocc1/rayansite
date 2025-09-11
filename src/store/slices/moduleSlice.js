import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { raw } from "constants/endpoints";

import fetcher, { loadingStatus } from "helpers/fetcher";

const fetchTopModules = createAsyncThunk("module.TOP", async (route = "common/home") => {
  const response = await fetcher(`${raw.MODULE_TOP}${route}`);
  return response.json();
});

const fetchBottomModules = createAsyncThunk("module.BOTTOM", async (route = "common/home") => {
  const response = await fetcher(`${raw.MODULE_BOTTOM}${route}`);
  return response.json();
});

const initialState = {
  bottomModules: {
    data: {},
    status: loadingStatus.IDLE,
  },
  topModules: {
    data: {},
    status: loadingStatus.IDLE,
  },
};

const moduleSlice = createSlice({
  name: "module",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchTopModules.pending, (state, action) => {
        state.topModules.status = loadingStatus.LOADING;
      })
      .addCase(fetchTopModules.fulfilled, (state, action) => {
        state.topModules.status = loadingStatus.SUCCEEDED;
        state.topModules.data = action.payload;
      })
      .addCase(fetchBottomModules.pending, (state, action) => {
        state.bottomModules.status = loadingStatus.LOADING;
      })
      .addCase(fetchBottomModules.fulfilled, (state, action) => {
        state.bottomModules.status = loadingStatus.SUCCEEDED;
        state.bottomModules.data = action.payload;
      })
  }
});

export default moduleSlice.reducer;

// export const { postAdded, postUpdated, reactionAdded } = playerSlice.actions;
export {
  fetchTopModules,
  fetchBottomModules,
};
