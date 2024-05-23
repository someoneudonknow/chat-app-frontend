"use strict";

import { REFRESH_TOKEN } from "../constants/api-endpoints";
import { LOGIN, REGISTER, LOGOUT } from "../constants/api-endpoints";
import { UserStatus } from "../constants/types";
import BaseService from "./BaseService";

class AuthService extends BaseService {
  constructor(baseUrl: string) {
    super(baseUrl);
    this.initAuthMiddlewares();
  }

  private initAuthMiddlewares() {
    this.fetchHelper.useInRes((res) => {
      if (res?.metadata?.user?.status === UserStatus.BANNED) {
        throw new Error("You have been banned from admin");
      }

      return res;
    });
  }

  public async loginWithEmailPassword(email: string, password: string) {
    return await this.post(LOGIN, {}, { email, password });
  }

  public async registerWithEmailPassword(email: string, password: string) {
    return await this.post(REGISTER, {}, { email, password });
  }

  public async logout() {
    return await this.post(LOGOUT, {}, {});
  }

  public async refreshToken() {
    return await this.post(REFRESH_TOKEN, {}, {});
  }
}

export default AuthService;
