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
  console.log({ index });
  console.log({ images });
  return (
    <Box
      component="div"
      sx={{
        height: 70,
        width: "100%",
        pt: 1,
        px: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
        overflowX: "scroll",
        scrollSnapType: "x mandatory",
        scrollBehavior: "smooth",
        "&::-webkit-scrollbar": {
          height: "0.4em",
        },
      }}
    >
      {images.map((img, i) => {
        return (
          <Image
            key={i}
            onClick={() => onImageClick && onImageClick(i)}
            onImageError={() => onImageError && onImageError(i)}
            src={img}
            sx={{
              height: "100%",
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
