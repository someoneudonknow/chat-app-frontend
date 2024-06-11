import React, { ReactElement, useMemo } from "react";
import { MessageType } from "../../models/message.model";
import { MessageProps } from "./types";
import TextMessage from "./TextMessage";
import GifMessage from "./GifMessage";
import AudioMessage from "./AudioMessage";
import ImageMessage from "./ImageMessage";
import VideoMessage from "./VideoMessage";
import FileMessage from "./FileMessage/FileMessage";

type MessageItemPropsType = {
  props: MessageProps;
};

const MessageItem: React.FC<MessageItemPropsType> = ({ props }) => {
  const MessageComponent: ReactElement | null = useMemo(() => {
    switch (props.type) {
      case MessageType.TEXT:
        return <TextMessage {...props} />;
      case MessageType.GIF:
        return <GifMessage {...props} />;
      case MessageType.AUDIO:
        return <AudioMessage {...props} />;
      case MessageType.IMAGE:
        return <ImageMessage {...props} />;
      case MessageType.VIDEO:
        return <VideoMessage {...props} />;
      case MessageType.FILE:
        return <FileMessage {...props} />;
    }
  }, [props]);

  return MessageComponent;
};

export default MessageItem;
