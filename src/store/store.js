import { configureStore } from '@reduxjs/toolkit';

import menu from './slices/menuSlice';
import product from './slices/productSlice';
import page from './slices/pageSlice';
import cart from './slices/cartSlice';
import customer from './slices/customerSlice';
import module from './slices/moduleSlice';
import layout from './slices/layoutSlice';

export const store = configureStore({
  reducer: {
    menu,
    product,
    page,
    cart,
    customer,
    module,
    layout,
  },
  devTools: process.env.NODE_ENV !== 'production',
});
