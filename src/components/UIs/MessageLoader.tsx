import { Box, CircularProgress } from "@mui/material";
import React from "react";

const MessageLoader: React.FC = () => {
  return (
    <Box
      component="div"
      sx={{
        p: 1,
        width: "100px",
        alignSelf: "flex-end",
        textAlign: "center",
        mr: 2,
        borderRadius: 5,
        backgroundColor: "background.paper",
      }}
    >
      <CircularProgress size={15} />
    </Box>
  );
};

export default MessageLoader;
