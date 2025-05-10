import { Avatar, Box, Typography } from "@mui/material";
import React, { ReactNode } from "react";
import { MessageItemBaseProps } from "./types";
import { MessageSender } from "../../models/message.model";
import { SmartToy } from "@mui/icons-material";

// TODO: check if ai here
const MessageItemWrapper: React.FC<
  MessageItemBaseProps & { children: ReactNode }
> = ({
  children,
  align = "left",
  showUserName = true,
  sx,
  sender,
  showAvatar = true,
  isBot = false,
}) => {
  const avtSizes = 50;
  const direction = align === "left" ? "row" : "row-reverse";
  const senderUser = sender as MessageSender;
  const isAI = isBot || sender === "ai";

  if (sender === "ai") {
    console.log("Sender is ai");
  }

  return (
    <Box
      component="span"
      sx={{
        display: "flex",
        alignItems: "flex-end",
        gap: "10px",
        flexDirection: direction,
        ...sx,
      }}
    >
      {showAvatar &&
        (isAI ? (
          <Avatar
            sx={{
              width: `${avtSizes}px`,
              height: `${avtSizes}px`,
              flexShrink: 0,
              bgcolor: "primary.main",
            }}
          >
            <SmartToy />
          </Avatar>
        ) : (
          <Avatar
            sx={{
              width: `${avtSizes}px`,
              height: `${avtSizes}px`,
              flexShrink: 0,
            }}
            src={senderUser.photo}
          ></Avatar>
        ))}

      <Box sx={{ textAlign: align }}>
        {showUserName && (
          <Typography sx={{ mb: 1 }} variant="body2" fontSize="14px">
            {isAI ? "AI Assistant" : senderUser.userName || senderUser.email}
          </Typography>
        )}
        <Box
          component="div"
          sx={{
            display: "flex",
            flexBasis: "auto",
            gap: "2px",
            flexDirection: "column",
            alignItems: align === "left" ? "flex-start" : "flex-end",
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default MessageItemWrapper;
