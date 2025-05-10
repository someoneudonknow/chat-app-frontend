import React from "react";
import { Box, IconButton, Tooltip, useTheme } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

interface CodeBlockProps {
  children: string;
  className?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ children, className }) => {
  const theme = useTheme();
  const language = className ? className.replace("language-", "") : "";
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Box
      sx={{
        position: "relative",
        fontFamily: "monospace",
        fontSize: "0.875rem",
        backgroundColor:
          theme.palette.mode === "dark"
            ? "rgba(255, 255, 255, 0.1)"
            : "rgba(0, 0, 0, 0.05)",
        borderRadius: "4px",
        padding: "8px",
        overflowX: "auto",
        mb: 2,
      }}
    >
      {language && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            right: 40,
            padding: "2px 8px",
            backgroundColor:
              theme.palette.mode === "dark"
                ? "rgba(255, 255, 255, 0.1)"
                : "rgba(0, 0, 0, 0.1)",
            borderBottomLeftRadius: "4px",
            borderTopRightRadius: "4px",
            fontSize: "0.75rem",
            color: theme.palette.text.secondary,
          }}
        >
          {language}
        </Box>
      )}
      <Tooltip title={copied ? "Copied!" : "Copy to clipboard"} placement="top">
        <IconButton
          size="small"
          onClick={handleCopy}
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            color: theme.palette.text.secondary,
            "&:hover": {
              color: theme.palette.text.primary,
            },
          }}
        >
          <ContentCopyIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <pre
        style={{ margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-word" }}
      >
        <code style={{ fontFamily: "inherit" }}>{children}</code>
      </pre>
    </Box>
  );
};

export default CodeBlock;
