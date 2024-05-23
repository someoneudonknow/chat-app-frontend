import React from "react";
import { DropDownMenuPropsType } from "../../constants/interfaces";
import { ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material";
import ThemeModeSwitchButton from "../ThemeModeSwitchButton";
import { Contrast, Person2 } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const SettingMenu: React.FC<DropDownMenuPropsType> = ({ anchor, onClose }) => {
  const navigate = useNavigate();

  const handleProfileClicked = () => {
    navigate("/user/profile");
    onClose();
  };

  return (
    <Menu anchorEl={anchor} open={!!anchor} onClose={onClose}>
      <MenuItem sx={{ minWidth: "12rem" }} onClick={handleProfileClicked}>
        <ListItemIcon>
          <Person2 />
        </ListItemIcon>
        <ListItemText>My profile</ListItemText>
      </MenuItem>
      <MenuItem sx={{ minWidth: "17rem" }} onClick={onClose}>
        <ListItemIcon>
          <Contrast />
        </ListItemIcon>
        <ListItemText>Theme</ListItemText>
        <ThemeModeSwitchButton height="30px" width="60px" />
      </MenuItem>
    </Menu>
  );
};

export default SettingMenu;
