import { Stack } from "@mui/material";
import React from "react";
import LabelIconButton from "../../UIs/LabelIconButton";
import { Search } from "@mui/icons-material";

const GroupActions = () => {
  return (
    <Stack direction="row" justifyContent="space-around">
      <LabelIconButton label="Search" icon={<Search />} />
    </Stack>
  );
};

export default GroupActions;
