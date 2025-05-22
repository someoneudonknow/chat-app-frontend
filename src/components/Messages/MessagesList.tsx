import { Box, Typography, useTheme } from "@mui/material";
import { forwardRef, useMemo } from "react";
import { MessageSender, MessagesUnion } from "../../models/message.model";
import InfiniteScroll, {
  InfiniteScrollProps,
  InfiniteScrollRef,
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

type MessagesListPropsType = {
  data: MessagesUnion[];
} & Omit<InfiniteScrollProps<string>, "render" | "data" | "ref" | "style">;

const MessagesList = forwardRef<InfiniteScrollRef, MessagesListPropsType>(
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
            sender: MessageSender | string;
            messages: MessagesUnion[];
            isBot?: boolean;
          }[] = [];

          // Initialize with the first message
          groupedResult.push({
            sender: messages[0].sender,
            messages: [messages[0]],
            isBot: messages[0].isBot,
          });

          for (let i = 1; i < messages.length; i++) {
            const currentMessage = messages[i];
            const lastGroup = groupedResult[groupedResult.length - 1];

            let isSameSender = false;

            if (
              typeof currentMessage.sender === "string" &&
              typeof lastGroup.sender === "string"
            ) {
              isSameSender = currentMessage.sender === lastGroup.sender;
            } else if (
              typeof currentMessage.sender !== "string" &&
              typeof lastGroup.sender !== "string"
            ) {
              isSameSender =
                (currentMessage.sender as MessageSender)._id ===
                (lastGroup.sender as MessageSender)._id;
            }

            const isSameBotStatus = currentMessage.isBot === lastGroup.isBot;

            if (isSameSender && isSameBotStatus) {
              lastGroup.messages.push(currentMessage);
            } else {
              groupedResult.push({
                sender: currentMessage.sender,
                messages: [currentMessage],
                isBot: currentMessage.isBot,
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
              {groupedResult.map((g, index) => {
                const isAIMessage = g?.isBot || g?.sender === "ai";

                const isSender =
                  !isAIMessage &&
                  typeof g?.sender !== "string" &&
                  currentUserId === g?.sender._id;

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

                const messageBackground = isAIMessage
                  ? theme.palette.info[theme.palette.mode]
                  : isSender
                  ? theme.palette.primary[theme.palette.mode]
                  : theme.palette.secondary[theme.palette.mode];

                return (
                  <MessageItemGroup
                    key={index}
                    sx={{
                      bgcolor: messageBackground,
                      color: "white",
                      ...messageBorderRadius,
                    }}
                    showAvatar={!isSender || isAIMessage}
                    showUserName={!isSender || isAIMessage}
                    align={align}
                    sender={g.sender}
                    messages={g.messages}
                    isBot={g.isBot}
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
