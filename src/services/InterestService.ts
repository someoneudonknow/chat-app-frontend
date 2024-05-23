import { INTEREST, SEARCH_INTEREST } from "../constants/api-endpoints";
import BaseService from "./BaseService";

class InterestService extends BaseService {
  constructor(baseUrl: string) {
    super(baseUrl);
  }

  public async getListInterests() {
    return await this.get(
      INTEREST,
      {},
      {
        cached: {
          timeout: 1 * 1000 * 60 * 60,
        },
      }
    );
  }

  public async searchInterests(keyword: string) {
    return await this.get(
      `${SEARCH_INTEREST}/${keyword}`,
      {},
      {
        cached: {
          timeout: 10000,
        },
      }
    );
  }
}

export default InterestService;
