import React, { useCallback, useEffect, useState } from "react";
import { Conservation } from "../../models/conservation.model";
import { Box, CircularProgress, Paper } from "@mui/material";
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

type ChatRoomPropsType = {
  conservation: Conservation;
};

const ChatRoom: React.FC<ChatRoomPropsType> = ({ conservation }) => {
  const [showSideBar, setShowSidebar] = useState<boolean>(true);
  const chatRoomCtx = useChatRoom();
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [nextCursor, setNextCursor] = useState<string | null>();

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
            try {
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
            } catch (err: any) {
              toast.error(err.message);
            }
          }
          break;
        }
        default:
          return;
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
              data={chatRoomCtx.messagesList}
              fetchNext={fetchNextMessages}
              hasMore={hasMore}
            />
            {chatRoomCtx.loading && (
              <Box
                component="div"
                sx={{
                  p: 1,
                  width: "100px",
                  alignSelf: "flex-end",
                  textAlign: "center",
                  mr: 2,
                  borderRadius: 5,
                  backgroundColor: "background.paper",
                }}
              >
                <CircularProgress size={15} />
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
