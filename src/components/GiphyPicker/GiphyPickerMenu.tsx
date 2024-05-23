import React from "react";
import { DropDownMenuPropsType } from "../../constants/interfaces";
import { Menu, MenuItem } from "@mui/material";
import GifphyPicker from "./GiphyPicker";

interface GiphyPickerMenuPropsType extends DropDownMenuPropsType {}

const GiphyPickerMenu: React.FC<GiphyPickerMenuPropsType> = ({
  anchor,
  onClose,
}) => {
  return (
    <Menu
      open={!!anchor}
      anchorOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      keepMounted
      anchorEl={anchor}
      onClose={onClose}
      MenuListProps={{ sx: { p: 0 } }}
    >
      <GifphyPicker />
    </Menu>
  );
};

export default GiphyPickerMenu;
