import { configureStore } from "@reduxjs/toolkit";
import {
  createStateSyncMiddleware,
  initMessageListener,
} from "redux-state-sync";
import userReducer from "./user";
import contactRequestReducer from "./contactRequest";
import toastReducer from "./toast";
import appReducer from "./app";
import userConservationReducer from "./userConservation";

const store = configureStore({
  reducer: {
    contactRequest: contactRequestReducer,
    user: userReducer,
    toast: toastReducer,
    app: appReducer,
    conservation: userConservationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

initMessageListener(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
