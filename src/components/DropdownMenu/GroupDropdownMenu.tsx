import { Menu, MenuItem } from "@mui/material";
import { DropDownMenuPropsType } from "../../constants/interfaces";
import { useId } from "react";

const GroupDropdownMenu: React.FC<DropDownMenuPropsType> = ({
  anchor,
  onClose,
}) => {
  const menuId = useId();

  const handleOnClose = (e) => {
    e.stopPropagation();
    onClose();
  };

  return (
    <Menu
      anchorEl={anchor}
      open={!!anchor}
      onClose={handleOnClose}
      id={`menu-${menuId}`}
    >
      <MenuItem onClick={handleOnClose}>Group Feature 1</MenuItem>
      <MenuItem onClick={handleOnClose}>Group Feature 2</MenuItem>
      <MenuItem onClick={handleOnClose}>Group Feature 3</MenuItem>
    </Menu>
  );
};

export default GroupDropdownMenu;
