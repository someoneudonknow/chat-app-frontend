import React from "react";
import { DropDownMenuPropsType } from "../../constants/interfaces";
import { Menu } from "@mui/material";
import { IGif } from "@giphy/js-types";
import GifphyPicker from "./GiphyPicker";

interface GiphyPickerMenuPropsType extends DropDownMenuPropsType {
  onGifClick?: (gif: IGif) => void;
}

const GiphyPickerMenu: React.FC<GiphyPickerMenuPropsType> = ({
  anchor,
  onClose,
  onGifClick,
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
      <GifphyPicker onGifClick={onGifClick} />
    </Menu>
  );
};

export default GiphyPickerMenu;
