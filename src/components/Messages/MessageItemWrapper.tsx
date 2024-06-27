import { Avatar, Box, Typography } from "@mui/material";
import React, { ReactNode } from "react";
import { MessageItemBaseProps } from "./types";
import { MessageSender } from "../../models/message.model";

const MessageItemWrapper: React.FC<
  MessageItemBaseProps & { children: ReactNode }
> = ({
  children,
  align = "left",
  showUserName = true,
  sx,
  sender,
  showAvatar = true,
}) => {
  const avtSizes = 50;
  const direction = align === "left" ? "row" : "row-reverse";
  const senderUser = sender as MessageSender;

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
      {showAvatar && (
        <Avatar
          sx={{
            width: `${avtSizes}px`,
            height: `${avtSizes}px`,
            flexShrink: 0,
          }}
          src={senderUser.photo}
        ></Avatar>
      )}

      <Box sx={{ textAlign: align }}>
        {showUserName && (
          <Typography sx={{ mb: 1 }} variant="body2" fontSize="14px">
            {senderUser.userName || senderUser.email}
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
