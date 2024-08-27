import React, { useId, useState } from "react";
import { useTheme } from "@mui/material";
import { motion } from "framer-motion";
import PrimarySidebarView from "./PrimarySidebarView";
import AttachmentsFilterSidebarView from "./AttachmentsFilterSidebarView";
import { useChatRoom } from "../context/ChatRoomContextProvider";

type ChatRoomSideBarPropsType = {
  show: boolean;
  onSearchBtnClick?: () => void;
};

const ChatRoomSideBar: React.FC<ChatRoomSideBarPropsType> = ({ show }) => {
  const id = useId();
  const theme = useTheme();
  const { sidebarView } = useChatRoom();

  return (
    <motion.div
      key={id}
      initial={{ x: 40 }}
      animate={{ x: 0 }}
      style={{
        width: show ? "30%" : "0%",
        transition: "all ease 0.3s",
        height: "100%",
        overflow: "hidden",
        borderLeft: `1px solid ${theme.palette.background.paper}`,
      }}
    >
      <PrimarySidebarView show={sidebarView.viewName === "primary"} />
      <AttachmentsFilterSidebarView
        show={sidebarView.viewName === "attachments"}
      />
    </motion.div>
  );
};

export default ChatRoomSideBar;
