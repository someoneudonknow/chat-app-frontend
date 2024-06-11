import {
  Box,
  CircularProgress,
  Slide,
  Snackbar,
  Typography,
} from "@mui/material";
import React from "react";

type LoadingSnackbarPropsType = {
  loading: boolean;
  loadingText: string;
};

const LoadingSnackbar: React.FC<LoadingSnackbarPropsType> = ({
  loading,
  loadingText,
}) => {
  return (
    <Snackbar
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      sx={{ minWidth: "300px" }}
      open={loading}
      key="file-uploading-loader"
      TransitionComponent={(props) => <Slide {...props} direction="up" />}
    >
      <Box
        sx={{
          width: "100%",
          py: 2,
          px: 3,
          borderRadius: 3,
          textAlign: "center",
          display: "flex",
          alignItems: "center",
          bgcolor: (theme) => theme.palette.containerPrimary?.main,
          color: (theme) => theme.palette.containerPrimary?.contrastText,
        }}
      >
        <CircularProgress sx={{ mr: 2 }} size={20} />{" "}
        <Typography variant="body2">{loadingText}</Typography>
      </Box>
    </Snackbar>
  );
};

export default LoadingSnackbar;
