import React, { Fragment, useCallback } from "react";
import { MessagesService } from "../../../../services";
import { BASE_URL } from "../../../../constants/api-endpoints";
import { useChatRoom } from "../../context/ChatRoomProvider";
import { useChatRoomAttachments } from "../../context/ChatRoomAttachmentsProvider";
import QueryStrBuilder from "../../../../utils/QueryStrBuilder";
import { FileMessage, MessageType } from "../../../../models/message.model";
import { InfiniteScroll } from "../../../InfiniteScroll";
import {
  Divider,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { FileOpen } from "@mui/icons-material";
import { downloadFile, formatFileSize } from "../../../../utils";
import { TextOverflowEllipsis } from "../../../Person/PersonItem";
import { v4 as uuid } from "uuid";

const messageService = new MessagesService(BASE_URL);

const FileAttachmentList: React.FC = () => {
  const { conservation } = useChatRoom();
  const { attachments, setFiles } = useChatRoomAttachments();

  const getNext = useCallback(async () => {
    if (!conservation?._id) return;

    try {
      const files = attachments["FILES"].list;
      const filesLength = files.length;
      let lastMess = null,
        queryStr = null,
        fileAttachmentsResponse = null;

      if (filesLength > 0) {
        lastMess = files[filesLength - 1];
      }

      if (lastMess) {
        queryStr = new QueryStrBuilder()
          .addParam("createdAt", "<=", lastMess.createdAt)
          .addParam("_id", "<", lastMess._id)
          .build();
      }

      if (queryStr) {
        fileAttachmentsResponse = await messageService.getAttachments({
          conservationId: conservation._id,
          type: MessageType.FILE,
          queryStr,
        });
      } else {
        fileAttachmentsResponse = await messageService.getAttachments({
          conservationId: conservation._id,
          type: MessageType.FILE,
        });
      }

      const filesAttachments = fileAttachmentsResponse.metadata.list;
      const hasMoreResponse = fileAttachmentsResponse.metadata.hasNext;

      setFiles((prev) => ({
        ...prev,
        list: [...prev.list, ...filesAttachments],
        hasMore: hasMoreResponse,
      }));
    } catch (e: any) {
      setFiles((prev) => ({
        ...prev,
        hasMore: false,
      }));
    }
  }, [conservation, attachments, setFiles]);

  const handleFileAttachmentClicked = async (url: string) => {
    await downloadFile(url, uuid());
  };

  return (
    <InfiniteScroll
      style={{
        width: "100%",
      }}
      noDataText={
        <p style={{ width: "100%", textAlign: "center" }}>No Files</p>
      }
      data={attachments["FILES"].list}
      fetchNext={getNext}
      loadingEl={<p style={{ width: "100%" }}>Loading...</p>}
      hasMore={attachments["FILES"].hasMore}
      render={(fileMessage, index) => {
        return (
          <Fragment key={fileMessage._id}>
            <ListItem sx={{ py: 0 }} key={fileMessage._id}>
              <ListItemButton
                onClick={() =>
                  handleFileAttachmentClicked(fileMessage.content.downloadUrl)
                }
              >
                <ListItemIcon>
                  <FileOpen />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <TextOverflowEllipsis>
                      {fileMessage.content.originalName}
                    </TextOverflowEllipsis>
                  }
                  secondary={formatFileSize(fileMessage.content.totalBytes)}
                />
              </ListItemButton>
            </ListItem>
            {!(index === attachments["FILES"].list.length - 1) && (
              <Divider variant="middle" flexItem />
            )}
          </Fragment>
        );
      }}
      debounceTimeout={500}
    />
  );
};

export default FileAttachmentList;
