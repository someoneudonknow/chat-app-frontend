import { Box, IconButton, SxProps, Typography } from "@mui/material";
import React, { ReactNode } from "react";

type LabelIconButtonPropsType = {
  icon: ReactNode;
  label: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
  sx?: SxProps;
};

const LabelIconButton: React.FC<LabelIconButtonPropsType> = ({
  icon,
  label,
  onClick,
  sx,
}) => {
  return (
    <Box
      sx={{
        textAlign: "center",
        ...sx,
      }}
      component="span"
    >
      <IconButton onClick={onClick}>{icon}</IconButton>
      <Typography variant="body2">{label}</Typography>
    </Box>
  );
};

export default LabelIconButton;
