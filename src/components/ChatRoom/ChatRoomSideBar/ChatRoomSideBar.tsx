import React, { useId } from "react";
import { Box, useTheme } from "@mui/material";
import PrimarySidebarView from "./PrimarySidebarView";
import AttachmentsFilterSidebarView from "./AttachmentsFilterSidebarView";
import { useChatRoom } from "../context/ChatRoomProvider";

type ChatRoomSideBarPropsType = {
  show: boolean;
  onSearchBtnClick?: () => void;
};

const ChatRoomSideBar: React.FC<ChatRoomSideBarPropsType> = ({ show }) => {
  const id = useId();
  const theme = useTheme();
  const { sidebarView } = useChatRoom();

  return (
    <Box
      key={id}
      style={{
        width: show ? "30%" : "0%",
        height: "100%",
        overflow: "hidden",
        borderLeft: `1px solid ${theme.palette.background.paper}`,
      }}
    >
      <PrimarySidebarView show={sidebarView.viewName === "primary"} />
      <AttachmentsFilterSidebarView
        show={sidebarView.viewName === "attachments"}
      />
    </Box>
  );
};

export default ChatRoomSideBar;
