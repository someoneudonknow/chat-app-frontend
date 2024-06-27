import React, { useCallback, useMemo } from "react";
import MessageItemWrapper from "../MessageItemWrapper";
import {
  AudioMessage,
  FileMessage,
  GifMessage,
  ImageMessage,
  MessageSender,
  MessageType,
  MessagesUnion,
  TextMessage,
  VideoMessage,
} from "../../../models/message.model";
import MessageItem from "../MessageItem";
import { MessageProps } from "../types";
import { SxProps } from "@mui/material";

type MessageItemGroupPropsType = {
  messages: MessagesUnion[];
  sender: MessageSender;
  align: "left" | "right";
  sx?: SxProps;
  showUserName?: boolean;
  showAvatar?: boolean;
};

const MessageItemGroup: React.FC<MessageItemGroupPropsType> = ({
  messages,
  sender,
  align,
  sx,
  showUserName,
  showAvatar,
}) => {
  const getMessagesItemProps = useCallback(
    (data: MessagesUnion): MessageProps | null => {
      switch (data.type) {
        case MessageType.TEXT: {
          return {
            type: data.type as MessageType.TEXT,
            text: (data as TextMessage).content.text,
          };
        }
        case MessageType.GIF: {
          return {
            type: data.type as MessageType.GIF,
            gif: (data as GifMessage).content,
          };
        }
        case MessageType.AUDIO: {
          return {
            type: data.type as MessageType.AUDIO,
            audioInfo: (data as AudioMessage).content,
          };
        }
        case MessageType.IMAGE: {
          return {
            type: data.type as MessageType.IMAGE,
            image: (data as ImageMessage).content,
          };
        }
        case MessageType.FILE: {
          return {
            type: data.type as MessageType.FILE,
            file: (data as FileMessage).content,
          };
        }
        case MessageType.VIDEO: {
          return {
            type: data.type as MessageType.VIDEO,
            video: (data as VideoMessage).content,
          };
        }
        default:
          return null;
      }
    },
    []
  );

  return (
    <MessageItemWrapper
      showUserName={showUserName}
      sx={{
        pl: 0.5,
      }}
      showAvatar={showAvatar}
      align={align}
      sender={sender}
    >
      {messages.map((message, i) => {
        const messageOwnProps = getMessagesItemProps(message);
        let messageStyle = {};

        if (i === 0) {
          messageStyle = {
            borderTopRightRadius: "20px",
            borderTopLeftRadius: "20px",
          };
        }

        if (i === messages.length - 1) {
          messageStyle = {
            ...messageStyle,
            borderBottomRightRadius: "20px",
            borderBottomLeftRadius: "20px",
          };
        }

        return (
          messageOwnProps && (
            <MessageItem
              key={message._id}
              props={{
                ...messageOwnProps,
                originalMessage: message,
                sx: { ...sx, ...messageStyle },
              }}
            />
          )
        );
      })}
    </MessageItemWrapper>
  );
};

export default MessageItemGroup;
