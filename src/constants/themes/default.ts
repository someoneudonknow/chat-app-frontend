import { createTheme } from "@mui/material/styles";
import { AppTheme } from "./types";

const { palette } = createTheme();

const defaultLight = createTheme({
  palette: {
    mode: "light",
  },
});

const defaultDark = createTheme({
  palette: {
    mode: "dark",
  },
});

export const theme: AppTheme = {
  dark: {
    palette: {
      ...defaultDark.palette,
      containerPrimary: palette.augmentColor({
        color: {
          main: "#121212",
          contrastText: "white",
        },
      }),
      containerSecondary: palette.augmentColor({
        color: {
          main: "#121212",
          contrastText: "white",
        },
      }),
    },
  },
  light: {
    palette: {
      ...defaultLight.palette,
      containerPrimary: palette.augmentColor({
        color: {
          main: "#fff",
          contrastText: "#black",
        },
      }),
      containerSecondary: palette.augmentColor({
        color: {
          main: "#fff",
          contrastText: "#black",
        },
      }),
    },
  },
};
