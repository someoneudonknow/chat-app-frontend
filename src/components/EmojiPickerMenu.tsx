import { Menu, MenuProps, useTheme } from "@mui/material";
import React from "react";
import { DropDownMenuPropsType } from "../constants/interfaces";
import EmojiPicker, {
  EmojiStyle,
  PickerProps,
  Theme,
} from "emoji-picker-react";

interface EmojiPickerMenuPropsType extends DropDownMenuPropsType {
  pickerProps?: PickerProps;
  menuProps?: MenuProps;
}

const EmojiPickerMenu: React.FC<EmojiPickerMenuPropsType> = ({
  anchor,
  onClose,
  pickerProps,
  menuProps,
}) => {
  const theme = useTheme();
  const emojiTheme = {
    dark: Theme.DARK,
    light: Theme.LIGHT,
  };

  return (
    <Menu
      {...menuProps}
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
      open={!!anchor}
      MenuListProps={{ sx: { p: 0 } }}
      onClose={onClose}
    >
      <EmojiPicker
        emojiStyle={EmojiStyle.FACEBOOK}
        lazyLoadEmojis
        theme={emojiTheme[theme.palette.mode]}
        {...pickerProps}
      />
    </Menu>
  );
};

export default EmojiPickerMenu;
