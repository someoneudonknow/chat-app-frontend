import {
  Avatar,
  AvatarGroup,
  IconButton,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import React, { MouseEvent, useId, useState } from "react";
import { MoreHoriz } from "@mui/icons-material";
import { ConservationType } from "../../models/conservation.model";
import { GroupDropdownMenu, PrivateChatDropdownMenu } from "../DropdownMenu";
import { TextOverflowEllipsis } from "../Person/PersonItem";
import UserOnlineBadge from "../UIs/UserOnlineBadge";

interface ConservationItemPropsType {
  conservationId: string;
  avatar?: string | (string | null)[] | null;
  name?: string;
  lastMessage?: string;
  conservationType: ConservationType;
  onClick?: (conservationId: string) => void;
  active?: boolean;
  isOnline?: boolean;
}

const ConservationItem: React.FC<ConservationItemPropsType> = ({
  conservationId,
  conservationType,
  avatar,
  name,
  lastMessage,
  onClick,
  active,
  isOnline,
}) => {
  const [hover, setHover] = useState<boolean>(false);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const iconBtnId = useId();

  const handleMouseEnter = () => {
    setHover(true);
  };

  const handleMouseLeave = () => {
    setHover(false);
  };

  const handleMoreBtnClicked = (e: MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setMenuAnchor(e.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setHover(false);
  };

  const handleListItemClicked = () => {
    {
      onClick && onClick(conservationId);
    }
  };

  return (
    <ListItemButton
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleListItemClicked}
      key={conservationId}
      sx={{
        width: "100%",
        bgcolor: active ? "background.paper" : "",
        "&:hover": {
          ...(active && { bgcolor: "background.paper" }),
        },
      }}
    >
      <ListItemAvatar>
        {avatar && Array.isArray(avatar) && (
          <AvatarGroup sx={{ mr: 1 }} max={2} total={10}>
            {avatar.map((avt) => (
              <Avatar src={avt || undefined} />
            ))}
          </AvatarGroup>
        )}
        {avatar && typeof avatar === "string" && (
          <UserOnlineBadge isOnline={!!isOnline}>
            <Avatar src={avatar} />
          </UserOnlineBadge>
        )}
        {!avatar && <Avatar />}
      </ListItemAvatar>
      <ListItemText
        primary={
          <Typography
            sx={{
              fontSize: "1.1rem",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {name}
          </Typography>
        }
        secondary={
          <TextOverflowEllipsis
            component="span"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              color: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(255, 255, 255, 0.5)"
                  : "rgba(0,0,0,0.4)",
            }}
            variant="body2"
          >
            {lastMessage || "You haven't had any messages"}
          </TextOverflowEllipsis>
        }
      />
      {hover && (
        <IconButton
          sx={{
            border: (theme) =>
              `1px solid ${theme.palette.containerSecondary?.main}`,
          }}
          id={`btn-${iconBtnId}`}
          onClick={handleMoreBtnClicked}
        >
          <MoreHoriz />
        </IconButton>
      )}
      {conservationType === ConservationType.INBOX && menuAnchor && (
        <PrivateChatDropdownMenu
          anchor={menuAnchor}
          onClose={handleMenuClose}
        />
      )}
      {conservationType === ConservationType.GROUP && menuAnchor && (
        <GroupDropdownMenu anchor={menuAnchor} onClose={handleMenuClose} />
      )}
    </ListItemButton>
  );
};

export default ConservationItem;
