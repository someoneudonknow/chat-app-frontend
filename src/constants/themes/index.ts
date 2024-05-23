import { PaletteColor } from "@mui/material/styles";
import { theme as blue } from "./blue";
import { theme as _default } from "./default";

declare module "@mui/material/styles" {
  interface Palette {
    containerPrimary?: PaletteColor;
    containerSecondary?: PaletteColor;
    containerTertiary?: PaletteColor;
    tertiary?: PaletteColor;
  }

  interface PaletteOptions {
    containerPrimary?: PaletteColor;
    containerSecondary?: PaletteColor;
    containerTertiary?: PaletteColor;
    tertiary?: PaletteColor;
  }
}

export const colors = {
  0: _default,
  1: blue,
};
