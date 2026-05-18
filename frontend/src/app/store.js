import {configureStore} from "@reduxjs/toolkit";
import authReducer from "../app/auth/authSlice.js";
import { configureStore } from '@reduxjs/toolkit';
import api from './api.jsx';

export const store= configureStore({
    reducer:{
        auth: authReducer,
    }
})
export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(api.middleware),
});