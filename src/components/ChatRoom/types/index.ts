import { MessageType } from "../../../models/message.model";
import { IGif } from "@giphy/js-types";
import { RecognizableFile } from "../../../constants/types";

export const AttachmentsSidebarTabNames = {
  IMAGES: "Images",
  VIDEOS: "Videos",
  FILES: "Files",
} as const;

export type SubmitedMessageType = {
  type: MessageType;
  content: string | IGif | File[] | Blob | RecognizableFile[];
};

export type AttachmentsSidebarTabNamesKey =
  keyof typeof AttachmentsSidebarTabNames;

export type AttachmentsSidebarTabNamesValues =
  (typeof AttachmentsSidebarTabNames)[AttachmentsSidebarTabNamesKey];
