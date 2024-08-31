import { Box } from "@mui/material";
import React from "react";
import Image from "../UIs/Image";
import HorizontalScrollContainer from "../HorizontalScrollContainer";

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
    <HorizontalScrollContainer
      component="div"
      sx={{
        height: 100,
        mt: 1,
        p: 1,
        gap: "5px",
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
    </HorizontalScrollContainer>
  );
};

export default ImagesList;
