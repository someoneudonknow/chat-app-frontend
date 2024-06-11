import { IconButton, SxProps, Typography, useTheme } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useRef, useState } from "react";
import { PauseCircle, PlayCircle, Replay } from "@mui/icons-material";
import WaveSurfer from "wavesurfer.js";
import { formatSeconds } from "../../utils";
import HoverPlugin from "wavesurfer.js/dist/plugins/hover.js";

type WaveFormAudioPlayerPropsType = {
  src: Blob;
  initState?: "play" | "pause";
  sx?: SxProps;
};

const WaveFormAudioPlayer: React.FC<WaveFormAudioPlayerPropsType> = ({
  src,
  sx,
  initState,
}) => {
  const [audioState, setAudioState] = useState<"play" | "pause" | "ended">(
    initState || "play"
  );
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const waveSurferRef = useRef<WaveSurfer>();
  const theme = useTheme();
  const [loadingPercent, setLoadingPercent] = useState<number>(0);

  useEffect(() => {
    const srcUrl = URL.createObjectURL(src);

    if (
      wrapperRef.current === null ||
      wrapperRef.current === null ||
      waveSurferRef.current === null
    )
      return;

    const waveSurfer = WaveSurfer.create({
      container: wrapperRef.current,
      waveColor: theme.palette.containerPrimary?.contrastText || "white",
      progressColor: theme.palette?.tertiary[theme.palette.mode] || "#cccccc",
      url: srcUrl,
      height: wrapperRef.current.offsetHeight,
      barWidth: 3,
      barGap: 2,
      cursorWidth: 3,
      barRadius: 4,
      plugins: [
        HoverPlugin.create({
          lineColor: "#ff0000",
          lineWidth: 2,
          labelBackground: "#555",
          labelColor: "#fff",
          labelSize: "11px",
        }),
      ],
    });

    waveSurfer.on("ready", (duration) => {
      setCurrentTime(duration);
      if (audioState === "play") {
        waveSurfer.play();
      }
    });

    waveSurfer.on("loading", (percent) => {
      setLoadingPercent(percent);
    });

    waveSurfer.on("timeupdate", (currentTime) => {
      setCurrentTime(currentTime);
    });

    waveSurfer.on("interaction", () => {
      setAudioState("play");
      waveSurfer.play();
    });

    waveSurfer.on("finish", () => {
      setAudioState("ended");
    });

    waveSurferRef.current = waveSurfer;

    return () => {
      waveSurferRef.current?.destroy();

      if (srcUrl) {
        URL.revokeObjectURL(srcUrl);
      }
    };
    // eslint-disable-next-line
  }, [src]);

  const tongleAudio = async () => {
    if (["play", "pause"].includes(audioState)) {
      if (audioState === "play") {
        setAudioState("pause");
        waveSurferRef.current?.pause();
      } else if (audioState === "pause") {
        setAudioState("play");
        waveSurferRef.current?.play();
      }
    }
  };

  const handleReplay = async () => {
    setAudioState("play");
    waveSurferRef.current?.seekTo(0);
    waveSurferRef.current?.play();
  };

  return (
    <Box
      sx={{
        ...sx,
        borderRadius: "100vmax",
        bgcolor: (theme) => theme.palette.containerPrimary[theme.palette.mode],
        display: "flex",
        alignItems: "center",
        pr: 1,
        gap: 1,
      }}
    >
      {["play", "pause"].includes(audioState) && (
        <IconButton
          onClick={tongleAudio}
          sx={{ aspectRatio: 1 / 1, height: "100%" }}
        >
          {audioState === "pause" && <PlayCircle />}
          {audioState === "play" && <PauseCircle />}
        </IconButton>
      )}
      {audioState === "ended" && (
        <IconButton
          onClick={handleReplay}
          sx={{ aspectRatio: 1 / 1, height: "100%" }}
        >
          <Replay />
        </IconButton>
      )}
      <Box sx={{ py: 1, height: "100%", display: "flex", width: "100%" }}>
        <div
          ref={wrapperRef}
          style={{
            flex: 1,
            height: "100%",
          }}
        ></div>
      </Box>
      {loadingPercent < 100 && (
        <Typography variant="body2">{loadingPercent} %</Typography>
      )}
      <Box>
        <Typography>{formatSeconds(currentTime)}</Typography>
      </Box>
    </Box>
  );
};

export default WaveFormAudioPlayer;
