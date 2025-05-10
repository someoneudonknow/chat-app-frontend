import { SmartToy } from "@mui/icons-material";
import { Menu, MenuItem, ListItemIcon, ListItemText } from "@mui/material";
import React, { ReactNode } from "react";

export type MentionMenuItem = {
  id: string;
  displayText: string;
  icon: ReactNode;
};

type MentionMenuPropsType = {
  onSelect?: (selectedOption: string) => void;
  anchor: HTMLElement | null;
  open: boolean;
  onClose?: () => void;
};

const MENU_ITEMS: MentionMenuItem[] = [
  { id: "ai", displayText: "Chat with AI", icon: <SmartToy /> },
];

const MentionMenu: React.FC<MentionMenuPropsType> = ({
  onSelect,
  anchor,
  open,
  onClose,
}) => {
  return (
    <Menu anchorEl={anchor} open={open} onClose={onClose}>
      {MENU_ITEMS.map((option) => (
        <MenuItem
          key={option.id}
          onClick={() => onSelect && onSelect(option.id)}
        >
          {option.icon && <ListItemIcon>{option.icon}</ListItemIcon>}
          <ListItemText primary={option.displayText} />
        </MenuItem>
      ))}
    </Menu>
  );
};

export default MentionMenu;
