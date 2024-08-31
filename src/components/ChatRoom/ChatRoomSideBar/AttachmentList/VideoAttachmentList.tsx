import React, { Fragment, useCallback } from "react";
import { useChatRoom } from "../../context/ChatRoomProvider";
import { useChatRoomAttachments } from "../../context/ChatRoomAttachmentsProvider";
import QueryStrBuilder from "../../../../utils/QueryStrBuilder";
import { MessagesService } from "../../../../services";
import { BASE_URL } from "../../../../constants/api-endpoints";
import { MessageType, VideoMessage } from "../../../../models/message.model";
import {
  downloadFile,
  formatFileSize,
  formatSeconds,
  formatSecondsToHHMMSS,
} from "../../../../utils";
import { v4 as uuid } from "uuid";
import { InfiniteScroll } from "../../../InfiniteScroll";
import {
  Divider,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { Download, Movie } from "@mui/icons-material";
import { TextOverflowEllipsis } from "../../../Person/PersonItem";

const messageService = new MessagesService(BASE_URL);

const VideoAttachmentList: React.FC = () => {
  const { conservation } = useChatRoom();
  const { attachments, setVideos } = useChatRoomAttachments();

  const getNext = useCallback(async () => {
    if (!conservation?._id) return;

    try {
      const Videos = attachments["VIDEOS"].list;
      const videosLength = Videos.length;
      let lastMess = null,
        queryStr = null,
        videoAttachmentsResponse = null;

      if (videosLength > 0) {
        lastMess = Videos[videosLength - 1];
      }

      if (lastMess) {
        queryStr = new QueryStrBuilder()
          .addParam("createdAt", "<=", lastMess.createdAt)
          .addParam("_id", "<", lastMess._id)
          .build();
      }

      if (queryStr) {
        videoAttachmentsResponse = await messageService.getAttachments({
          conservationId: conservation._id,
          type: MessageType.VIDEO,
          queryStr,
        });
      } else {
        videoAttachmentsResponse = await messageService.getAttachments({
          conservationId: conservation._id,
          type: MessageType.VIDEO,
        });
      }

      const VideosAttachments = videoAttachmentsResponse.metadata.list;
      const hasMoreResponse = videoAttachmentsResponse.metadata.hasNext;

      setVideos((prev) => ({
        ...prev,
        list: [...prev.list, ...VideosAttachments],
        hasMore: hasMoreResponse,
      }));
    } catch (e: any) {
      setVideos((prev) => ({
        ...prev,
        hasMore: false,
      }));
    }
  }, [conservation, attachments, setVideos]);

  const handleVideoAttachmentClicked = async (url: string) => {
    await downloadFile(url, uuid());
  };

  return (
    <InfiniteScroll
      style={{
        width: "100%",
      }}
      noDataText={
        <p style={{ width: "100%", textAlign: "center" }}>No Videos</p>
      }
      data={attachments["VIDEOS"].list}
      fetchNext={getNext}
      loadingEl={<p style={{ width: "100%" }}>Loading...</p>}
      hasMore={attachments["VIDEOS"].hasMore}
      render={(videoMessage: VideoMessage, index: number) => {
        return (
          <Fragment key={videoMessage._id}>
            <ListItem
              dense
              sx={{ py: 0 }}
              secondaryAction={
                <IconButton
                  onClick={() =>
                    handleVideoAttachmentClicked(
                      videoMessage.content.originalVideo.url
                    )
                  }
                  edge="end"
                  aria-label="delete"
                >
                  <Download />
                </IconButton>
              }
            >
              <ListItemIcon>
                <Movie />
              </ListItemIcon>
              <ListItemText
                primary={
                  <TextOverflowEllipsis>
                    {formatSeconds(videoMessage.content.originalVideo.duration)}
                  </TextOverflowEllipsis>
                }
                secondary={formatFileSize(videoMessage.content.totalBytes)}
              />
            </ListItem>
            {!(index === attachments["VIDEOS"].list.length - 1) && (
              <Divider variant="middle" flexItem />
            )}
          </Fragment>
        );
      }}
      debounceTimeout={500}
    />
  );
};

export default VideoAttachmentList;
