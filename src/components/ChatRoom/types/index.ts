import { MessageType } from "../../../models/message.model";
import { IGif } from "@giphy/js-types";
import { RecognizableFile } from "../../../constants/types";

export type SubmitedMessageType = {
  type: MessageType;
  content: string | IGif | File[] | Blob | RecognizableFile[];
};
