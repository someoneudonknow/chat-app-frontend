import React from "react";
import { Box, Paper, Typography, useTheme } from "@mui/material";
import { SmartToy } from "@mui/icons-material";

const AITypingIndicator: React.FC = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        marginBottom: 2,
        paddingLeft: 2,
      }}
    >
      <Paper
        sx={{
          display: "flex",
          alignItems: "center",
          padding: "8px 16px",
          borderRadius: "20px",
          backgroundColor: theme.palette.info.light,
          color: "white",
          maxWidth: "80%",
        }}
      >
        <SmartToy sx={{ marginRight: 1, fontSize: 20 }} />
        <Typography variant="body2" sx={{ fontWeight: "500" }}>
          AI Assistant is thinking
        </Typography>
        <Box sx={{ display: "flex", marginLeft: 1 }}>
          {[0, 1, 2].map((i) => (
            <Typography
              key={i}
              variant="body2"
              sx={{
                animation: "loadingFade 1s infinite",
                animationTimingFunction: "linear",
                animationDelay: `${0.2 * i}s`,
                margin: "0 1px",
              }}
            >
              .
            </Typography>
          ))}
        </Box>
      </Paper>
    </Box>
  );
};

export default AITypingIndicator;
