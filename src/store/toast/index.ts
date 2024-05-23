import { createSlice } from "@reduxjs/toolkit";

type ToastSliceType = {
  type: "success" | "warning" | "error" | null;
  message: string | null;
};

const initValue: ToastSliceType = {
  type: null,
  message: null,
};

const toastSlice = createSlice({
  name: "toast",
  initialState: initValue,
  reducers: {
    successToast: (state, { payload }) => {
      state.type = "success";
      state.message = payload;
    },

    errorToast: (state, { payload }) => {
      state.type = "error";
      state.message = payload;
    },

    warningToast: (state, { payload }) => {
      state.type = "warning";
      state.message = payload;
    },

    reset: (state) => {
      state.type = null;
      state.message = null;
    },
  },
});

export const { successToast, errorToast, warningToast, reset } =
  toastSlice.actions;

export default toastSlice.reducer;
