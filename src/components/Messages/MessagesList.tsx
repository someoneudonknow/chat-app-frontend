import { Box } from "@mui/material";
import React from "react";

const MessagesList: React.FC = () => {
  return (
    <Box
      sx={{
        px: 1,
        overflow: "auto",
        flex: 1,
      }}
    ></Box>
  );
};

export default MessagesList;
