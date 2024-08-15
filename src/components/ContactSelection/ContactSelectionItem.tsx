import {
  Avatar,
  ListItemButton,
  SxProps,
  ListItemProps,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemIcon,
  Checkbox,
} from "@mui/material";
import React from "react";
import { UserContact } from "../../models/user.model";

type ContactSelectionItemPropsType = {
  name: string;
  photo: UserContact["photo"];
  sx?: SxProps;
  active?: boolean;
} & ListItemProps;

const ContactSelectionItem: React.FC<ContactSelectionItemPropsType> = ({
  name,
  photo,
  sx,
  active,
  ...rest
}) => {
  return (
    <ListItem sx={{ p: 0, ...sx }} {...rest}>
      <ListItemButton>
        <ListItemIcon>
          <Checkbox edge="start" checked={active} />
        </ListItemIcon>
        <ListItemAvatar>
          <Avatar src={photo}>{name.charAt(0)}</Avatar>
        </ListItemAvatar>
        <ListItemText primary={name} />
      </ListItemButton>
    </ListItem>
  );
};

export default ContactSelectionItem;
