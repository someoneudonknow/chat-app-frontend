import { createAsyncThunk } from "@reduxjs/toolkit";
import { ContactService } from "../../services";
import { BASE_URL } from "../../constants/api-endpoints";
import { errorToast, successToast } from "../toast";

export const getPendingContactRequest = createAsyncThunk(
  "contact-request/pending",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const contactRequestService = new ContactService(BASE_URL);
      const result = await contactRequestService.getReceivedContactRequests();

      return result.metadata.list;
    } catch (e: any) {
      dispatch(errorToast(e.message as string));
      rejectWithValue(e.message);
    }
  }
);

export const getSentContactRequest = createAsyncThunk(
  "contact-request/sent",
  async (_, { rejectWithValue }) => {
    try {
      const contactRequestService = new ContactService(BASE_URL);
      const result = await contactRequestService.getSentContactRequests();
      return result.metadata.list;
    } catch (e: any) {
      rejectWithValue(e.message);
    }
  }
);

export const addContact = createAsyncThunk(
  "contact-request/add",
  async (
    {
      receiverId,
      requestMessage,
    }: { receiverId: string; requestMessage: string },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const contactRequestService = new ContactService(BASE_URL);
      const result = await contactRequestService.addContact({
        receiver: receiverId,
        requestMessage: requestMessage,
      });

      dispatch(successToast(result.message as string));
      return result.metadata;
    } catch (e: any) {
      dispatch(errorToast(e.message as string));
      rejectWithValue(e.message);
    }
  }
);

export const cancelContactRequest = createAsyncThunk(
  "contact-request/cancel",
  async (id: string, { rejectWithValue, dispatch }) => {
    try {
      const contactRequestService = new ContactService(BASE_URL);
      const result = await contactRequestService.cancelContactRequest(id);
      dispatch(successToast(result.message as string));
      return result.metadata;
    } catch (e: any) {
      dispatch(errorToast(e.message as string));
      rejectWithValue(e.message);
    }
  }
);
