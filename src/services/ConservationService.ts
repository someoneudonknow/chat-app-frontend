import { CONSERVATION, JOINED_CONSERVATION } from "../constants/api-endpoints";
import BaseService from "./BaseService";

class ConservationService extends BaseService {
  constructor(baseUrl: string) {
    super(baseUrl);
  }

  public async getConservation(id: string) {
    return await this.get(`${CONSERVATION}/${id}`);
  }

  public async getJoinedConservations({
    page,
    limit,
  }: {
    page: number;
    limit: number;
  }) {
    return this.get(
      `${JOINED_CONSERVATION}?page=${page}&limit=${limit}`,
      {},
      {
        cached: {
          timeout: 1000,
        },
      }
    );
  }
}

export default ConservationService;
