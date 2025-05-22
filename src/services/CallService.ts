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

  getCallInfo = async (callId: string) => {
    return await this.get(`${CALL}/${callId}`);
  };

  startRecording = async ({
    callId,
    uid,
    channelName,
  }: {
    callId: string;
    uid: string;
    channelName: string;
  }) => {
    return await this.post(
      `${CALL}/record/start/${callId}`,
      {},
      { uid, channelName }
    );
  };

  pauseRecording = async (callId: string) => {
    return await this.post(`${CALL}/record/pause/${callId}`, {}, {});
  };

  resumeRecording = async (callId: string) => {
    return await this.post(`${CALL}/record/resume/${callId}`, {}, {});
  };

  stopRecording = async (callId: string) => {
    return await this.post(`${CALL}/record/stop/${callId}`, {}, {});
  };

  getCallSummary = async (
    callId: string,
    maxLength: number,
    language = "vi"
  ) => {
    return await this.post(
      `${CALL}/summary`,
      {},
      { callId, maxLength, language }
    );
  };
}

export default CallService;
