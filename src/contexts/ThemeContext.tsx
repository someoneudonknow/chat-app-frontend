import {
  ThemeProvider,
  createTheme,
  Theme,
  useMediaQuery,
  GlobalStyles,
  CssBaseline,
  ThemeOptions,
} from "@mui/material";
import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { colors as themeColors } from "../constants/themes";
import ThemeModeChangedAnimation from "../components/ThemeModeChangedAnimation";

export type ThemeContextType = {
  toggleTheme: () => void;
  shuffleColorTheme: () => void;
};

export const ThemeContext = createContext<ThemeContextType>({
  toggleTheme: () => {},
  shuffleColorTheme: () => {},
});

type AppThemeContextPropsType = {
  children: ReactNode;
};

const themeKey = "user-theme"; // set theme to local storage

const AppThemeProvider: React.FC<AppThemeContextPropsType> = ({ children }) => {
  const prefersDarkMode: boolean = useMediaQuery(
    "(prefers-color-scheme: dark)"
  );
  const [themeChanged, setThemeChanged] = useState<boolean>(false);
  const [theme, setTheme] = useState<0 | 1>(1);
  const [mode, setMode] = useState<"light" | "dark">(
    prefersDarkMode ? "dark" : "light"
  );

  useEffect(() => {
    setMode(prefersDarkMode ? "dark" : "light");
  }, [prefersDarkMode]);

  const _theme = useMemo(
    () => createTheme(themeColors[theme][mode] as ThemeOptions),
    [theme, mode]
  );

  const colorMode: ThemeContextType = useMemo(() => {
    return {
      toggleTheme: () => {
        setThemeChanged(true);
      },
      shuffleColorTheme: () => {
        setTheme((prevTheme) => ((prevTheme + 1) % 2) as 0 | 1);
      },
    };
  }, []);

  return (
    <ThemeContext.Provider value={colorMode}>
      <ThemeProvider theme={_theme}>
        <GlobalStyles
          styles={{
            "*::-webkit-scrollbar": {
              width: "0.3em",
              height: "0.3em",
            },
            "*::-webkit-scrollbar-thumb": {
              borderRadius: "100vmax",
              backgroundColor: _theme.palette.divider,
            },
          }}
        />
        <CssBaseline enableColorScheme />
        {themeChanged && (
          <ThemeModeChangedAnimation
            onClose={() => {
              setThemeChanged(false);
              setMode((prev) => (prev === "light" ? "dark" : "light"));
            }}
          />
        )}
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useAppTheme = () => useContext(ThemeContext);

export default AppThemeProvider;
