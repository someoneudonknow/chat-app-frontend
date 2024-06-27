import React from "react";
import { GifMessagePropsType } from "../types";
import { Box } from "@mui/material";

const GifMessage: React.FC<GifMessagePropsType> = ({ gif, sx }) => {
  return (
    <Box
      sx={{
        height: gif.type === "sticker" ? "50px" : "170px",
        overflow: "hidden",
        ...sx,
        bgcolor: "transparent",
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
  );
};

export default GifMessage;
