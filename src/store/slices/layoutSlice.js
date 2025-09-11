import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { raw } from "constants/endpoints";

import { getCustomer, setCustomer } from "helpers/customer";
import fetcher, { loadingStatus } from "helpers/fetcher";

const fetchMainInfo = createAsyncThunk("header.INFO", async () => {
  const response = await fetcher(raw.MAIN);
  return response.json();
});

const initialState = {
  deliveryModalIsOpen: false,
  deliveryModalData: {
    address: getCustomer().address || "",
    costAddress: getCustomer().cost_address || 0,
  },
  yookassaWidgetModalIsOpen: false,
  yookassaWidgetData: {
    confirmationToken: getCustomer().confirmation_token || "",
    lastOrderId: getCustomer().last_order_id || "",
  },
  signinModalIsOpen: false,
  mobileSearchModalIsOpen: false,
  mainInfo: {
    data: {},
    status: loadingStatus.IDLE,
  }
};

const layoutSlice = createSlice({
  name: "layout",
  initialState,
  reducers: {
    setDeliveryModalIsOpen: (state) => {
      state.deliveryModalIsOpen = !state.deliveryModalIsOpen;
    },
    setDeliveryModalData: (state, { payload }) => {
      setCustomer({
        address: payload.address,
        cost_address: +payload.costAddress,
      });
      state.deliveryModalData = payload;
    },
    setYookassaWidgetModalIsOpen: (state) => {
      state.yookassaWidgetModalIsOpen = !state.yookassaWidgetModalIsOpen;
    },
    setYookassaWidgetData: (state, { payload }) => {
      setCustomer({ confirmation_token: payload.confirmationToken, last_order_id: payload.lastOrderId });
      state.yookassaWidgetData = payload;
    },
    setSigninModalIsOpen: (state) => {
      state.signinModalIsOpen = !state.signinModalIsOpen;
    },
    setMobileSearchModalIsOpen: (state) => {
      state.mobileSearchModalIsOpen = !state.mobileSearchModalIsOpen;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchMainInfo.pending, (state, action) => {
        state.mainInfo.status = loadingStatus.LOADING;
      })
      .addCase(fetchMainInfo.fulfilled, (state, action) => {
        state.mainInfo.status = loadingStatus.SUCCEEDED;
        state.mainInfo.data = action.payload;
      })
  }
});


export const {
  setDeliveryModalIsOpen,
  setDeliveryModalData,
  setYookassaWidgetModalIsOpen,
  setYookassaWidgetData,
  setSigninModalIsOpen,
  setMobileSearchModalIsOpen,
} = layoutSlice.actions;

export default layoutSlice.reducer;

export {
  fetchMainInfo,
};
