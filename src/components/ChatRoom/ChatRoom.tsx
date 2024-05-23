import React, { useState } from "react";
import { Conservation } from "../../models/conservation.model";
import { Box, Paper } from "@mui/material";
import { MessagesList } from "../Messages";
import ChatRoomSideBar from "./ChatRoomSideBar";
import ChatRoomHeader from "./ChatRoomHeader";
import ChatBar from "./ChatBar";
import { FieldValues } from "react-hook-form";

type ChatRoomPropsType = {
  conservation: Conservation;
};

const ChatRoom: React.FC<ChatRoomPropsType> = ({ conservation }) => {
  const [showSideBar, setShowSidebar] = useState<boolean>(true);

  const toggleShowSideBar = () => {
    setShowSidebar((prev) => !prev);
  };

  const handleSendMessage = (data: FieldValues) => {
    console.log(data);
  };

  return (
    <Paper sx={{ flex: 1, display: "flex" }}>
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        {conservation && (
          <>
            <ChatRoomHeader
              conservation={conservation}
              onShowSideBarClick={toggleShowSideBar}
            />
            <MessagesList />
            <ChatBar onSubmit={handleSendMessage} />
          </>
        )}
      </Box>
      {conservation && (
        <ChatRoomSideBar conservation={conservation} show={showSideBar} />
      )}
    </Paper>
  );
};

export default ChatRoom;
