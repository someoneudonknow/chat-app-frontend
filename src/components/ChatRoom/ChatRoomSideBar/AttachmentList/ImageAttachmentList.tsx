import React, { useCallback, useRef } from "react";
import QueryStrBuilder from "../../../../utils/QueryStrBuilder";
import { MessagesService } from "../../../../services";
import { BASE_URL } from "../../../../constants/api-endpoints";
import { useChatRoom } from "../../context/ChatRoomProvider";
import { ImageMessage, MessageType } from "../../../../models/message.model";
import { InfiniteScroll } from "../../../InfiniteScroll";
import { useChatRoomAttachments } from "../../context/ChatRoomAttachmentsProvider";
import { Box } from "@mui/material";
import { Visibility } from "@mui/icons-material";

const messageService = new MessagesService(BASE_URL);

const ImageAttachmentList: React.FC = () => {
  const { conservation } = useChatRoom();
  const { attachments, setImages, openImagesGallery } =
    useChatRoomAttachments();
  const gridGap = 5;
  const gridCols = 3;

  const getNext = useCallback(async () => {
    if (!conservation?._id) return;

    try {
      const images = attachments["IMAGES"].list;
      const imagesLength = images.length;
      let lastMess = null,
        queryStr = null,
        imageAttachmentsResponse = null;

      if (imagesLength > 0) {
        lastMess = images[imagesLength - 1];
      }

      if (lastMess) {
        queryStr = new QueryStrBuilder()
          .addParam("createdAt", "<=", lastMess.createdAt)
          .addParam("_id", "<", lastMess._id)
          .build();
      }

      if (queryStr) {
        imageAttachmentsResponse = await messageService.getAttachments({
          conservationId: conservation._id,
          type: MessageType.IMAGE,
          queryStr,
        });
      } else {
        imageAttachmentsResponse = await messageService.getAttachments({
          conservationId: conservation._id,
          type: MessageType.IMAGE,
        });
      }

      const imagesAttachments = imageAttachmentsResponse.metadata.list;
      const hasMoreResponse = imageAttachmentsResponse.metadata.hasNext;

      setImages((prev) => ({
        ...prev,
        list: [...prev.list, ...imagesAttachments],
        hasMore: hasMoreResponse,
      }));
    } catch (e: any) {
      setImages((prev) => ({
        ...prev,
        hasMore: false,
      }));
    }
  }, [conservation, attachments, setImages]);

  const handleImageAttachmentClicked = (id: ImageMessage["_id"]) => {
    openImagesGallery(id);
  };

  return (
    <InfiniteScroll
      style={{
        width: "100%",
        flexDirection: "row",
        flexWrap: "wrap",
        alignContent: "flex-start",
        justifyContent: "flex-start",
        padding: `${gridGap}px`,
        gap: `${gridGap}px`,
        transition: "none",
      }}
      data={attachments["IMAGES"].list}
      fetchNext={getNext}
      loadingEl={<p>Loading...</p>}
      hasMore={attachments["IMAGES"].hasMore}
      render={(imageMessage: ImageMessage) => {
        return (
          <Box
            key={imageMessage._id}
            sx={{
              backgroundImage: `url(${imageMessage.content.originalImage.url})`,
              width: `calc(${100 / gridCols}% - ${gridGap}px)`,
              aspectRatio: 1 / 1,
              borderRadius: "5px",
              backgroundPosition: "center",
              backgroundSize: "cover",
              position: "relative",
              "&:hover > *": {
                display: "block",
              },
            }}
          >
            <Box
              onClick={() => handleImageAttachmentClicked(imageMessage._id)}
              component="div"
              sx={{
                cursor: "pointer",
                position: "absolute",
                display: "none",
                inset: 0,
                zIndex: 1000,
                boxShadow: "0 3px 5px rgba(0, 0, 0, 0.3)",
                backgroundColor: "black",
                opacity: 0.5,
              }}
            />

            <Visibility
              sx={{
                position: "absolute",
                display: "none",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            />
          </Box>
        );
      }}
      debounceTimeout={500}
    />
  );
};

export default ImageAttachmentList;
