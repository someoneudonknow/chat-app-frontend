import React from "react";
import { ImageMessagePropsType } from "../types";
import MessageItemWrapper from "../MessageItemWrapper";

const ImageMessage: React.FC<ImageMessagePropsType> = ({ image, ...rest }) => {
  return (
    <MessageItemWrapper {...rest}>
      <img
        src={image.originalImage.url}
        style={{
          maxHeight: "150px",
          objectFit: "cover",
          objectPosition: "center",
        }}
      />
    </MessageItemWrapper>
  );
};

export default ImageMessage;
