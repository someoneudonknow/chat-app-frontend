import { createSlice } from "@reduxjs/toolkit";
import ContactRequest from "../../models/contactRequest.model";
import {
  addContact,
  cancelContactRequest,
  getPendingContactRequest,
  getSentContactRequest,
} from "./asyncThunk";

type InitType = {
  pendingContactRequests: ContactRequest[];
  sentContactRequests: ContactRequest[];
  isLoading: boolean;
};

const initValue: InitType = {
  pendingContactRequests: [],
  sentContactRequests: [],
  isLoading: false,
};

const contactRequestSlice = createSlice({
  name: "contact-requests",
  initialState: initValue,
  reducers: {
    clearState: (state) => {
      state.pendingContactRequests = [];
      state.sentContactRequests = [];
      state.isLoading = false;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(addContact.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addContact.fulfilled, (state, { payload }) => {
        if (payload) {
          state.sentContactRequests = [...state.sentContactRequests, payload];
        }
        state.isLoading = false;
      })
      .addCase(addContact.rejected, (state) => {
        state.isLoading = false;
      });

    builder
      .addCase(getPendingContactRequest.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPendingContactRequest.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.pendingContactRequests = payload;
      })
      .addCase(getPendingContactRequest.rejected, (state) => {
        state.isLoading = false;
      });

    builder
      .addCase(getSentContactRequest.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSentContactRequest.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.sentContactRequests = payload;
      })
      .addCase(getSentContactRequest.rejected, (state) => {
        state.isLoading = false;
      });

    builder
      .addCase(cancelContactRequest.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(cancelContactRequest.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        if (payload) {
          state.sentContactRequests = state.sentContactRequests.filter(
            (r) => r._id !== payload._id
          );
        }
      })
      .addCase(cancelContactRequest.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default contactRequestSlice.reducer;
