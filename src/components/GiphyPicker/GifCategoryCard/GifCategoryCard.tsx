import { ICategory } from "@giphy/js-fetch-api";
import { Box, Skeleton, SxProps, Typography } from "@mui/material";
import React, { useState } from "react";

type GifCategoryCardPropsType = {
  data: ICategory;
  sx?: SxProps;
  onClick?: (category: string) => void;
};

const GifCategoryCard: React.FC<GifCategoryCardPropsType> = ({
  data,
  sx,
  onClick,
}) => {
  const [cardHover, setCardHover] = useState<boolean>(false);
  const [imgLoad, setImgLoad] = useState<boolean>(true);

  const handleImgLoaded = () => {
    setImgLoad(false);
  };

  const handleCardClick = () => {
    onClick && onClick(data.name);
  };

  return (
    <Box
      component="div"
      onClick={handleCardClick}
      onMouseEnter={() => setCardHover(true)}
      onMouseLeave={() => setCardHover(false)}
      sx={{
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        borderRadius: 1,
        ...sx,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          zIndex: 100,
          bgcolor: "rgba(0,0,0,0.3)",
          display: "grid",
          placeItems: "center",
        }}
      >
        <Typography
          sx={{ textShadow: "0px 0px 40px rgba(0,0,0,0.6)" }}
          variant="body1"
        >
          {data.name}
        </Typography>
      </Box>
      {imgLoad && (
        <Skeleton
          sx={{ position: "absolute", inset: 0, zIndex: 100 }}
          variant="rectangular"
          width="100%"
          height={100}
          animation="wave"
        />
      )}
      <img
        loading="lazy"
        src={data.gif?.images.fixed_height_small.webp}
        onLoad={handleImgLoaded}
        style={{
          height: "100px",
          width: "100%",
          objectFit: "cover",
          objectPosition: "center",
          transition: "all ease 0.2s",
          transform: cardHover ? "scale(1.3)" : "",
          cursor: "pointer",
        }}
        alt={data.gif?.alt_text}
      />
    </Box>
  );
};

export default GifCategoryCard;
