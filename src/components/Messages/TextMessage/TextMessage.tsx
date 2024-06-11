import { Box } from "@mui/material";
import { TextMessagePropsType } from "../types";
import MessageItemWrapper from "../MessageItemWrapper";

const TextMessage: React.FC<TextMessagePropsType> = ({ text, ...rest }) => {
  return (
    <MessageItemWrapper {...rest}>
      <Box
        component="span"
        sx={{
          bgcolor: (theme) =>
            theme.palette.mode === "dark" ? "background.paper" : "#F1F1F1",
          px: 2,
          py: 1,
          borderRadius: 5,
          lineBreak: "anywhere",
          flexFlow: "revert-layer",
        }}
      >
        {text}
      </Box>
    </MessageItemWrapper>
  );
};

export default TextMessage;
