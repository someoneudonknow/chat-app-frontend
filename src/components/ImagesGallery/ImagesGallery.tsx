import React, { useEffect, useRef, useState } from "react";
import PortalWrapper from "../PortalWrapper";
import { Box, IconButton, Stack, Typography } from "@mui/material";
import {
  Close,
  Download,
  NavigateBefore,
  NavigateNext,
} from "@mui/icons-material";
import ImagesList from "./ImagesList";
import { downloadFile } from "../../utils";
import { v4 as uuid } from "uuid";
import { ImageMessage } from "../../models/message.model";

type ImagesGalleryPropsType = {
  index?: number;
  images: ImageMessage["content"][];
  onClose: () => void;
  open: boolean;
};

const ImagesGallery: React.FC<ImagesGalleryPropsType> = ({
  index = 0,
  images,
  onClose,
  open,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(index);
  const [errorImageIndexes, setErrorImageIndexes] = useState<number[]>([]);
  const iconSizes = `${30}px`;
  const imageListWrapperRef = useRef<HTMLDivElement>();
  const wrapperWidth =
    imageListWrapperRef.current?.offsetWidth ||
    imageListWrapperRef.current?.clientWidth ||
    500;
  const wrapperHeight =
    imageListWrapperRef.current?.offsetHeight ||
    imageListWrapperRef.current?.clientHeight ||
    500;

  useEffect(() => {
    setCurrentIndex(index);
  }, [index]);

  const handleImageClick = (index: number) => {
    setCurrentIndex(index);
  };

  const handleImageError = (index: number) => {
    setErrorImageIndexes((prev) => [...prev, index]);
  };

  const slideNext = () => {
    setCurrentIndex((prev) => {
      let nextIndex = prev + 1;

      if (nextIndex >= images.length) {
        nextIndex = 0;
      }

      return nextIndex;
    });
  };

  const slidePrev = () => {
    setCurrentIndex((prev) => {
      let prevIndex = prev - 1;

      if (prevIndex < 0) {
        prevIndex = images.length - 1;
      }

      return prevIndex;
    });
  };

  const handleDownloadCurrentImage = async () => {
    await downloadFile(images[currentIndex].originalImage.url, uuid());
  };

  return (
    <PortalWrapper>
      <Box
        sx={{
          display: open ? "block" : "none",
          height: "100vh",
          width: "100vw",
          position: "fixed",
          zIndex: 1000,
          inset: 0,
          bgcolor: (theme) => `${theme.palette.secondary.main}CC`,
        }}
      >
        <Stack
          sx={{
            position: "absolute",
            zIndex: 1001,
            left: 20,
            top: 15,
          }}
          spacing={2}
          direction="row"
        >
          <IconButton
            onClick={handleDownloadCurrentImage}
            sx={{
              border: "1px solid white",
            }}
          >
            <Download />
          </IconButton>
        </Stack>
        <IconButton
          onClick={onClose}
          sx={{
            border: "1px solid white",
            position: "absolute",
            zIndex: 1001,
            right: 20,
            top: 15,
          }}
        >
          <Close />
        </IconButton>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            height: "100%",
            pt: 5,
          }}
        >
          <Box
            component="div"
            ref={imageListWrapperRef}
            sx={{
              flex: 1,
              position: "relative",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            }}
          >
            {images && images.length > 0 && (
              <div
                key={images[currentIndex].publicId}
                style={{
                  height: `${Math.min(
                    wrapperHeight,
                    images[currentIndex].originalImage.height
                  )}px`,
                  width: `${Math.min(
                    wrapperWidth,
                    images[currentIndex].originalImage.width
                  )}px`,
                  background: `url(${images[currentIndex]?.originalImage.url}) no-repeat center / contain`,
                }}
              >
                {errorImageIndexes.includes(currentIndex) && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      backgroundColor: "#cccccc",
                      width: "70%",
                      height: "100%",
                      display: "grid",
                      placeItems: "center",
                    }}
                  >
                    <Typography key={index} variant="h5" color="white">
                      Image no longer available
                    </Typography>
                  </Box>
                )}
              </div>
            )}
            <IconButton
              onClick={slideNext}
              sx={{
                border: "1px solid white",
                position: "absolute",
                top: "50%",
                right: "10px",
                transform: "translateY(-50%)",
              }}
            >
              <NavigateNext sx={{ height: iconSizes, width: iconSizes }} />
            </IconButton>
            <IconButton
              onClick={slidePrev}
              sx={{
                border: "1px solid white",
                position: "absolute",
                top: "50%",
                left: "10px",
                transform: "translateY(-50%)",
              }}
            >
              <NavigateBefore sx={{ height: iconSizes, width: iconSizes }} />
            </IconButton>
          </Box>
          <ImagesList
            index={currentIndex}
            images={images.map((i) => i.originalImage.url)}
            onImageClick={handleImageClick}
            onImageError={handleImageError}
          />
        </Box>
      </Box>
    </PortalWrapper>
  );
};

export default ImagesGallery;
