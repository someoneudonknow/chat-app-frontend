import React, { useState } from "react";
import { IGif } from "@giphy/js-types";
import { Box, BoxProps, Skeleton } from "@mui/material";

type GifPropsType = {
  gif: IGif;
} & BoxProps;

const Gif: React.FC<GifPropsType> = ({ gif, ...rest }) => {
  const [imgLoad, setImgLoad] = useState<boolean>(true);

  const handleImgLoaded = () => {
    setImgLoad(false);
  };

  return (
    <Box
      component="div"
      sx={{
        overflow: "hidden",
        width: "100%",
        borderRadius: "5px",
        height: "fit-content",
        border: "2px solid transparent",
        display: "flex",
        flexDirection: "column",
        "&:hover": {
          borderColor: (theme) => theme.palette.info.dark,
          cursor: "pointer",
        },
        transition: "all linear 0.1s",
        position: "relative",
      }}
      {...rest}
    >
      {imgLoad && (
        <Skeleton
          sx={{
            zIndex: 100,
            width: "100%",
          }}
          variant="rectangular"
          height={gif.images.fixed_width_small.height}
          animation="wave"
        />
      )}
      <img
        onLoad={handleImgLoaded}
        loading="lazy"
        style={{
          width: "100%",
          height: imgLoad ? "100%" : "0%",
          objectFit: "cover",
          objectPosition: "center",
        }}
        alt={gif.alt_text}
        src={gif.images.fixed_width_small.webp}
      />
    </Box>
  );
};

export default Gif;
