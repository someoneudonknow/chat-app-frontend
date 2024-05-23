import {
  CONTACT_REQUEST,
  CONTACT_REQUEST_RECEIVED,
  CONTACT_REQUEST_SENT,
} from "../constants/api-endpoints";
import BaseService from "./BaseService";

class ContactService extends BaseService {
  constructor(baseUrl: string) {
    super(baseUrl);
  }

  public async addContact({
    receiver,
    requestMessage,
  }: {
    receiver: string;
    requestMessage?: string;
  }) {
    return await this.post(
      `${CONTACT_REQUEST}/${receiver}`,
      {},
      {
        requestMessage,
      }
    );
  }

  public async getReceivedContactRequests() {
    return await this.get(
      CONTACT_REQUEST_RECEIVED,
      {},
      {
        cached: {
          timeout: 3000,
        },
      }
    );
  }

  public async getSentContactRequests() {
    return await this.get(
      CONTACT_REQUEST_SENT,
      {},
      {
        cached: {
          timeout: 3000,
        },
      }
    );
  }

  public async cancelContactRequest(id: string) {
    return await this.delete(`${CONTACT_REQUEST}/${id}`, {}, {});
  }

  public async rejectContactRequest(id: string) {
    return await this.post(`${CONTACT_REQUEST}/${id}/reject`, {}, {});
  }

  public async acceptContactRequest(id: string) {
    return await this.post(`${CONTACT_REQUEST}/${id}/accept`, {}, {});
  }

  public async updateContactRequest({
    id,
    message,
  }: {
    id: string;
    message: string;
  }) {
    return await this.patch(
      `${CONTACT_REQUEST}/${id}`,
      {},
      { requestMessage: message }
    );
  }
}

export default ContactService;
