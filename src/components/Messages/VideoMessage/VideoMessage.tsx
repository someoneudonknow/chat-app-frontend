import React from "react";
import { VideoMessagePropsType } from "../types";
import { Box } from "@mui/material";

const VideoMessage: React.FC<VideoMessagePropsType> = ({ video, sx }) => {
  return (
    <Box
      sx={{
        ...sx,
        overflow: "hidden",
        bgcolor: "transparent",
        display: "flex",
      }}
    >
      <video
        controls
        src={video.originalVideo.url}
        style={{
          height: "200px",
          flex: 1,
          objectFit: "cover",
          objectPosition: "center",
        }}
      >
        Your browser doesn't support video
      </video>
    </Box>
  );
};

export default VideoMessage;
