import { Box } from "@mui/material";
import React from "react";
import Image from "../UIs/Image";

type ImagesListPropsType = {
  images: string[];
  onImageClick?: (index: number) => void;
  onImageError?: (index: number) => void;
  index?: number;
};

const ImagesList: React.FC<ImagesListPropsType> = ({
  images,
  onImageClick,
  onImageError,
  index = 0,
}) => {
  return (
    <Box
      component="div"
      sx={{
        display: "flex",
        flexWrap: "nowrap",
        overflowX: "auto",
        width: "100%",
        height: 100,
        mt: 1,
        p: 1,
        alignItems: "center",
        gap: "10px",
        "&::-webkit-scrollbar": {
          height: "thin",
        },
        "&::-webkit-scrollbar-thumb": {
          background: "white",
        },
      }}
    >
      {images.map((img, i) => {
        return (
          <Image
            key={i}
            onClick={() => onImageClick && onImageClick(i)}
            onImageError={() => onImageError && onImageError(i)}
            src={img || "broken"}
            sx={{
              height: "100%",
              flex: "0 0 auto",
              boxShadow: 5,
              aspectRatio: 1 / 1,
              borderRadius: 2,
              cursor: "pointer",
              border: index === i ? "3px solid white" : "3px solid transparent",
              position: "relative",
              overflow: "hidden",
              transition: "all ease .2s",
            }}
            imgStyle={{ width: "100%" }}
          />
        );
      })}
    </Box>
  );
};

export default ImagesList;
