import { createAsyncThunk } from "@reduxjs/toolkit";
import { ConservationService } from "../../services";
import { BASE_URL } from "../../constants/api-endpoints";

export const getUserConservations = createAsyncThunk(
  "users/conservations",
  async (
    { limit, page }: { limit: number; page: number },
    { rejectWithValue }
  ) => {
    const conservationService = new ConservationService(BASE_URL);
    try {
      return await conservationService.getJoinedConservations({
        page,
        limit,
      });
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);
