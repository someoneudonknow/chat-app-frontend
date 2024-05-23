import { ModeEdit } from "@mui/icons-material";
import { CircularProgress, IconButton, SxProps, Theme } from "@mui/material";
import React, { ChangeEvent, useId, useState } from "react";
import { motion } from "framer-motion";
import BackgroundWrapper from "./UIs/BackgroundWrapper";

type UserBackgroundChooserPropsType = {
  onInput: (selectedFile: File) => void;
  src?: string;
  sx?: SxProps;
  loading?: boolean;
};

const UserBackgroundChooser: React.FC<UserBackgroundChooserPropsType> = ({
  onInput,
  src,
  sx,
  loading,
}) => {
  const [hover, setHover] = useState<boolean>(false);
  const fileInputId = useId();

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (selectedFile) {
      onInput(selectedFile);
      e.target.value = "";
    }
  };

  const gradient = {
    dark: "linear-gradient(45deg, hsl(240deg 100% 20%) 0%, hsl(289deg 100% 21%) 11%, hsl(315deg 100% 27%) 22%, hsl(329deg 100% 36%) 33%, hsl(337deg 100% 43%) 44%, hsl(357deg 91% 59%) 56%, hsl(17deg 100% 59%) 67%,hsl(34deg 100% 53%) 78%,hsl(45deg 100% 50%) 89%, hsl(55deg 100% 50%) 100%)",
    light:
      "linear-gradient(40deg,hsl(240deg 47% 68%) 0%,hsl(294deg 37% 64%) 20%,hsl(334deg 65% 69%) 29%,hsl(357deg 83% 74%) 36%,hsl(18deg 83% 70%) 43%,hsl(36deg 67% 63%) 50%,hsl(30deg 70% 62%) 57%,hsl(24deg 72% 62%) 64%,hsl(17deg 72% 62%) 71%,hsl(9deg 70% 62%) 80%,hsl(0deg 66% 62%) 100%);",
  };

  return (
    <BackgroundWrapper
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      sx={{
        backgroundImage: (theme: Theme) =>
          `url(${src}), ${gradient[theme.palette.mode]}`,
        ...sx,
      }}
    >
      {loading && (
        <div
          style={{
            borderRadius: "10px",
            position: "absolute",
            inset: 0,
            width: "100%",
            zIndex: 1000,
            overflow: "hidden",
            height: "100%",
            display: "grid",
            placeItems: "center",
            backgroundColor: "rgba(255, 255, 255, 0.3)",
          }}
        >
          <CircularProgress />
        </div>
      )}
      {hover && (
        <label
          style={{ position: "absolute", right: "10px", bottom: "10px" }}
          htmlFor={`image-input-${fileInputId}`}
        >
          <motion.div
            initial={{ visibility: "hidden", opacity: "0", scale: 0 }}
            animate={{ visibility: "visible", opacity: 1, scale: 1 }}
          >
            <IconButton sx={{ boxShadow: 3 }} component="span">
              <ModeEdit
                sx={{
                  stroke: (theme) => theme.palette.background.paper,
                  strokeWidth: 1,
                }}
              />
            </IconButton>
          </motion.div>
        </label>
      )}
      <input
        onInput={handleFileInputChange}
        name={`${fileInputId}-image`}
        accept="image/*"
        id={`image-input-${fileInputId}`}
        type="file"
        hidden
      />
    </BackgroundWrapper>
  );
};

export default UserBackgroundChooser;
