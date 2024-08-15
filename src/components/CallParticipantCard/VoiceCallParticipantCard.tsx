import {
  Avatar,
  Box,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  MenuList,
  styled,
} from "@mui/material";
import React, { MouseEvent, useState } from "react";
import { TextOverflowEllipsis } from "../Person/PersonItem";
import { Mic, MicOff, MoreVert } from "@mui/icons-material";

type VoiceCallParticipantCardPropsType = {
  micOff: boolean;
  avatar?: string;
  isTalked?: boolean;
  name: string;
};

const VoiceCallParticipantCard: React.FC<VoiceCallParticipantCardPropsType> = ({
  micOff,
  avatar,
  name,
  isTalked,
}) => {
  const avatarSize = 80;
  const [hover, setHover] = useState<boolean>(false);
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);

  const handleCloseMenu = () => {
    setMenuAnchor(null);
  };

  const handleMoreClick = (e: MouseEvent<HTMLElement>) => {
    setMenuAnchor(e.currentTarget);
  };

  return (
    <Box
      component="div"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      sx={{
        width: "100%",
        height: "100%",
        p: 2,
        display: "flex",
        backgroundColor: "#E2E2B6",
        justifyContent: "center",
        position: "relative",
        flexDirection: "column",
        alignItems: "center",
        gap: "10px",
        borderRadius: 2,
        boxShadow: `0 0 10px 3px ${isTalked ? "#96C9F4" : "transparent"}`,
        border: `2px solid ${isTalked ? "#96C9F4" : "transparent"}`,
      }}
    >
      {hover && (
        <div style={{ position: "absolute", top: "5px", right: "5px" }}>
          <IconButton
            onClick={handleMoreClick}
            sx={{
              color: "#021526",
            }}
          >
            <MoreVert />
          </IconButton>

          <Menu
            id="basic-menu"
            anchorEl={menuAnchor}
            open={!!menuAnchor}
            onClose={() => setMenuAnchor(null)}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem onClick={handleCloseMenu}>
              <ListItemIcon>
                <Mic />
              </ListItemIcon>
              Mute
            </MenuItem>
          </Menu>
        </div>
      )}
      {micOff && (
        <MicOff
          sx={{
            position: "absolute",
            top: "10px",
            left: "5px",
            color: "#021526",
          }}
        />
      )}
      <Avatar
        src={avatar}
        sx={{ width: `${avatarSize}px`, height: `${avatarSize}px` }}
      />
      <TextOverflowEllipsis
        sx={{ color: "black", width: "100%" }}
        variant="body1"
      >
        {name}
      </TextOverflowEllipsis>
    </Box>
  );
};

export default VoiceCallParticipantCard;
