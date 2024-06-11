import { Avatar, Box, IconButton, Typography } from "@mui/material";
import React, { ReactNode, useState } from "react";
import { MessageItemBaseProps } from "./types";
import { DoneAll, MoreHoriz } from "@mui/icons-material";
import { formatMessageDate } from "../../utils";
import { MessageSender } from "../../models/message.model";

const MessageItemWrapper: React.FC<
  MessageItemBaseProps & { children: ReactNode }
> = ({
  children,
  align = "left",
  showMenu = false,
  showUserName = true,
  sx,
  sender,
  sendAt,
}) => {
  const [hover, setHover] = useState<boolean>(false);
  const avtSizes = 50;
  const direction = align === "left" ? "row" : "row-reverse";
  const shouldShowMenu = showMenu && hover;
  const senderUser = sender as MessageSender;

  return (
    <Box
      component="span"
      sx={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        flexDirection: direction,
        ...sx,
      }}
    >
      <Avatar
        sx={{ width: `${avtSizes}px`, height: `${avtSizes}px`, flexShrink: 0 }}
        src={senderUser.photo}
      ></Avatar>
      <Box sx={{ textAlign: align }}>
        {showUserName && (
          <Typography sx={{ mb: 1 }} variant="body2" fontSize="14px">
            {senderUser.userName || senderUser.email}
          </Typography>
        )}
        <Box
          component="div"
          onMouseEnter={() => showMenu && setHover(true)}
          onMouseLeave={() => showMenu && setHover(false)}
          sx={{
            display: "flex",
            gap: "5px",
            flexDirection: direction,
            cursor: "pointer",
            alignItems: "center",
          }}
        >
          {children}
          {/* {showMenu && (
            <Box
              sx={{
                flexShrink: 0,
                flexGrow: 0,
                left: "100%",
                display: shouldShowMenu ? "block" : "none",
              }}
            >
              <IconButton>
                <MoreHoriz />
              </IconButton>
            </Box>
          )} */}
        </Box>
        <Box
          component="span"
          sx={{
            mt: 1,
            display: "flex",
            flexDirection: direction,
            alignItems: "center",
            gap: "5px",
            transition: "all ease .1s",
          }}
          fontSize="10px"
        >
          <DoneAll color="info" sx={{ fontSize: "10px" }} />{" "}
          <Typography sx={{ fontSize: "10px" }} variant="body2">
            {formatMessageDate(sendAt)}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default MessageItemWrapper;
