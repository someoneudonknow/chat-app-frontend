import { Box, BoxProps, SxProps } from "@mui/material";
import React, { ReactNode } from "react";

type BackgroundWrapperPropsType = {
  children?: ReactNode;
  sx?: SxProps;
} & BoxProps;

const BackgroundWrapper: React.FC<BackgroundWrapperPropsType> = ({
  children,
  sx,
  ...rest
}) => {
  return (
    <Box
      component="div"
      sx={{
        width: "100%",
        borderRadius: 2,
        paddingBottom: "40%",
        position: "relative",
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        ...sx,
      }}
      {...rest}
    >
      {children}
    </Box>
  );
};

export default BackgroundWrapper;
