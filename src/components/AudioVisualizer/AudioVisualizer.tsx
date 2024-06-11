import { Box, BoxProps } from "@mui/material";
import React, { useLayoutEffect, useRef } from "react";
import { mapPercentage } from "../../utils";

type AudioVisualizerPropsType = {
  streamSrc: MediaStream;
  barColor?: string;
  barWidth?: number;
  wrapperProps?: BoxProps;
};

const AudioVisualizer: React.FC<AudioVisualizerPropsType> = ({
  streamSrc,
  barColor = "white",
  barWidth = 2,
  wrapperProps,
}) => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasCtxRef = useRef<CanvasRenderingContext2D | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const wrapperRef = useRef<HTMLDivElement>();

  const framerLooper = () => {
    if (!analyzerRef.current || !canvasCtxRef.current || !canvasRef.current)
      return;

    window.requestAnimationFrame(framerLooper);

    const fbcArray = new Uint8Array(analyzerRef.current?.frequencyBinCount);

    analyzerRef.current.getByteFrequencyData(fbcArray);

    canvasCtxRef.current.clearRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );

    canvasCtxRef.current.fillStyle = barColor;

    const barAmount = Math.floor(canvasRef.current.width / barWidth);

    for (let i = 0; i < barAmount; i++) {
      const barX = i * (barWidth + 1);
      const barHeight = -mapPercentage(
        fbcArray[i],
        0,
        255,
        0,
        canvasRef.current.height
      );

      canvasCtxRef.current.fillRect(
        barX,
        canvasRef.current.height,
        barWidth,
        Math.round(barHeight)
      );
    }
  };

  useLayoutEffect(() => {
    const audioContext = new AudioContext();

    audioContextRef.current = audioContext;
    analyzerRef.current = audioContext.createAnalyser();
    sourceRef.current = audioContext.createMediaStreamSource(streamSrc);
    sourceRef.current.connect(analyzerRef.current);

    const wrapperWidth: number | undefined = wrapperRef.current?.offsetWidth;
    const wrapperHeight: number | undefined = wrapperRef.current?.offsetHeight;

    if (wrapperWidth && canvasRef.current) {
      canvasRef.current.width = wrapperWidth;
    }

    if (wrapperHeight && canvasRef.current) {
      canvasRef.current.height = wrapperHeight;
    }

    framerLooper();
    // eslint-disable-next-line
  }, [streamSrc]);

  return (
    <Box
      component="div"
      sx={{ textAlign: "center", ...(wrapperProps && wrapperProps?.sx) }}
      {...wrapperProps}
      ref={wrapperRef}
    >
      <canvas
        ref={(node) => {
          canvasCtxRef.current = node?.getContext("2d") || null;
          canvasRef.current = node;
        }}
        style={{ width: "100%", height: "100%" }}
      />
    </Box>
  );
};

export default AudioVisualizer;
