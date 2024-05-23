import { SxProps, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { ReactNode } from "react";

type PrimaryHeaderPropsType = {
  sx?: SxProps;
  title: string;
  children?: ReactNode;
};

const PrimaryHeader: React.FC<PrimaryHeaderPropsType> = ({
  sx,
  title,
  children,
}) => {
  return (
    <Box component="div" sx={{ p: 2, ...sx }}>
      <Typography sx={{ fontSize: "1.5rem", fontWeight: "bold", mb: 3 }}>
        {title}
      </Typography>
      {children}
    </Box>
  );
};

export default PrimaryHeader;
