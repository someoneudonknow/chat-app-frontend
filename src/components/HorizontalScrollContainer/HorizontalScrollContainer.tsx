import { Box, BoxProps, SxProps } from "@mui/material";
import React, { ReactNode, useRef } from "react";
import { useHorizontalScroll } from "../../hooks";

type HorizontalScrollContainerProps = {
  children: ReactNode;
  sx?: SxProps<HTMLDivElement>;
} & BoxProps;

const HorizontalScrollContainer: React.FC<HorizontalScrollContainerProps> = ({
  children,
  sx,
  ...rest
}) => {
  const ref = useRef<HtmlDivElement>();

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
