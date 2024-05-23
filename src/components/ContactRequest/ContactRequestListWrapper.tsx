import React, { ReactNode } from "react";
import { Box } from "@mui/material";

type ContactRequestList = {
  children: ReactNode;
};

const ContactRequestListWrapper: React.FC<ContactRequestList> = ({
  children,
}) => {
  return (
    <Box
      sx={{
        flex: 1,
        overflowY: "auto",
        display: "flex",
        flexWrap: "wrap",
        width: "100%",
        gap: "1rem",
        alignItems: "flex-start",
      }}
    >
      {children}
    </Box>
  );
};

export default ContactRequestListWrapper;
