import { CALL, END_CALL, JOIN_CALL } from "../constants/api-endpoints";
import { Call, CallMediaType, CallType } from "../models/call.model";
import BaseService from "./BaseService";

class CallService extends BaseService {
  constructor(baseUrl: string) {
    super(baseUrl);
  }

  initCall = async (payload: {
    conservationId: string;
    mediaType: CallMediaType;
  }) => {
    return await this.post(CALL, {}, payload);
  };

  joinCall = async ({ callId }: { callId: Call["_id"] }) => {
    return await this.post(`${JOIN_CALL}/${callId}`, {}, {});
  };

  endCall = async ({ callId }: { callId: Call["_id"] }) => {
    return await this.post(`${END_CALL}/${callId}`, {}, {});
  };
}

export default CallService;
