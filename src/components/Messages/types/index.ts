import { SxProps } from "@mui/material";
import {
  FileMessage,
  AudioMessage,
  VideoMessage,
  ImageMessage,
  GifMessage,
  MessageType,
  Sender,
} from "../../../models/message.model";

export type MessageItemBaseProps = {
  sx?: SxProps;
  sender: Sender;
  align?: "left" | "right";
  showUserName?: boolean;
  showMenu: boolean;
  sendAt: Date;
};

export type TextMessagePropsType = {
  text: string;
} & MessageItemBaseProps;

export type GifMessagePropsType = {
  gif: GifMessage["content"];
} & MessageItemBaseProps;

export type AudioMessagePropsType = {
  audioInfo: AudioMessage["content"];
} & MessageItemBaseProps;

export type ImageMessagePropsType = {
  image: ImageMessage["content"];
} & MessageItemBaseProps;

export type FileMessagePropsType = {
  file: FileMessage["content"];
} & MessageItemBaseProps;

export type VideoMessagePropsType = {
  video: VideoMessage["content"];
} & MessageItemBaseProps;

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
