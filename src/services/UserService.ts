import {
  FORGOT_PASSWORD,
  PROFILE_COMPLETION,
  RESET_PASSWORD,
  SEARCH_USERS,
  USER_CONSERVATIONS,
  USER_CONTACTS,
  USER_DISCOVER,
  USER_INTERESTS,
  USER_PROFILE,
  USER_RECOMMENDED,
} from "../constants/api-endpoints";
import User from "../models/user.model";
import BaseService from "./BaseService";

class UserService extends BaseService {
  constructor(baseUrl: string) {
    super(baseUrl);
  }

  public async searchConservations({
    keyword,
    page,
    limit,
  }: {
    keyword: string;
    page: number;
    limit: number;
  }) {
    console.log({
      url: `${USER_CONSERVATIONS}/${keyword}?page=${page}&limit=${limit}`,
    });
    return await this.get(
      `${USER_CONSERVATIONS}/${keyword}?page=${page}&limit=${limit}`,
      {},
      { cached: { timeout: 3000 } }
    );
  }

  public async searchContacts({
    keyword,
    page,
    limit,
  }: {
    keyword: string;
    page: number;
    limit: number;
  }) {
    return this.get(
      `${USER_CONTACTS}/${keyword}?page=${page}&limit=${limit}`,
      {},
      {
        cached: {
          timeout: 3000,
        },
      }
    );
  }

  public async getContactsInfo({
    page = 1,
    limit = 10,
  }: {
    page?: number;
    limit?: number;
  }) {
    return await this.get(
      `${USER_CONTACTS}?page=${page}&limit=${limit}`,
      {},
      { cached: { timeout: 3000 } }
    );
  }

  public async discoverUser(id: string) {
    return await this.get(`${USER_DISCOVER}/${id}`);
  }

  public async getContactRecomendations({
    page = 1,
    limit = 10,
  }: {
    page: number;
    limit: number;
  }) {
    return await this.get(
      `${USER_RECOMMENDED}?page=${page}&limit=${limit}`,
      {}
    );
  }

  public async updateProfile(payload: Partial<User>) {
    return await this.patch(USER_PROFILE, {}, payload);
  }

  public async increaseProfileStep() {
    return await this.patch(PROFILE_COMPLETION, {}, {});
  }

  public async searchUsers(keySearch: string) {
    return await this.get(
      `${SEARCH_USERS}/${keySearch}`,
      {},
      { cached: { timeout: 10000 } }
    );
  }

  public async getProfile() {
    return await this.get(USER_PROFILE, {}, { cached: { timeout: 3000 } });
  }

  public async forgotPassword({ email }: { email: string }) {
    return await this.post(FORGOT_PASSWORD, {}, { email });
  }

  public async resetPassword({
    otpToken,
    uid,
    newPassword,
  }: {
    otpToken: string;
    uid: string;
    newPassword: string;
  }) {
    return await this.patch(
      RESET_PASSWORD,
      {},
      {
        otp: otpToken,
        id: uid,
        password: newPassword,
      }
    );
  }

  public async addInterests(payload: string[]) {
    console.log(payload);
    return await this.post(USER_INTERESTS, {}, { interests: payload });
  }

  public async removeInterest(payload: string) {
    return await this.delete(USER_INTERESTS, {}, { interest: payload });
  }
}

export default UserService;
