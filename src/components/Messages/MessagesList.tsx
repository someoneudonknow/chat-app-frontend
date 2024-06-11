import { Box, Typography } from "@mui/material";
import React, { ReactElement, useCallback, useMemo } from "react";
import MessageItem from "./MessageItem";
import {
  AudioMessage,
  FileMessage,
  GifMessage,
  ImageMessage,
  MessageSender,
  MessageType,
  MessagesUnion,
  Sender,
  TextMessage,
  VideoMessage,
} from "../../models/message.model";
import InfiniteScroll, {
  InfiniteScrollProps,
} from "../InfiniteScroll/InfiniteScroll";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { MessageItemBaseProps, MessageProps } from "./types";
import { formatMessageDate, getWeekdayString, groupBy } from "../../utils";
import moment from "moment";

type MessagesListPropsType = {
  data: MessagesUnion[];
} & Omit<InfiniteScrollProps, "render">;

const MessagesList: React.FC<MessagesListPropsType> = ({ data, ...rest }) => {
  const currentUserId = useSelector(
    (state: RootState) => state.user.currentUser?._id
  );

  const groupedMessages = useMemo(() => {
    return groupBy<MessagesUnion>(data, (message) => {
      const sentDate = moment(message.createdAt);

      return `${getWeekdayString(sentDate.weekday())}, ${sentDate.format(
        "DD/MM/YYYY"
      )}`;
    });
  }, [data]);

  const isSender = useCallback(
    (sender: Sender) => (sender as MessageSender)?._id === currentUserId,
    [currentUserId]
  );

  const getMessagesItemProps = useCallback(
    (data: MessagesUnion) => {
      const messageBaseData: MessageItemBaseProps = {
        sendAt: data.createdAt,
        sender: data.sender,
        align: isSender(data.sender) ? "right" : "left",
        showMenu: isSender(data.sender),
      };

      let messageOwnProps: Partial<MessageProps & MessageItemBaseProps> = {
        ...messageBaseData,
      };

      switch (data.type) {
        case MessageType.TEXT: {
          messageOwnProps = {
            ...messageOwnProps,
            type: data.type as MessageType.TEXT,
            text: (data as TextMessage).content.text,
          };
          break;
        }
        case MessageType.GIF: {
          messageOwnProps = {
            ...messageOwnProps,
            type: data.type as MessageType.GIF,
            gif: (data as GifMessage).content,
          };
          break;
        }
        case MessageType.AUDIO: {
          messageOwnProps = {
            ...messageOwnProps,
            type: data.type as MessageType.AUDIO,
            audioInfo: (data as AudioMessage).content,
          };
          break;
        }
        case MessageType.IMAGE: {
          messageOwnProps = {
            ...messageOwnProps,
            type: data.type as MessageType.IMAGE,
            image: (data as ImageMessage).content,
          };
          break;
        }
        case MessageType.FILE: {
          messageOwnProps = {
            ...messageOwnProps,
            type: data.type as MessageType.FILE,
            file: (data as FileMessage).content,
          };
          break;
        }
        case MessageType.VIDEO: {
          messageOwnProps = {
            ...messageOwnProps,
            type: data.type as MessageType.VIDEO,
            video: (data as VideoMessage).content,
          };
          break;
        }
        default:
          return;
      }

      return messageOwnProps;
    },
    [isSender]
  );

  return (
    <InfiniteScroll
      {...rest}
      reversed
      data={Object.keys(groupedMessages)}
      render={(sentDate: string) => {
        if (!currentUserId) return null;
        const messages = [...groupedMessages[sentDate]];

        messages.reverse();

        const groupedBySentTime = groupBy<MessagesUnion>(messages, (m) =>
          formatMessageDate(m.createdAt)
        );

        return (
          <Box key={sentDate} sx={{ width: "100%" }}>
            <Typography variant="body2" sx={{ textAlign: "center" }}>
              {sentDate}
            </Typography>
            {messages.map((data: MessagesUnion) => {
              const messageOwnProps = getMessagesItemProps(data);

              return (
                <Box
                  component="div"
                  key={data._id}
                  sx={{ width: "100%", py: 1, px: 1 }}
                >
                  {messageOwnProps && <MessageItem props={messageOwnProps} />}
                </Box>
              );
            })}
          </Box>
        );
      }}
    />
  );
};

export default MessagesList;
