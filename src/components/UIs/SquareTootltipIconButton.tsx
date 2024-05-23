import { IconButton, IconButtonProps, Tooltip } from "@mui/material";
import React, { ReactNode } from "react";

type SquareTooltipIconButtonProps = {
  title: string;
  children: ReactNode;
  sx?: object;
  placement?:
    | "bottom"
    | "left"
    | "right"
    | "top"
    | "right-start"
    | "bottom-end"
    | "bottom-start"
    | "left-end"
    | "left-start"
    | "right-end"
    | "top-end"
    | "top-start"
    | undefined;
} & IconButtonProps;

const SquareTooltipIconButton: React.FC<SquareTooltipIconButtonProps> = ({
  title,
  children,
  sx,
  placement,
  ...rest
}) => {
  return (
    <Tooltip placement={placement || "right-start"} title={title}>
      <IconButton
        {...rest}
        sx={{
          borderRadius: "5px",
          ...sx,
        }}
      >
        {children}
      </IconButton>
    </Tooltip>
  );
};

export default SquareTooltipIconButton;
