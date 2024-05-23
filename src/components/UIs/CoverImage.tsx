import { styled } from "@mui/material";
import React, { HTMLAttributes } from "react";

const StyledImg = styled("img")(({ theme }) => ({
  width: "100%",
  height: "100%",
  objectFit: "cover",
  objectPosition: "center",
}));

const CoverImage: React.FC<HTMLAttributes<HTMLImageElement>> = ({
  ...props
}) => {
  return <StyledImg {...props} />;
};

export default CoverImage;
