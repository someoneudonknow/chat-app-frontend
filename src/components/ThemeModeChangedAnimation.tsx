import { useTheme } from "@mui/material";
import { motion, useAnimate } from "framer-motion";
import PortalWrapper from "./PortalWrapper";
import { useEffect } from "react";
import { DarkMode, LightMode } from "@mui/icons-material";

type ThemeModeChangedAnimationProps = {
  onClose: () => void;
};

const ThemeModeChangedAnimation: React.FC<ThemeModeChangedAnimationProps> = ({
  onClose,
}) => {
  const theme = useTheme();
  const [themeIconScope, themeIconAnimate] = useAnimate();

  useEffect(() => {
    (async () => {
      await themeIconAnimate(themeIconScope.current, {
        y: 0,
        opacity: 1,
      });

      await themeIconAnimate(
        themeIconScope.current,
        {
          width: "1000vw",
          height: "1000vh",
          rotate: 360 * 3,
          opacity: 0,
        },
        { duration: 0.4, ease: "circInOut" }
      );

      onClose();
    })();

    // eslint-disable-next-line
  }, []);

  return (
    <PortalWrapper>
      <motion.div
        exit={{ opacity: 0, backgroundColor: "transparent" }}
        style={{
          position: "fixed",
          inset: 0,
          overflow: "hidden",
          width: "100vw",
          height: "100vh",
          backgroundColor: "transparent",
          zIndex: 9999,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <motion.div
          initial={{ y: window.innerHeight, opacity: 0 }}
          ref={themeIconScope}
          style={{
            width: "30%",
            height: "30%",
            backgroundColor: "transparent",
          }}
        >
          {theme.palette.mode === "light" && (
            <DarkMode
              sx={{
                width: "100%",
                height: "100%",
                color: "#1a1c1e",
              }}
            />
          )}
          {theme.palette.mode === "dark" && (
            <LightMode
              sx={{
                width: "100%",
                height: "100%",
                color: "#ffffff",
              }}
            />
          )}
        </motion.div>
      </motion.div>
    </PortalWrapper>
  );
};

export default ThemeModeChangedAnimation;
