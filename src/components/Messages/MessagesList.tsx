import { Box, Theme, Typography, useTheme } from "@mui/material";
import React, { forwardRef, useEffect, useMemo, useRef } from "react";
import { MessageSender, MessagesUnion } from "../../models/message.model";
import InfiniteScroll, {
  InfiniteScrollProps,
} from "../InfiniteScroll/InfiniteScroll";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import {
  formatMessageDate,
  getWeekdayString,
  groupByTimeDuration,
} from "../../utils";
import moment from "moment";
import MessageItemGroup from "./MessageItemGroup";
import { v4 as uuid } from "uuid";

type MessagesListPropsType = {
  data: MessagesUnion[];
} & Omit<InfiniteScrollProps, "render">;

const MessagesList = forwardRef<HTMLDivElement, MessagesListPropsType>(
  ({ data, ...rest }, ref) => {
    const theme = useTheme();
    const currentUserId = useSelector(
      (state: RootState) => state.user.currentUser?._id
    );

    const groupedMessages = useMemo(() => {
      return groupByTimeDuration<MessagesUnion>(
        data,
        "createdAt",
        3,
        (date) => {
          const sentDate = moment(date);

          if (sentDate.isSame(new Date(), "days")) {
            return `${formatMessageDate(date)}`;
          }

          return `${getWeekdayString(sentDate.weekday())}, ${sentDate.format(
            "DD/MM/YYYY"
          )} at ${formatMessageDate(date)}`;
        }
      );
    }, [data]);

    return (
      <InfiniteScroll
        {...rest}
        ref={ref}
        style={{ padding: "0px 15px 10px 15px" }}
        reversed
        data={Object.keys(groupedMessages)}
        render={(sentDate: string) => {
          if (!currentUserId) return null;
          const messages = [...groupedMessages[sentDate]];

          messages.reverse();

          const groupedResult: {
            sender: MessageSender;
            messages: MessagesUnion[];
          }[] = [];

          groupedResult.push({
            sender: messages[0].sender as MessageSender,
            messages: [messages[0]],
          });

          for (let i = 1; i < messages.length; i++) {
            const currentSenderId = (messages[i]?.sender as MessageSender)?._id;

            if (
              currentSenderId ===
              groupedResult[groupedResult.length - 1].sender._id
            ) {
              groupedResult[groupedResult.length - 1].messages.push(
                messages[i]
              );
            } else {
              groupedResult.push({
                sender: messages[i].sender as MessageSender,
                messages: [messages[i]],
              });
            }
          }

          return (
            <Box key={sentDate} sx={{ width: "100%" }}>
              <Typography
                variant="body2"
                sx={{ textAlign: "center", fontSize: "13px", my: 3 }}
              >
                {sentDate}
              </Typography>
              {groupedResult.map((g) => {
                const isSender = currentUserId === g.sender._id;
                const align = isSender ? "right" : "left";
                const borderRadiusEnd = "20px";
                const borderRadiusStart = "5px";
                const messageBorderRadius = isSender
                  ? {
                      borderTopLeftRadius: borderRadiusEnd,
                      borderBottomLeftRadius: borderRadiusEnd,
                      borderTopRightRadius: borderRadiusStart,
                      borderBottomRightRadius: borderRadiusStart,
                    }
                  : {
                      borderTopRightRadius: borderRadiusEnd,
                      borderBottomRightRadius: borderRadiusEnd,
                      borderTopLeftRadius: borderRadiusStart,
                      borderBottomLeftRadius: borderRadiusStart,
                    };

                return (
                  <MessageItemGroup
                    sx={{
                      bgcolor: isSender
                        ? theme.palette.primary[theme.palette.mode]
                        : theme.palette.secondary[theme.palette.mode],
                      color: "white",
                      ...messageBorderRadius,
                    }}
                    showAvatar={!isSender}
                    showUserName={!isSender}
                    align={align}
                    sender={g.sender}
                    messages={g.messages}
                  />
                );
              })}
            </Box>
          );
        }}
      />
    );
  }
);

export default MessagesList;
