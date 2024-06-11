import { Conservation } from "./conservation.model";
import User from "./user.model";
import { IImages } from "@giphy/js-types";

export enum MessageType {
  GIF = "gif",
  IMAGE = "image",
  AUDIO = "audio",
  TEXT = "text",
  VIDEO = "video",
  FILE = "file",
}

export type MessageSender = Pick<
  User,
  "photo" | "_id" | "userName" | "email" | "country"
>;

export type Sender = MessageSender | string;

export interface Message {
  _id: string;
  sender: Sender;
  conservation: Conservation | string;
  type: MessageType;
  pinned: {
    isPinned: boolean;
    type?: "permanent" | "temporary";
    pinnedAt?: Date;
    expiredAt?: Date;
  };
  mentionedMembers?: (User | string)[];
  replyTo?: Message | string;
  createdAt: Date;
  isDeleted?: boolean;
}

export interface TextMessage extends Message {
  content: {
    text: string;
  };
}

export interface GifMessage extends Message {
  content: {
    type: "gif" | "sticker";
    altText: string;
    giphyId: string;
    rating: string;
    images: IImages;
  };
}

export interface FileMessage extends Message {
  content: {
    originalName: string;
    mimeType: string;
    downloadUrl: string;
    totalBytes: number;
    publicId: string;
    additionalContents: object;
  };
}

export interface ImageMessage extends Message {
  content: {
    totalBytes: number;
    publicId: string;
    originalName: string;
    originalImage: {
      width: number;
      height: number;
      url: string;
    };
    additionalContents: object;
  };
}

export interface AudioMessage extends Message {
  content: {
    url: string;
    totalBytes: number;
    publicId: string;
    duration: number;
    additionalContents: object;
  };
}

export interface VideoMessage extends Message {
  content: {
    totalBytes: number;
    publicId: string;
    originalVideo: {
      duration: number;
      url: string;
    };
    additionalContents: object;
  };
}

export type MessagesUnion =
  | VideoMessage
  | TextMessage
  | GifMessage
  | FileMessage
  | ImageMessage
  | AudioMessage;
