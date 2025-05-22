import { Conservation } from "./conservation.model";
import User from "./user.model";

export type CallMediaType = "AUDIO_CALL" | "VIDEO_CALL";

export type CallStatus = "INIT" | "PENDING" | "ENDED";

export type CallType = "GROUP" | "ONE_TO_ONE";

export interface RecordingData {
  resourceId: string;
  sid: string;
  callId: string;
  channelName: string;
  uid: string;
  startedAt: number;
}

export interface RecordingFile {
  fileName: string;
  sliceStartTime: number;
  sliceEndTime: number;
  url: string;
}

export interface Call {
  _id: string;
  caller: User["_id"];
  mediaType: CallMediaType;
  type: CallType;
  attendances: User["_id"][];
  conservation: Conservation["_id"];
  beginAt: Date;
  endAt: Date;
  callEnder: User["_id"];
  status: CallStatus;
  isRecording: boolean;
  isRecordingPaused: boolean;
  recordingStopped: boolean;
  recordingData: RecordingData | null;
  recordingFiles: RecordingFile[];
}
