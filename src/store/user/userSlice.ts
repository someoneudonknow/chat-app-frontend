import { createSlice } from "@reduxjs/toolkit";

import Cookie from "js-cookie";
import { REFRESH_TOKEN } from "../../constants";
import {
  addInterests,
  getProfile,
  increaseProfileStep,
  loginWithEmailPassword,
  logout,
  refreshToken,
  removeInterest,
  signup,
  updateProfile,
} from "./asyncThunks";
import User from "../../models/user.model";

type UserStateType = {
  currentUser: User | null;
  auth: {
    accessToken: string | null;
    refreshToken: string | null;
  };
  isLoading: boolean;
};

const initialValue: UserStateType = {
  currentUser: null,
  auth: {
    accessToken: null,
    refreshToken: Cookie.get(REFRESH_TOKEN) || null,
  },
  isLoading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState: initialValue,
  reducers: {
    resetAuthState: (state) => {
      state.auth.accessToken = null;
      state.auth.refreshToken = null;
      state.currentUser = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(loginWithEmailPassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginWithEmailPassword.fulfilled, (state, { payload }) => {
        state.currentUser = payload.metadata.user;
        state.auth.accessToken = payload.metadata.tokens.accessToken;
        state.auth.refreshToken = payload.metadata.tokens.refreshToken;
        state.isLoading = false;
      })
      .addCase(loginWithEmailPassword.rejected, (state) => {
        state.isLoading = false;
      });

    builder
      .addCase(signup.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(signup.fulfilled, (state, { payload }) => {
        state.currentUser = payload.metadata.user;
        state.auth.accessToken = payload.metadata.tokens.accessToken;
        state.auth.refreshToken = payload.metadata.tokens.refreshToken;
        state.isLoading = false;
      })
      .addCase(signup.rejected, (state) => {
        state.isLoading = false;
      });

    builder
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false;
        state.currentUser = null;
        state.auth.accessToken = null;
        state.auth.refreshToken = null;
      })
      .addCase(logout.rejected, (state) => {
        state.isLoading = false;
      });

    builder
      .addCase(refreshToken.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(refreshToken.fulfilled, (state, { payload }) => {
        state.auth.accessToken = payload.metadata.tokens.accessToken;
        state.auth.refreshToken = payload.metadata.tokens.refreshToken;
        state.isLoading = false;
      })
      .addCase(refreshToken.rejected, (state) => {
        state.isLoading = false;
      });

    builder
      .addCase(getProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProfile.fulfilled, (state, { payload }) => {
        state.currentUser = payload.metadata;
        state.isLoading = false;
      })
      .addCase(getProfile.rejected, (state) => {
        state.isLoading = false;
      });

    builder
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateProfile.fulfilled, (state, { payload }) => {
        state.currentUser = payload;
        state.isLoading = false;
      })
      .addCase(updateProfile.rejected, (state) => {
        state.isLoading = false;
      });

    builder
      .addCase(increaseProfileStep.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(increaseProfileStep.fulfilled, (state, { payload }) => {
        if (state.currentUser) {
          state.currentUser.lastCompletedUserProfileStep =
            payload.lastCompletedUserProfileStep;
        }

        state.isLoading = false;
      })
      .addCase(increaseProfileStep.rejected, (state) => {
        state.isLoading = false;
      });

    builder
      .addCase(addInterests.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addInterests.fulfilled, (state, { payload }) => {
        state.currentUser = payload;
        state.isLoading = false;
      })
      .addCase(addInterests.rejected, (state) => {
        state.isLoading = false;
      });

    builder
      .addCase(removeInterest.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(removeInterest.fulfilled, (state, { payload }) => {
        state.currentUser = payload;
        state.isLoading = false;
      })
      .addCase(removeInterest.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { resetAuthState } = userSlice.actions;

export default userSlice.reducer;
