import { styled } from "@mui/material";

const CoverImage = styled("img")(() => ({
  width: "100%",
  height: "100%",
  objectFit: "cover",
  objectPosition: "center",
}));

export default CoverImage;
