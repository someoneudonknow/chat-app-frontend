import { Slide } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import React, { forwardRef } from "react";

export default forwardRef(function DefaultTransition(
  props: TransitionProps & { children: React.ReactElement<any, any> },
  ref: React.Ref<unknown>
) {
  return <Slide ref={ref} {...props} direction="down" />;
});
