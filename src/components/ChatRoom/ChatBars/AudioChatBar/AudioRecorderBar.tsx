import { StopCircle } from "@mui/icons-material";
import { Box, IconButton, SxProps, Typography, useTheme } from "@mui/material";
import React, { useEffect } from "react";
import AudioVisualizer from "../../../AudioVisualizer";
import { useRecorder } from "../../../../hooks";

type AudioRecorderBarPropsType = {
  onStopRecording: (recordedSrc: Blob) => void;
  sx?: SxProps;
};

const AudioRecorderBar: React.FC<AudioRecorderBarPropsType> = ({
  onStopRecording,
  sx,
}) => {
  const theme = useTheme();
  const {
    currentMediaStream,
    stopRecord,
    loading: gettingMediaStream,
    error,
  } = useRecorder({ onStopRecording });

  return (
    <Box
      sx={{
        bgcolor: theme.palette?.containerPrimary[theme.palette.mode] || "",
        overflow: "hidden",
        borderRadius: "100vmax",
        display: "flex",
        pr: 2,
        ...sx,
      }}
    >
      {!currentMediaStream && (
        <Box
          sx={{
            height: "100%",
            width: "100%",
            display: "grid",
            placeItems: "center",
          }}
        >
          {gettingMediaStream && (
            <Typography>Accessing your devices...</Typography>
          )}
          {error && <Typography color="error">{error.message}</Typography>}
        </Box>
      )}
      {currentMediaStream && !gettingMediaStream && (
        <>
          <IconButton
            sx={{ height: "100%", aspectRatio: 1 / 1 }}
            onClick={stopRecord}
          >
            <StopCircle />
          </IconButton>
          <AudioVisualizer
            wrapperProps={{ height: "100%", flex: 1 }}
            barWidth={3}
            barColor={theme.palette.containerPrimary?.contrastText}
            streamSrc={currentMediaStream}
          />
        </>
      )}
    </Box>
  );
};

export default AudioRecorderBar;
