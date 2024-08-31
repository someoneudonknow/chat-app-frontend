import { Box } from "@mui/material";
import { BoxProps, SxProps } from "@mui/system";
import React, { ReactNode, useRef } from "react";
import { useHorizontalScroll } from "../../hooks";

type HorizontalScrollContainerProps = BoxProps & {
  children: ReactNode;
  sx?: BoxProps["sx"];
};

const HorizontalScrollContainer: React.FC<HorizontalScrollContainerProps> = ({
  children,
  sx,
  ...rest
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useHorizontalScroll(ref);

  return (
    <Box
      ref={ref}
      component="div"
      sx={{
        width: "100%",
        alignItems: "center",
        display: "flex",
        flexWrap: "nowrap",
        overflowX: "auto",
        "&::-webkit-scrollbar": {
          height: "thin",
        },
        "&::-webkit-scrollbar-thumb": {
          background: "white",
        },
        ...sx,
      }}
      {...rest}
    >
      {children}
    </Box>
  );
};

export default HorizontalScrollContainer;
