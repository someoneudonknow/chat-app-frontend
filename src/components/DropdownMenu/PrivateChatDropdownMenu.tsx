import { Menu, MenuItem } from "@mui/material";
import React, { MouseEventHandler, useId } from "react";
import { DropDownMenuPropsType } from "../../constants/interfaces";

const PrivateChatDropdownMenu: React.FC<DropDownMenuPropsType> = ({
  anchor,
  onClose,
}) => {
  const menuId = useId();

  const handleMenuItemClick: MouseEventHandler<HTMLLIElement> = (e) => {
    e.stopPropagation();
    onClose();
  };

  return (
    <Menu
      anchorEl={anchor}
      open={!!anchor}
      onClose={onClose}
      id={`menu-${menuId}`}
    >
      <MenuItem onClick={handleMenuItemClick}>Private Chat Feature 1</MenuItem>
      <MenuItem onClick={handleMenuItemClick}>Private Chat Feature 2</MenuItem>
      <MenuItem onClick={handleMenuItemClick}>Private Chat Feature 3</MenuItem>
    </Menu>
  );
};

export default PrivateChatDropdownMenu;
