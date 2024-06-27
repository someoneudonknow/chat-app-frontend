import React, { memo, useState } from "react";
import PortalWrapper from "../PortalWrapper";
import { Box, IconButton, Typography } from "@mui/material";
import { Close, NavigateBefore, NavigateNext } from "@mui/icons-material";
import { motion, useMotionValue } from "framer-motion";
import ImagesList from "./ImagesList";

type ImagesGalleryPropsType = {
  index?: number;
  images: string[];
  onClose: () => void;
  open: boolean;
};

const DRAG_BUFFER = 50;
const SPRING_OPTIONS = {
  type: "spring",
  mass: 3,
  stiffness: 400,
  damping: 50,
};

const ImagesGallery: React.FC<ImagesGalleryPropsType> = ({
  index = 0,
  images,
  onClose,
  open,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(index);
  const [errorImageIndexes, setImageIndexes] = useState<number[]>([]);
  const [dragging, setDragging] = useState<boolean>(false);
  const iconSizes = `${30}px`;
  const dragX = useMotionValue(0);
  // console.log({ images });
  const handleDragStart = () => {
    setDragging(true);
  };

  const handleDragEnd = () => {
    setDragging(false);
    const x = dragX.get();

    if (x < -DRAG_BUFFER) {
      slideNext();
    } else if (x >= DRAG_BUFFER) {
      slidePrev();
    }
  };

  const handleImageClick = (index: number) => {
    setCurrentIndex(index);
  };

  const handleImageError = (index: number) => {
    setImageIndexes((prev) => [...prev, index]);
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
          bgcolor: (theme) => `${theme.palette.secondary.main}59`,
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            zIndex: 1001,
            right: 20,
            top: 15,
            border: "1px solid white",
          }}
        >
          <Close />
        </IconButton>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            pt: 1,
          }}
        >
          <Box
            component="div"
            sx={{
              flex: 1,
              position: "relative",
              textAlign: "center",
            }}
          >
            <Box sx={{ height: "100%" }}>
              <motion.div
                style={{
                  display: "flex",
                  overflowX: "hidden",
                  height: "100%",
                  width: "100%",
                }}
              >
                {images.map((url, index) => {
                  return (
                    <motion.div
                      key={index}
                      onDragStart={handleDragStart}
                      onDragEnd={handleDragEnd}
                      drag="x"
                      dragConstraints={{ left: 0, right: 0 }}
                      animate={{ translateX: `-${currentIndex * 100}%` }}
                      transition={SPRING_OPTIONS}
                      style={{
                        x: dragX,
                        display: "inline-block",
                        height: "100%",
                        width: "100%",
                        flexShrink: 0,
                        backgroundImage: `url(${url})`,

                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                        backgroundSize: "contain",
                        cursor: dragging ? "grabbing" : "grab",
                      }}
                    >
                      {errorImageIndexes.includes(index) && (
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
                    </motion.div>
                  );
                })}
              </motion.div>
            </Box>
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
            images={images}
            onImageClick={handleImageClick}
            onImageError={handleImageError}
          />
        </Box>
      </Box>
    </PortalWrapper>
  );
};

export default ImagesGallery;
