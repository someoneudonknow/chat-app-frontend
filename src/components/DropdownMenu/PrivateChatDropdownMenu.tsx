import { Menu, MenuItem } from "@mui/material";
import React, { useId } from "react";
import { DropDownMenuPropsType } from "../../constants/interfaces";

const PrivateChatDropdownMenu: React.FC<DropDownMenuPropsType> = ({
  anchor,
  onClose,
}) => {
  const menuId = useId();

  return (
    <Menu
      anchorEl={anchor}
      open={!!anchor}
      onClose={onClose}
      id={`menu-${menuId}`}
    >
      <MenuItem onClick={onClose}>Private Chat Feature 1</MenuItem>
      <MenuItem onClick={onClose}>Private Chat Feature 2</MenuItem>
      <MenuItem onClick={onClose}>Private Chat Feature 3</MenuItem>
    </Menu>
  );
};

export default PrivateChatDropdownMenu;
