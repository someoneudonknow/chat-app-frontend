import { BrokenImageSharp } from "@mui/icons-material";
import { Box, BoxProps, CircularProgress, SxProps, Theme } from "@mui/material";
import React, { CSSProperties, useState } from "react";

type ImagePropsType = {
  sx?: SxProps;
  src: string;
  imgStyle?: CSSProperties;
  onImageError?: () => void;
  onImageLoaded?: () => void;
} & BoxProps;

type BrokenImagePropsType = BoxProps;

const BrokenImage: React.FC<BrokenImagePropsType> = ({ sx, ...rest }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        p: 2,
        bgcolor: (theme: Theme) =>
          theme.palette.containerPrimary &&
          theme.palette.containerPrimary[theme.palette.mode],
        ...sx,
      }}
      {...rest}
    >
      <BrokenImageSharp />
    </Box>
  );
};

const Image: React.FC<ImagePropsType> = ({
  sx,
  src,
  imgStyle,
  onImageError,
  onImageLoaded,
  ...rest
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  const handleImageLoaded = () => {
    setLoading(false);
    onImageLoaded && onImageLoaded();
  };

  const handleLoadError = () => {
    setLoading(false);
    setError(true);
    onImageError && onImageError();
  };

  if (error || !src) {
    return <BrokenImage {...rest} sx={sx} />;
  }

  return (
    <Box component="div" {...rest} sx={{ ...sx, position: "relative" }}>
      {loading && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            display: "flex",
            bgcolor: (theme) =>
              theme.palette.containerPrimary &&
              theme.palette.containerPrimary[theme.palette.mode],
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress size={25} />
        </Box>
      )}
      <img
        src={src}
        style={{
          display: error ? "none" : "block",
          objectFit: "cover",
          objectPosition: "center",
          height: "100%",
          ...imgStyle,
        }}
        loading="lazy"
        onLoad={handleImageLoaded}
        onError={handleLoadError}
      />
    </Box>
  );
};

export default Image;
