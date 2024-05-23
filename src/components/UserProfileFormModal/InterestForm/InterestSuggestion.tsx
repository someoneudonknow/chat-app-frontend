import React from "react";
import InterestModel from "../../../models/interest.model";
import { Box, CircularProgress, SxProps, Typography } from "@mui/material";
import InterestChip from "./InterestChip";

type InterestSuggestionPropsType = {
  data: InterestModel[];
  loading: boolean;
  onInterestItemIconClick?: (id: string) => void;
  sx?: SxProps;
};

const InterestSuggestion: React.FC<InterestSuggestionPropsType> = ({
  data,
  loading,
  onInterestItemIconClick,
  sx,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: "10px",
        overflowY: "auto",
        ...sx,
      }}
    >
      {loading && (
        <Box sx={{ width: "100%", textAlign: "center" }}>
          <CircularProgress />
        </Box>
      )}
      {!loading && data.length === 0 && (
        <Typography variant="body1">No data found</Typography>
      )}
      {!loading &&
        data.length > 0 &&
        data.map((i) => (
          <InterestChip
            key={i._id}
            id={i._id}
            usedCount={i.usedCount}
            name={i.name}
            onIconClick={(id: string) => {
              onInterestItemIconClick && onInterestItemIconClick(id);
            }}
          />
        ))}
    </Box>
  );
};

export default InterestSuggestion;
