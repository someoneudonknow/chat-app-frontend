import { SxProps } from "@mui/material";
import {
  FileMessage,
  AudioMessage,
  VideoMessage,
  ImageMessage,
  GifMessage,
  MessageType,
  Sender,
  MessagesUnion,
} from "../../../models/message.model";

export type MessageItemBaseProps = {
  sx?: SxProps;
  sender: Sender;
  align?: "left" | "right";
  showUserName?: boolean;
  showAvatar?: boolean;
};

export type MessageBaseProps = {
  sx?: SxProps;
  originalMessage: MessagesUnion; //
};

export type TextMessagePropsType = {
  text: string;
} & MessageBaseProps;

export type GifMessagePropsType = {
  gif: GifMessage["content"];
} & MessageBaseProps;

export type AudioMessagePropsType = {
  audioInfo: AudioMessage["content"];
} & MessageBaseProps;

export type ImageMessagePropsType = {
  image: ImageMessage["content"];
} & MessageBaseProps;

export type FileMessagePropsType = {
  file: FileMessage["content"];
} & MessageBaseProps;

export type VideoMessagePropsType = {
  video: VideoMessage["content"];
} & MessageBaseProps;

export type MessageProps =
  | ({
      type: MessageType.TEXT;
    } & TextMessagePropsType)
  | ({
      type: MessageType.FILE;
    } & FileMessagePropsType)
  | ({
      type: MessageType.AUDIO;
    } & AudioMessagePropsType)
  | ({
      type: MessageType.VIDEO;
    } & VideoMessagePropsType)
  | ({
      type: MessageType.IMAGE;
    } & ImageMessagePropsType)
  | ({
      type: MessageType.GIF;
    } & GifMessagePropsType);
