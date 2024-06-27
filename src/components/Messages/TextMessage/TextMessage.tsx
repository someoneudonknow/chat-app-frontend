import { Box } from "@mui/material";
import { TextMessagePropsType } from "../types";

const TextMessage: React.FC<TextMessagePropsType> = ({ text, sx }) => {
  return (
    <Box
      component="span"
      sx={{
        px: 2,
        py: 1,
        lineBreak: "anywhere",
        flexFlow: "revert-layer",
        ...sx,
      }}
    >
      {text}
    </Box>
  );
};

export default TextMessage;
