import { Upload, UploadFile } from "@mui/icons-material";
import { Avatar, Box, Button, CircularProgress, SxProps } from "@mui/material";
import React, { ChangeEvent, useId, useState } from "react";

type UserAvatarChooserPropsType = {
  src?: string;
  name?: string;
  size?: number;
  sx?: SxProps;
  borderWidth?: number;
  onInput: (file: File) => void;
  loading?: boolean;
};

const UserAvatarChooser: React.FC<UserAvatarChooserPropsType> = ({
  src,
  size = 90,
  sx,
  onInput,
  name,
  borderWidth = 3,
  loading,
}) => {
  const avtInput = useId();
  const [hover, setHover] = useState<boolean>();

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      onInput(file);
      e.target.value = "";
    }
  };

  return (
    <Box
      component="div"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      sx={{
        position: "relative",
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: "50%",
        overflow: "hidden",
        ...sx,
      }}
    >
      {loading && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            zIndex: (theme) => theme.zIndex.drawer + 1,
            display: "grid",
            placeItems: "center",
            bgcolor: "rgba(255, 255, 255,0.3)",
          }}
        >
          <CircularProgress
            sx={{
              color: (theme) => theme.palette.containerPrimary?.main,
            }}
          />
        </Box>
      )}
      <Avatar
        sx={{
          width: `100%`,
          height: `100%`,
          border: (theme) =>
            `${borderWidth}px solid ${theme.palette.background.paper}`,
          position: "absolute",
          inset: 0,
          zIndex: 99,
        }}
        src={src}
      >
        {name}
      </Avatar>
      {hover && !loading && (
        <Box
          component="div"
          sx={{
            bgcolor: "rgba(0,0,0,0.2)",
            height: "100%",
            width: "100%",
            zIndex: (theme) => theme.zIndex.drawer,
            position: "absolute",
            top: 0,
            left: 0,
          }}
        >
          <label htmlFor={`${avtInput}-avt-image`}>
            <Button
              component="span"
              sx={{ height: "100%", width: "100%", borderRadius: "50%" }}
            >
              <Upload />
            </Button>
          </label>
        </Box>
      )}
      <input
        onInput={handleFileInput}
        id={`${avtInput}-avt-image`}
        type="file"
        accept="image/*"
        hidden
      />
    </Box>
  );
};

export default UserAvatarChooser;
