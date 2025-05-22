import {
  Box,
  CircularProgress,
  IconButton,
  Paper,
  Typography,
  useTheme,
  Alert,
  Snackbar,
  Tooltip,
} from "@mui/material";
import AgoraUIKit, { layout, CallbacksInterface } from "agora-react-uikit";
import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../../store";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import CallEndIcon from "@mui/icons-material/CallEnd";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import StopScreenShareIcon from "@mui/icons-material/StopScreenShare";
import PeopleIcon from "@mui/icons-material/People";
import SignalCellularAltIcon from "@mui/icons-material/SignalCellularAlt";
import SignalCellularConnectedNoInternet0BarIcon from "@mui/icons-material/SignalCellularConnectedNoInternet0Bar";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import PauseCircleOutlineIcon from "@mui/icons-material/PauseCircleOutline";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import "agora-react-uikit/dist/index.css";
import { useCall } from "../../../contexts/CallContext";

// Define NodeJS.Timeout type if it's not available
declare global {
  interface Window {
    setTimeout(handler: TimerHandler, timeout?: number): number;
    clearTimeout(handle?: number): void;
  }
}

type Timeout = ReturnType<typeof setTimeout>;

type VideoCallViewPropsType = {
  onCallEndClick?: () => void;
  appId: string;
  agoraRtcConfig: {
    token: string;
    uid: string;
    channel: string;
  };
  agoraRtmConfig: {
    token: string;
    uid: string;
    channel: string;
  };
};

