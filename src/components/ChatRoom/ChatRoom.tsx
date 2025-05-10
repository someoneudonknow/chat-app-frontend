import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Conservation,
  ConservationMember,
} from "../../models/conservation.model";
import { Box, Paper, Typography } from "@mui/material";
import { MessagesList } from "../Messages";
import ChatRoomHeader from "./ChatRoomHeader";
import ChatBar from "./ChatBars/ChatBar";
import { useChatRoom } from "./context/ChatRoomProvider";
import AudioChatBar from "./ChatBars/AudioChatBar/AudioChatBar";
import { toast } from "react-toastify";
import { SubmitedMessageType } from "./types";
import { InfiniteScrollRef } from "../InfiniteScroll/InfiniteScroll";
import MessageLoader from "../UIs/MessageLoader";
import UserIsTypingAnimation from "../UIs/UserIsTypingAnimation";
import { getTypingStateText, sendMessage } from "./utils";
import { ChatRoomSideBar } from "./ChatRoomSideBar";
import AskAssistantButton from "./AskAssistantButton";
import { MessageType } from "../../models/message.model";
import AITypingIndicator from "./AITypingIndicator";

type ChatRoomPropsType = {
  conservation: Conservation;
};

const ChatRoom: React.FC<ChatRoomPropsType> = ({ conservation }) => {
  const [showSideBar, setShowSidebar] = useState<boolean>(true);
  const {
    setConservation,
    setLoading,
    messagesList,
    fetchNextMessages,
    hasMoreMessages,
    loading,
    typingMembers,
    aiIsTyping,
    conservation: currentConservation,
    chatBarType,
  } = useChatRoom();
  const messageListRef = useRef<InfiniteScrollRef>(null);

  useEffect(() => {
    setConservation(conservation);
  }, [conservation, setConservation]);

  const toggleShowSideBar = () => {
    setShowSidebar((prev) => !prev);
  };

  const handleSendMessage = useCallback(
    async (data: SubmitedMessageType) => {
      setLoading(true);

      try {
        await sendMessage(data, conservation._id);
        messageListRef.current?.scrollToBottom();
      } catch (err: any) {
        toast.error(err.message);
      }

      setLoading(false);
    },
    [setLoading, conservation._id]
  );

  const handleAskAssistant = useCallback(
    async (question: string) => {
      setLoading(true);

      try {
        const assistantQuestion = `@assistant ${question}`;
        await sendMessage(
          {
            type: MessageType.TEXT,
            content: assistantQuestion,
          },
          conservation._id
        );
        messageListRef.current?.scrollToBottom();
      } catch (err: any) {
        toast.error(err.message);
      }

      setLoading(false);
    },
    [setLoading, conservation._id]
  );

  return (
    <Paper sx={{ flex: 1, display: "flex", position: "relative" }}>
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        {conservation && (
          <>
            <ChatRoomHeader
              conservation={conservation}
              onShowSideBarClick={toggleShowSideBar}
            />
            <MessagesList
              ref={messageListRef}
              data={messagesList}
              fetchNext={fetchNextMessages}
              hasMore={hasMoreMessages}
            />
            {loading && <MessageLoader />}
            {aiIsTyping && <AITypingIndicator />}
            {typingMembers.length > 0 && (
              <Box
                component="div"
                sx={{ display: "flex", justifyContent: "flex-end", px: 2 }}
              >
                {currentConservation && (
                  <UserIsTypingAnimation
                    text={getTypingStateText(
                      typingMembers,
                      currentConservation.members as ConservationMember[]
                    )}
                  />
                )}
              </Box>
            )}
            <ChatBar
              shouldShow={chatBarType === "regular"}
              onSubmit={handleSendMessage}
            />
            {chatBarType === "audio" && (
              <AudioChatBar
                sendDisable={loading}
                onSubmit={handleSendMessage}
              />
            )}
            <AskAssistantButton onAskAssistant={handleAskAssistant} />
          </>
        )}
      </Box>
      <ChatRoomSideBar show={showSideBar} />
    </Paper>
  );
};

export default ChatRoom;
