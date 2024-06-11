import React from "react";
import { VideoMessagePropsType } from "../types";
import MessageItemWrapper from "../MessageItemWrapper";

const VideoMessage: React.FC<VideoMessagePropsType> = ({ video, ...rest }) => {
  return (
    <MessageItemWrapper {...rest}>
      <video
        controls
        src={video.originalVideo.url}
        style={{ maxHeight: "200px", borderRadius: "15px" }}
      >
        Your browser doesn't support video
      </video>
    </MessageItemWrapper>
  );
};

export default VideoMessage;
