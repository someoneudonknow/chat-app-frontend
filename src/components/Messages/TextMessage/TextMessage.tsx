import { Box, Chip, SxProps, Theme, useTheme } from "@mui/material";
import { SmartToy } from "@mui/icons-material";
import { TextMessagePropsType } from "../types";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import CodeBlock from "./CodeBlock";

interface CodeProps {
  node?: any;
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const TextMessage: React.FC<TextMessagePropsType> = ({
  text,
  sx,
  originalMessage,
}) => {
  const theme = useTheme();
  const isAIMessage =
    originalMessage?.isBot || originalMessage?.sender === "ai";

  const markdownStyles: SxProps<Theme> = {
    "& p": {
      margin: "0.5em 0",
      "&:first-of-type": { marginTop: 0 },
      "&:last-of-type": { marginBottom: 0 },
    },
    "& a": {
      color: theme.palette.primary.main,
      textDecoration: "underline",
    },
    "& code": {
      backgroundColor:
        theme.palette.mode === "dark"
          ? "rgba(255, 255, 255, 0.1)"
          : "rgba(0, 0, 0, 0.05)",
      padding: "2px 4px",
      borderRadius: "4px",
      fontFamily: "monospace",
    },
    "& pre": {
      backgroundColor: "transparent",
      padding: 0,
      margin: 0,
      "& code": {
        backgroundColor: "transparent",
        padding: 0,
      },
    },
    "& ul, & ol": {
      paddingLeft: "20px",
      margin: "0.5em 0",
    },
    "& blockquote": {
      borderLeft: `4px solid ${theme.palette.divider}`,
      paddingLeft: "16px",
      margin: "8px 0",
      color: theme.palette.text.secondary,
    },
    "& h1, & h2, & h3, & h4, & h5, & h6": {
      margin: "8px 0",
    },
    "& table": {
      borderCollapse: "collapse",
      width: "100%",
      margin: "1em 0",
    },
    "& th, & td": {
      border: `1px solid ${theme.palette.divider}`,
      padding: "8px",
      textAlign: "left",
    },
    "& th": {
      backgroundColor:
        theme.palette.mode === "dark"
          ? "rgba(255, 255, 255, 0.1)"
          : "rgba(0, 0, 0, 0.05)",
    },
    "& img": {
      maxWidth: "100%",
      borderRadius: "4px",
    },
  };

  return (
    <Box
      component="span"
      sx={{
        px: 2,
        py: 1,
        lineBreak: "anywhere",
        flexFlow: "revert-layer",
        position: "relative",
        ...sx,
      }}
    >
      {isAIMessage && (
        <Chip
          icon={<SmartToy fontSize="small" />}
          label="AI"
          size="small"
          color="primary"
          sx={{
            position: "absolute",
            top: -10,
            right: 10,
            fontSize: "0.6rem",
            height: "18px",
            opacity: 0.9,
          }}
        />
      )}
      <Box
        sx={{
          ...markdownStyles,
          display: "inline-block",
          whiteSpace: "pre-wrap",
          color: "inherit",
          fontSize: "inherit",
          fontFamily: "inherit",
        }}
      >
        <ReactMarkdown
          rehypePlugins={[rehypeRaw, rehypeSanitize]}
          components={{
            a: (props) => (
              <a
                {...props}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: theme.palette.primary.main }}
              />
            ),
            code: ({ inline, className, children, ...rest }: CodeProps) => {
              const match = /language-(\w+)/.exec(className || "");
              const language = match ? match[1] : "";

              if (inline) {
                return (
                  <code
                    className={className}
                    style={{
                      backgroundColor:
                        theme.palette.mode === "dark"
                          ? "rgba(255, 255, 255, 0.1)"
                          : "rgba(0, 0, 0, 0.05)",
                      padding: "2px 4px",
                      borderRadius: "4px",
                      fontFamily: "monospace",
                    }}
                    {...rest}
                  >
                    {children}
                  </code>
                );
              }

              return (
                <CodeBlock className={className || `language-${language}`}>
                  {String(children).replace(/\n$/, "")}
                </CodeBlock>
              );
            },
          }}
        >
          {text}
        </ReactMarkdown>
      </Box>
    </Box>
  );
};

export default TextMessage;
