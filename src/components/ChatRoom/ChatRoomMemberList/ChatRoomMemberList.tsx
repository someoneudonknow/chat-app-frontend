import React from "react";
import { ConservationMember } from "../../../models/conservation.model";
import { List } from "@mui/material";
import ChatRoomMemberListItem from "./ChatRoomMemberListItem";

type ChatRoomMemberListPropsType = {
  members: ConservationMember[];
};

const ChatRoomMemberList: React.FC<ChatRoomMemberListPropsType> = ({
  members,
}) => {
  return (
    <List>
      {members.map((m) => (
        <ChatRoomMemberListItem key={m.user._id} member={m} />
      ))}
    </List>
  );
};

export default ChatRoomMemberList;
