import { Menu, MenuProps, useTheme } from "@mui/material";
import React, { memo } from "react";
import { DropDownMenuPropsType } from "../constants/interfaces";
import EmojiPicker, {
  EmojiClickData,
  EmojiStyle,
  PickerProps,
  Theme,
} from "emoji-picker-react";

interface EmojiPickerMenuPropsType extends DropDownMenuPropsType {
  pickerProps?: PickerProps;
  menuProps?: MenuProps;
  onEmojiClick?: (emojiData: EmojiClickData, event: MouseEvent) => void;
}

const EmojiPickerMenu: React.FC<EmojiPickerMenuPropsType> = memo(
  ({ anchor, onClose, pickerProps, menuProps, onEmojiClick }) => {
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
        disableScrollLock
      >
        {/* <EmojiPicker
          emojiStyle={EmojiStyle.FACEBOOK}
          lazyLoadEmojis
          theme={emojiTheme[theme.palette.mode]}
          onEmojiClick={onEmojiClick}
          {...pickerProps}
        /> */}
      </Menu>
    );
  }
);

export default EmojiPickerMenu;
