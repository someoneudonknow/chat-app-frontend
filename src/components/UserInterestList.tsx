import React from "react";
import Interest from "../models/interest.model";
import { Box, Chip, Paper, Typography } from "@mui/material";
import InterestChip from "./UserProfileFormModal/InterestForm/InterestChip";
import { formatNumber } from "../utils";

type UserInterestListPropsType = {
  data?: Interest[];
};

const UserInterestList: React.FC<UserInterestListPropsType> = ({ data }) => {
  return (
    <Paper
      sx={{
        p: 3,
        display: "flex",
        flexWrap: "wrap",
        gap: "10px",
        borderRadius: 5,
        bgcolor: (theme) => theme.palette.background.paper,
      }}
    >
      {data && data.length === 0 && (
        <Typography variant="body1">Haven't choose any interests</Typography>
      )}
      {data &&
        data.length > 0 &&
        data.map((i) => (
          <Chip
            key={i._id}
            label={`${i.name} (${formatNumber(i.usedCount)})`}
          />
        ))}
    </Paper>
  );
};

export default UserInterestList;
