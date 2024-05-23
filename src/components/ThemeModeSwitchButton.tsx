import { motion } from "framer-motion";
import { MouseEventHandler, useContext, useEffect, useState } from "react";
import { Box, BoxProps, IconButton, SxProps, useTheme } from "@mui/material";
import { DarkMode, LightMode } from "@mui/icons-material";
import { useAppTheme } from "../contexts/ThemeContext";

type ModeSwitchButtonPropsType = {
  height: string;
  width: string;
  sx?: SxProps;
  rest?: BoxProps;
};

const spring = {
  type: "spring",
  stiffness: 700,
  damping: 30,
};

const ThemeModeSwitchButton: React.FC<ModeSwitchButtonPropsType> = ({
  height,
  width,
  sx,
  ...rest
}) => {
  const theme = useTheme();
  const appThemeCtx = useAppTheme();

  const iconStyle = {
    width: "70%",
    height: "70%",
    m: 0,
    p: 0,
  };

  const handleToggle: MouseEventHandler<HTMLDivElement> = (e) => {
    e.stopPropagation();
    appThemeCtx.toggleTheme();
  };

  return (
    <Box
      onClick={handleToggle}
      sx={{
        bgcolor: theme.palette.containerPrimary?.main,
        height: height,
        width: width,
        borderRadius: `calc(100vmax - calc(0.2 * ${height}))`,
        display: "flex",
        justifyContent:
          theme.palette.mode === "dark" ? "flex-end" : "flex-start",
        alignItems: "center",
        cursor: "pointer",
        px: `calc(0.2 * ${height})`,
        ...sx,
      }}
      {...rest}
    >
      <motion.div
        layout
        transition={spring}
        style={{
          width: `calc(0.8 * ${height})`,
          height: "80%",
          borderRadius: "100%",
          overflow: "hidden",
          display: "grid",
          placeItems: "center",
        }}
      >
        <IconButton
          sx={{
            width: "100%",
            height: "100%",
            bgcolor: theme.palette.info.contrastText,
            "&:hover": {
              bgcolor: theme.palette.info.contrastText,
            },
            p: 0,
          }}
        >
          {theme.palette.mode === "dark" ? (
            <LightMode sx={iconStyle} />
          ) : (
            <DarkMode sx={iconStyle} />
          )}
        </IconButton>
      </motion.div>
    </Box>
  );
};

export default ThemeModeSwitchButton;
