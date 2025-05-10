"use strict";

import { AI_CHAT } from "../constants/api-endpoints";
import BaseService from "./BaseService";

class AuthService extends BaseService {
  constructor(baseUrl: string) {
    super(baseUrl);
  }

  async chat({ prompt }: { prompt: string }): Promise<any> {
    return await this.get(`${AI_CHAT}?prompt=${prompt}`);
  }
}

export default AuthService;