const VideoCallView: React.FC<VideoCallViewPropsType> = ({
  agoraRtcConfig,
  agoraRtmConfig,
  appId,
  onCallEndClick,
}) => {
  const theme = useTheme();
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const {
    startRecording,
    pauseRecording,
    stopRecording,
    isRecording,
    isRecordingPaused,
  } = useCall();
  const [isLoading, setIsLoading] = useState(true);
  const [participantCount, setParticipantCount] = useState(1);
  const [connectionQuality, setConnectionQuality] = useState<
    "good" | "poor" | "disconnected"
  >("good");
  const [notification, setNotification] = useState<{
    message: string;
    severity: "error" | "warning" | "info" | "success";
  } | null>(null);
  const connectionCheckInterval = useRef<Timeout | null>(null);
  const lastNetworkCheckTime = useRef<number>(Date.now());
  const connectionAttempts = useRef<number>(0);
  const maxConnectionAttempts = 3;

  useEffect(() => {
    const checkConnection = () => {
      const now = Date.now();
      const timeSinceLastCheck = now - lastNetworkCheckTime.current;

      if (navigator.onLine) {
        if (timeSinceLastCheck > 5000) {
          setConnectionQuality("poor");
          setNotification({
            message: "Poor connection quality. Check your network.",
            severity: "warning",
          });
        } else {
          setConnectionQuality("good");
        }
      } else {
        setConnectionQuality("disconnected");
        setNotification({
          message: "You're offline. Check your internet connection.",
          severity: "error",
        });

        connectionAttempts.current += 1;

        if (connectionAttempts.current >= maxConnectionAttempts) {
          setNotification({
            message: "Call ended due to connection issues",
            severity: "error",
          });
          setTimeout(() => {
            onCallEndClick && onCallEndClick();
          }, 2000);
        }
      }

      lastNetworkCheckTime.current = now;
    };

    connectionCheckInterval.current = setInterval(checkConnection, 10000);

    return () => {
      if (connectionCheckInterval.current) {
        clearInterval(connectionCheckInterval.current);
      }
    };
  }, [onCallEndClick]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setNotification({
        message: "Connected to call successfully",
        severity: "success",
      });
    }, 2000);

    const handleOnline = () => {
      setConnectionQuality("good");
      setNotification({
        message: "Connection restored",
        severity: "success",
      });
    };

    const handleOffline = () => {
      setConnectionQuality("disconnected");
      setNotification({
        message: "You're offline. Reconnecting...",
        severity: "error",
      });
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleCallEnd = () => {
    setNotification({
      message: "Ending call...",
      severity: "info",
    });

    if (isRecording) {
      handleStopRecording();
    }

    setTimeout(() => {
      onCallEndClick && onCallEndClick();
    }, 500);
  };

  const handleUserJoined = () => {
    setParticipantCount((prev) => {
      const newCount = prev + 1;
      setNotification({
        message: "A participant has joined the call",
        severity: "info",
      });
      return newCount;
    });
  };

  const handleUserLeft = () => {
    setParticipantCount((prev) => {
      const newCount = Math.max(1, prev - 1);
      if (newCount === 1) {
        setNotification({
          message: "You're the only participant left in the call",
          severity: "info",
        });
      } else {
        setNotification({
          message: "A participant has left the call",
          severity: "info",
        });
      }
      return newCount;
    });
  };

  const handleStartRecording = async () => {
    try {
      setNotification({
        message: "Starting recording...",
        severity: "info",
      });

      const success = await startRecording({
        uid: agoraRtcConfig.uid,
        channelName: agoraRtcConfig.channel,
      });

      if (success) {
        setNotification({
          message: "Recording started",
          severity: "success",
        });
      } else {
        throw new Error("Failed to start recording");
      }
    } catch (error) {
      console.error("Error starting recording:", error);
      setNotification({
        message: "Failed to start recording",
        severity: "error",
      });
    }
  };

  const handlePauseResumeRecording = async () => {
    try {
      setNotification({
        message: isRecordingPaused
          ? "Resuming recording..."
          : "Pausing recording...",
        severity: "info",
      });

      const success = await pauseRecording();

      if (success) {
        setNotification({
          message: isRecordingPaused ? "Recording resumed" : "Recording paused",
          severity: "success",
        });
      } else {
        throw new Error("Failed to pause/resume recording");
      }
    } catch (error) {
      console.error("Error pausing/resuming recording:", error);
      setNotification({
        message: "Failed to pause/resume recording",
        severity: "error",
      });
    }
  };

  const handleStopRecording = async () => {
    try {
      setNotification({
        message: "Stopping recording...",
        severity: "info",
      });

      const success = await stopRecording();

      if (success) {
      } else {
        setNotification({
          message: "Recording process completed",
          severity: "info",
        });
      }
    } catch (error) {
      console.error("Error stopping recording:", error);
      setNotification({
        message:
          "There was an issue with the recording, but the call can continue",
        severity: "warning",
      });
    }
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          width: "100%",
          bgcolor: theme.palette.background.default,
        }}
      >
        <CircularProgress color="primary" size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Connecting to call...
        </Typography>
        <Typography variant="body2" sx={{ mt: 1, color: "text.secondary" }}>
          Please wait while we establish a secure connection
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ position: "relative", height: "100vh", width: "100%" }}>
      <Snackbar
        open={!!notification}
        autoHideDuration={3000}
        onClose={() => setNotification(null)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={notification?.severity || "info"}>
          {notification?.message || ""}
        </Alert>
      </Snackbar>

      <Paper
        elevation={3}
        sx={{
          position: "absolute",
          top: 20,
          left: 20,
          zIndex: 10,
          padding: "6px 12px",
          borderRadius: "20px",
          display: "flex",
          alignItems: "center",
          gap: 1,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          color: "#fff",
        }}
      >
        {connectionQuality === "good" && (
          <SignalCellularAltIcon sx={{ color: "success.main" }} />
        )}
        {connectionQuality === "poor" && (
          <SignalCellularAltIcon sx={{ color: "warning.main" }} />
        )}
        {connectionQuality === "disconnected" && (
          <SignalCellularConnectedNoInternet0BarIcon
            sx={{ color: "error.main" }}
          />
        )}
        <Typography variant="body2">
          {connectionQuality === "good"
            ? "Good connection"
            : connectionQuality === "poor"
            ? "Poor connection"
            : "Disconnected"}
        </Typography>
      </Paper>

      <Paper
        elevation={3}
        sx={{
          position: "absolute",
          top: 20,
          right: 20,
          zIndex: 10,
          padding: "6px 12px",
          borderRadius: "20px",
          display: "flex",
          alignItems: "center",
          gap: 1,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          color: "#fff",
        }}
      >
        <PeopleIcon fontSize="small" />
        <Typography variant="body2">{participantCount}</Typography>
      </Paper>

      {/* Recording controls */}
      <Paper
        elevation={3}
        sx={{
          position: "absolute",
          top: 70,
          right: 20,
          zIndex: 10,
          padding: "6px 12px",
          borderRadius: "20px",
          display: "flex",
          alignItems: "center",
          gap: 1,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          color: "#fff",
        }}
      >
        {!isRecording ? (
          <Tooltip title="Start Recording">
            <IconButton
              size="small"
              onClick={handleStartRecording}
              sx={{ color: "#fff" }}
            >
              <FiberManualRecordIcon sx={{ color: "error.main" }} />
            </IconButton>
          </Tooltip>
        ) : (
          <>
            <Tooltip
              title={isRecordingPaused ? "Resume Recording" : "Pause Recording"}
            >
              <IconButton
                size="small"
                onClick={handlePauseResumeRecording}
                sx={{ color: "#fff" }}
              >
                <PauseCircleOutlineIcon
                  sx={{
                    color: isRecordingPaused ? "warning.main" : "primary.main",
                  }}
                />
              </IconButton>
            </Tooltip>
            <Tooltip title="Stop Recording">
              <IconButton
                size="small"
                onClick={handleStopRecording}
                sx={{ color: "#fff" }}
              >
                <StopCircleIcon sx={{ color: "error.main" }} />
              </IconButton>
            </Tooltip>
            <Typography variant="body2" sx={{ ml: 1 }}>
              {isRecordingPaused ? "Paused" : "Recording"}
            </Typography>
          </>
        )}
      </Paper>

      <AgoraUIKit
        styleProps={{
          theme: theme.palette.primary.main,
          UIKitContainer: {
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
          },
          gridVideoContainer: {
            gap: "10px",
            padding: "10px",
          },
          gridVideoCells: {
            borderRadius: "15px",
            overflow: "hidden",
          },
          localBtnContainer: {
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            borderRadius: "16px",
            padding: "10px",
            margin: "0 auto 20px auto",
          },
          remoteBtnContainer: {
            backgroundColor: "rgba(0, 0, 0, 0.4)",
          },
        }}
        callbacks={{
          EndCall: handleCallEnd,
          "user-joined": handleUserJoined,
          "user-left": handleUserLeft,
        }}
        rtcProps={{
          uid:
            parseInt(String(agoraRtcConfig.uid).replace(/[^\d]/g, "")) %
              10000 || Math.floor(Math.random() * 9999) + 1,
          token: agoraRtcConfig.token,
          appId: appId,
          channel: agoraRtcConfig.channel,
          layout: layout.grid,
          enableScreensharing: true,
          disableRtm: false,
        }}
        rtmProps={{
          username: currentUser?.userName || currentUser?.email,
          displayUsername: true,
          token: agoraRtmConfig.token,
          uid: agoraRtmConfig.uid,
        }}
      />
    </Box>
  );
};

export default VideoCallView;
