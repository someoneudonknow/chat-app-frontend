import React from "react";
import User from "../../../models/user.model";
import {
  Avatar,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import { MoreHoriz } from "@mui/icons-material";
import { TextOverflowEllipsis } from "../../Person/PersonItem";
import { ConservationMember } from "../../../models/conservation.model";

type ChatRoomMemberListItemPropsType = {
  member: ConservationMember;
};

const ChatRoomMemberListItem: React.FC<ChatRoomMemberListItemPropsType> = ({
  member,
}) => {
  const { user, nickname } = member;

  return (
    <ListItem
      secondaryAction={
        <IconButton edge="end" aria-label="delete">
          <MoreHoriz />
        </IconButton>
      }
    >
      <ListItemAvatar>
        <Avatar src={user.photo}></Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={
          <TextOverflowEllipsis>
            {nickname || user.userName || user.email}
          </TextOverflowEllipsis>
        }
      />
    </ListItem>
  );
};

export default ChatRoomMemberListItem;
