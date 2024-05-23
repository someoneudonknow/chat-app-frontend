import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user";
import contactRequestReducer from "./contactRequest";
import toastReducer from "./toast";

const store = configureStore({
  reducer: {
    contactRequest: contactRequestReducer,
    user: userReducer,
    toast: toastReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
