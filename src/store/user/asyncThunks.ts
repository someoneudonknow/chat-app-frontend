import { parseJWT } from "./../../utils/index";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AuthService, UserService } from "../../services";
import { BASE_URL } from "../../constants/api-endpoints";
import { errorToast, successToast } from "../toast";
import { SignInType } from "../../constants/types";
import Cookies from "js-cookie";
import { ACCESS_TOKEN, CLIENT_ID, REFRESH_TOKEN } from "../../constants";
import User from "../../models/user.model";

export const loginWithEmailPassword = createAsyncThunk(
  "users/login",
  async (
    {
      email,
      password,
      remember,
    }: { email: string; password: string; remember: boolean },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const authService = new AuthService(BASE_URL);

      const response = await authService.loginWithEmailPassword(
        email,
        password
      );

      const userAccessToken = response?.metadata?.tokens.accessToken;
      const userRefreshToken = response?.metadata?.tokens.refreshToken;
      const refreshTokenExpired = parseJWT(userRefreshToken).exp * 1000;
      const accessTokenExpired = parseJWT(userAccessToken).exp * 1000;

      Cookies.set(REFRESH_TOKEN, userRefreshToken, {
        expires: refreshTokenExpired,
      });

      Cookies.set(CLIENT_ID, response?.metadata?.user?._id, {
        expires: refreshTokenExpired,
      });

      Cookies.set(ACCESS_TOKEN, userAccessToken, {
        expires: accessTokenExpired,
      });

      dispatch(successToast("Login successfully"));

      return response;
    } catch (err: any) {
      dispatch(errorToast(err.message));
      return rejectWithValue(err);
    }
  }
);

export const signup = createAsyncThunk(
  "users/signin",
  async ({ email, password }: SignInType, { rejectWithValue, dispatch }) => {
    try {
      const authService = new AuthService(BASE_URL);
      const user = await authService.registerWithEmailPassword(email, password);

      const userAccessToken = user?.metadata?.tokens.accessToken;
      const userRefreshToken = user?.metadata?.tokens.refreshToken;
      const refreshTokenExpired = parseJWT(userRefreshToken).exp * 1000;
      const accessTokenExpired = parseJWT(userAccessToken).exp * 1000;

      Cookies.set(REFRESH_TOKEN, userRefreshToken, {
        expires: refreshTokenExpired,
      });

      Cookies.set(CLIENT_ID, user?.metadata?.user?._id, {
        expires: refreshTokenExpired,
      });

      Cookies.set(ACCESS_TOKEN, userAccessToken, {
        expires: accessTokenExpired,
      });

      dispatch(successToast("Registered successfully"));
      return user;
    } catch (err: any) {
      dispatch(errorToast(err.message));
      return rejectWithValue(err);
    }
  }
);

export const logout = createAsyncThunk(
  "users/logout",
  async (_, { rejectWithValue }) => {
    try {
      const authService = new AuthService(BASE_URL);
      await authService.logout();

      Cookies.remove(REFRESH_TOKEN);
      Cookies.remove(CLIENT_ID);
      Cookies.remove(ACCESS_TOKEN);
    } catch (err: any) {
      return rejectWithValue(err);
    }
  }
);

export const refreshToken = createAsyncThunk(
  "users/refresh",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const authService = new AuthService(BASE_URL);
      const response = await authService.refreshToken();
      const userAccessToken = response?.metadata?.tokens.accessToken;
      const userRefreshToken = response?.metadata?.tokens.refreshToken;
      const refreshTokenExpired = parseJWT(userRefreshToken).exp * 1000;
      const accessTokenExpired = parseJWT(userAccessToken).exp * 1000;

      Cookies.set(REFRESH_TOKEN, userRefreshToken, {
        expires: refreshTokenExpired,
      });

      Cookies.set(ACCESS_TOKEN, userAccessToken, {
        expires: accessTokenExpired,
      });

      Cookies.set(CLIENT_ID, response?.metadata?.user?.userId, {
        expires: refreshTokenExpired,
      });

      return response;
    } catch (err: any) {
      dispatch(errorToast(err.message));
      return rejectWithValue(err);
    }
  }
);

export const getProfile = createAsyncThunk(
  "users/profile",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const userService = new UserService(BASE_URL);
      const response = await userService.getProfile();
      return response;
    } catch (err: any) {
      dispatch(errorToast(err.message));
      return rejectWithValue(err);
    }
  }
);

export const updateProfile = createAsyncThunk(
  "users/updateProfile",
  async (payload: Partial<User>, { rejectWithValue }) => {
    try {
      const userService = new UserService(BASE_URL);
      const updatedProfile = await userService.updateProfile(payload);

      return updatedProfile?.metadata;
    } catch (e: any) {
      return rejectWithValue(e);
    }
  }
);

export const increaseProfileStep = createAsyncThunk(
  "users/increaseProfileStep",
  async (_, { rejectWithValue }) => {
    try {
      const userService = new UserService(BASE_URL);
      const updatedProfile = await userService.increaseProfileStep();

      return updatedProfile?.metadata;
    } catch (e: any) {
      return rejectWithValue(e);
    }
  }
);

export const addInterests = createAsyncThunk(
  "users/updateProfile/addinterests",
  async (payload: string[], { rejectWithValue }) => {
    try {
      const userService = new UserService(BASE_URL);
      const updatedProfile = await userService.addInterests(payload);

      return updatedProfile?.metadata;
    } catch (e: any) {
      return rejectWithValue(e);
    }
  }
);

export const removeInterest = createAsyncThunk(
  "users/updateProfile/removeInterests",
  async (payload: string, { rejectWithValue }) => {
    try {
      const userService = new UserService(BASE_URL);
      const updatedProfile = await userService.removeInterest(payload);

      return updatedProfile?.metadata;
    } catch (e: any) {
      return rejectWithValue(e);
    }
  }
);
