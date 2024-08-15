import React, {
  LegacyRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Conservation } from "../../models/conservation.model";
import { Box, CircularProgress, Paper, Typography } from "@mui/material";
import { MessagesList } from "../Messages";
import ChatRoomSideBar from "./ChatRoomSideBar";
import ChatRoomHeader from "./ChatRoomHeader";
import ChatBar from "./ChatBars/ChatBar";
import { IGif } from "@giphy/js-types";
import { useChatRoom } from "./context/ChatRoomContextProvider";
import AudioChatBar from "./ChatBars/AudioChatBar/AudioChatBar";
import { MessagesService, UploadService } from "../../services";
import { BASE_URL } from "../../constants/api-endpoints";
import { MessageType } from "../../models/message.model";
import { RecognizableFile } from "../../constants/types";
import { toast } from "react-toastify";
import { SubmitedMessageType } from "./types";
import { InfiniteScrollRef } from "../InfiniteScroll/InfiniteScroll";
import MessageLoader from "../UIs/MessageLoader";
import UserIsTypingAnimation from "../UIs/UserIsTypingAnimation";
import User from "../../models/user.model";

type ChatRoomPropsType = {
  conservation: Conservation;
};

const ChatRoom: React.FC<ChatRoomPropsType> = ({ conservation }) => {
  const [showSideBar, setShowSidebar] = useState<boolean>(true);
  const chatRoomCtx = useChatRoom();
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [nextCursor, setNextCursor] = useState<string | null>();
  const messageListRef = useRef<InfiniteScrollRef>(null);

  useEffect(() => {
    chatRoomCtx.setConservation(conservation);
  }, [conservation, chatRoomCtx]);

  const toggleShowSideBar = () => {
    setShowSidebar((prev) => !prev);
  };

  const handleSendMessage = useCallback(
    async (data: SubmitedMessageType) => {
      const messageService = new MessagesService(BASE_URL);
      chatRoomCtx.setLoading(true);

      try {
        switch (data.type) {
          case MessageType.TEXT:
            await messageService.sendTextMessage(
              conservation._id,
              data.content as string
            );

            break;
          case MessageType.GIF: {
            await messageService.sendGifMessage(
              conservation._id,
              data.content as IGif
            );
            break;
          }
          case MessageType.AUDIO: {
            const uploadService = new UploadService(BASE_URL);
            const uploadedAudio = await uploadService.uploadOneWithFileData(
              data.content as Blob
            );

            await messageService.sendAudioMessage(
              conservation._id,
              data.content as Blob,
              uploadedAudio.metadata.content
            );
            break;
          }
          case MessageType.FILE: {
            const selectedFiles = data.content as (RecognizableFile & {
              upload: any;
            })[];

            if (selectedFiles && selectedFiles.length > 0) {
              await Promise.all(
                selectedFiles.map(async (file) => {
                  const uploaded = file.upload.content;

                  if (file.type.startsWith("image")) {
                    await messageService.sendImageMessage(
                      file,
                      uploaded,
                      conservation._id
                    );
                  } else if (file.type.startsWith("video")) {
                    await messageService.sendVideoMessage(
                      file,
                      uploaded,
                      conservation._id
                    );
                  } else if (file.type.startsWith("audio")) {
                    await messageService.sendAudioMessage(
                      conservation._id,
                      file,
                      uploaded
                    );
                  } else {
                    await messageService.sendFileMessage(
                      file,
                      uploaded,
                      conservation._id
                    );
                  }
                })
              );
            }
            break;
          }
          default:
            return;
        }
        messageListRef.current?.scrollToBottom();
      } catch (err: any) {
        toast.error(err.message);
      }
      chatRoomCtx.setLoading(false);
    },
    [chatRoomCtx, conservation._id]
  );

  const fetchNextMessages = useCallback(async () => {
    if (!chatRoomCtx.conservation) {
      setHasMore(false);
      return;
    }

    try {
      const messageService = new MessagesService(BASE_URL);
      let messagesResponse;

      if (nextCursor) {
        messagesResponse = await messageService.getMessagesInConservation(
          chatRoomCtx.conservation?._id,
          20,
          { nextCursor: nextCursor }
        );
      } else {
        messagesResponse = await messageService.getMessagesInConservation(
          chatRoomCtx.conservation?._id,
          20
        );
      }
      const hasNext = messagesResponse.metadata?.hasNext;

      chatRoomCtx.setMessagesList([
        ...chatRoomCtx.messagesList,
        ...(messagesResponse?.metadata?.list || []),
      ]);
      setHasMore(hasNext);
      if (hasNext) {
        setNextCursor(messagesResponse.metadata?.next);
      }
    } catch (err) {
      console.error(err);
      setHasMore(false);
    }
  }, [chatRoomCtx, nextCursor]);

  const getTypingStateText = (): string => {
    const typingMembers = chatRoomCtx.typingMembers;

    if (typingMembers.length > 0) {
      const firstMember = chatRoomCtx.conservation?.members.find(
        (m) => m.user._id === typingMembers[0]
      );
      const firstMemberName =
        firstMember?.nickname ??
        firstMember?.user.userName ??
        firstMember?.user.email;

      if (typingMembers.length > 1) {
        return `${firstMemberName} and ${
          typingMembers.length - 1
        } others is tying`;
      } else {
        return `${firstMemberName} is tying`;
      }
    }

    return "";
  };

  return (
    <Paper sx={{ flex: 1, display: "flex" }}>
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
              data={chatRoomCtx.messagesList}
              fetchNext={fetchNextMessages}
              hasMore={hasMore}
            />
            {chatRoomCtx.loading && <MessageLoader />}
            {chatRoomCtx.typingMembers.length > 0 && (
              <Box
                component="div"
                sx={{ display: "flex", justifyContent: "flex-end", px: 2 }}
              >
                <UserIsTypingAnimation text={getTypingStateText()} />
              </Box>
            )}
            <ChatBar
              shouldShow={chatRoomCtx.chatBarType === "regular"}
              onSubmit={handleSendMessage}
            />
            {chatRoomCtx.chatBarType === "audio" && (
              <AudioChatBar
                sendDisable={chatRoomCtx.loading}
                onSubmit={handleSendMessage}
              />
            )}
          </>
        )}
      </Box>
      {conservation && (
        <ChatRoomSideBar conservation={conservation} show={showSideBar} />
      )}
    </Paper>
  );
};

export default ChatRoom;
