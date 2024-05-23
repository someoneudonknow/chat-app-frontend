import { IGif } from "@giphy/js-types";
import { Box, SxProps } from "@mui/material";
import React from "react";

type GifsMansoryPropsType = {
  data: IGif[];
  sx?: SxProps;
};

const GifsMansory: React.FC<GifsMansoryPropsType> = ({ data, sx }) => {
  const rowsCount = Math.floor(data.length / 2);

  const firstHaft = data.filter((_, i) => i < rowsCount);
  const secondHaft = data.filter((_, i) => i >= rowsCount);

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        overflow: "auto",
        gap: "10px",
        ...sx,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "calc(50% - 10px)",
        }}
      >
        {firstHaft.map((g) => (
          <Box key={g.id} sx={{}}>
            <img
              style={{
                width: "100%",
                objectFit: "cover",
                objectPosition: "center",
                borderRadius: "5px",
                overflow: "hidden",
              }}
              alt={g.alt_text}
              src={g.images.fixed_width_small.webp}
            />
          </Box>
        ))}
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "calc(50% - 10px)",
        }}
      >
        {secondHaft.map((g) => (
          <Box key={g.id} sx={{}}>
            <img
              style={{
                width: "100%",
                objectFit: "cover",
                objectPosition: "center",
              }}
              alt={g.alt_text}
              src={g.images.fixed_width_small.webp}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default GifsMansory;
