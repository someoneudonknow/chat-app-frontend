import { INDUSTRY } from "../constants/api-endpoints";
import BaseService from "./BaseService";

class IndustryService extends BaseService {
  constructor(baseUrl: string) {
    super(baseUrl);
  }

  public async getListIndustrys() {
    return await this.get(
      INDUSTRY,
      {},
      {
        cached: {
          timeout: 1 * 1000 * 60 * 60,
        },
      }
    );
  }
}

export default IndustryService;
