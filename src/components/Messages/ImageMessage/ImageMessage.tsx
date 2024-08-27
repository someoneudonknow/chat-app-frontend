import React, { useState } from "react";
import { ImageMessagePropsType } from "../types";
import { Box } from "@mui/material";
import Image from "../../UIs/Image";
import { useChatRoom } from "../../ChatRoom/context/ChatRoomContextProvider";
import { useChatRoomAttachments } from "../../ChatRoom/context/ChatRoomAttachmentsProvider";

const ImageMessage: React.FC<ImageMessagePropsType> = ({
  image,
  sx,
  originalMessage,
}) => {
  const [hover, setHover] = useState<boolean>(false);
  const { openImagesGallery } = useChatRoomAttachments();

  const handleMessageClick = () => {
    openImagesGallery(originalMessage._id);
  };

  return (
    <Box
      component="div"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={handleMessageClick}
      sx={{
        ...sx,
        bgcolor: "transparent",
        display: "flex",
        overflow: "hidden",
        position: "relative",
        height: "150px",
      }}
    >
      <div
        style={{
          position: "absolute",
          zIndex: 10,
          inset: 0,
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          transition: "all linear .2s",
          cursor: "pointer",
          display: hover ? "block" : "none",
        }}
      ></div>
      <Image
        src={`${image.originalImage.url}`}
        sx={{ flex: 1, width: "100%" }}
      />
    </Box>
  );
};

export default ImageMessage;
