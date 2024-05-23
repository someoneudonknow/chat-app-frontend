import { createTheme } from "@mui/material";
import { AppTheme } from "./types";

const { palette } = createTheme();

export const theme: AppTheme = {
  light: {
    palette: {
      mode: "light",
      primary: palette.augmentColor({
        color: {
          main: "#32618d",
          contrastText: "#ffffff",
        },
      }),
      secondary: palette.augmentColor({
        color: {
          main: "#51606f",
          contrastText: "#ffffff",
        },
      }),
      text: {
        primary: "#1a1c1e",
        secondary: "#1a1c1e",
      },
      background: {
        default: "#fcfcff",
        paper: "#fcfcff",
      },
      error: palette.augmentColor({
        color: {
          main: "#ba1a1a",
          contrastText: "#ffffff",
        },
      }),
      success: palette.augmentColor({
        color: {
          main: "#006d3f",
          contrastText: "#ffffff",
        },
      }),
      warning: palette.augmentColor({
        color: {
          main: "#666000",
          contrastText: "#ffffff",
        },
      }),
      divider: "#72777f",
      tertiary: palette.augmentColor({
        color: {
          main: "#68587a",
          contrastText: "#ffffff",
        },
      }),
      containerPrimary: palette.augmentColor({
        color: {
          main: "#cee5ff",
          contrastText: "#001d33",
        },
      }),
      containerSecondary: palette.augmentColor({
        color: {
          main: "#d5e4f7",
          contrastText: "#e7dff8",
        },
      }),
      containerTertiary: palette.augmentColor({
        color: {
          main: "#efdbff",
          contrastText: "#231533",
        },
      }),
    },
  },
  dark: {
    palette: {
      mode: "dark",
      primary: palette.augmentColor({
        color: {
          main: "#97cbff",
          contrastText: "#003354",
        },
      }),
      secondary: palette.augmentColor({
        color: {
          main: "#b9c8da",
          contrastText: "#243240",
        },
      }),
      tertiary: palette.augmentColor({
        color: {
          main: "#d3bfe6",
          contrastText: "#392a49",
        },
      }),
      text: {
        primary: "#e2e2e5",
        secondary: "#e2e2e5",
      },
      background: {
        default: "#1a1c1e",
        paper: "#1a1c1e",
      },
      error: palette.augmentColor({
        color: {
          main: "#ffb4ab",
          contrastText: "#690005",
        },
      }),
      success: palette.augmentColor({
        color: {
          main: "#73db9c",
          contrastText: "#00391e",
        },
      }),
      warning: palette.augmentColor({
        color: {
          main: "#d6ca14",
          contrastText: "#353100",
        },
      }),
      divider: "#8c9199",
      containerPrimary: palette.augmentColor({
        color: {
          main: "#004a77",
          contrastText: "#cee5ff",
        },
      }),
      containerSecondary: palette.augmentColor({
        color: {
          main: "#3a4857",
          contrastText: "#d5e4f7",
        },
      }),
      containerTertiary: palette.augmentColor({
        color: {
          main: "#504061",
          contrastText: "#efdbff",
        },
      }),
    },
  },
};
