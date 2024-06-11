import React from "react";
import { GifMessagePropsType } from "../types";
import MessageItemWrapper from "../MessageItemWrapper";
import { Box } from "@mui/material";

const GifMessage: React.FC<GifMessagePropsType> = ({ gif, ...rest }) => {
  return (
    <MessageItemWrapper {...rest}>
      <Box
        sx={{
          height: gif.type === "sticker" ? "50px" : "170px",
          overflow: "hidden",
          borderRadius: 5,
        }}
      >
        <img
          style={{
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
          }}
          alt={gif.altText}
          src={gif.images.fixed_height.webp}
        />
      </Box>
    </MessageItemWrapper>
  );
};

export default GifMessage;
