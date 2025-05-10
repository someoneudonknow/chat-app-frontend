import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Snackbar,
  Typography,
} from "@mui/material";
import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CallMediaType } from "../../models/call.model";
import VideoCallView from "./VideoCallView";
import { useSocket } from "../../hooks";
import { CallEventName } from "../../constants/types";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { SlideIn } from "../../components/Transitions";
import { CallService } from "../../services";
import { BASE_URL } from "../../constants/api-endpoints";
import { useCall } from "../../contexts/CallContext";

type CalleeInfo = {
  name: string;
  avatar?: string;
  id: string;
};

const callService = new CallService(BASE_URL);

const Call: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [callees, setCallees] = useState<string[]>([]);
  const [callNoti, setCallNoti] = useState<string | null>();
  const [error, setError] = useState<string | null>(null);
  const [isCallActive, setIsCallActive] = useState<boolean>(true);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  const [reconnectAttempts, setReconnectAttempts] = useState<number>(0);
  const navigate = useNavigate();

  const rtcToken = decodeURIComponent(searchParams.get("rtc_token") || "");
  const rtmToken = decodeURIComponent(searchParams.get("rtm_token") || "");
  const rtcUid = decodeURIComponent(searchParams.get("rtc_uid") || "");
  const rtmUid = decodeURIComponent(searchParams.get("rtm_uid") || "");
  const channel = decodeURIComponent(searchParams.get("channel") || "");
  const callId = decodeURIComponent(searchParams.get("call_id") || "");
  const mediaType = decodeURIComponent(
    searchParams.get("media_type") || ""
  ) as CallMediaType;
  const appId = import.meta.env.VITE_AGORA_APP_ID;

  const { socket } = useSocket();
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const { currentCallId } = useCall();

  // Validate required parameters and ensure call consistency
  useEffect(() => {
    const validateCall = async () => {
      try {
        setIsInitializing(true);

        // Check for missing parameters
        if (!rtcToken || !rtmToken || !channel || !callId || !appId) {
          setError("Missing required call parameters");
          setIsCallActive(false);
          return;
        }

        // Ensure the call in context matches the current call
        if (currentCallId && currentCallId !== callId) {
          setError("Call mismatch - this call may have been ended or replaced");
          setIsCallActive(false);
          return;
        }

        // Validate call exists on server
        try {
          const response = await callService.getCallInfo(callId);
          if (response.status !== 200) {
            throw new Error("Call not found or has ended");
          }

          // Check if call has already ended
          if (response.metadata.status === "ENDED") {
            setError("This call has already ended");
            setIsCallActive(false);
            return;
          }
        } catch (err) {
          console.error("Error validating call:", err);
          setError("Unable to validate call status. The call may have ended.");
          setIsCallActive(false);
          return;
        }

        setIsInitializing(false);
      } catch (err) {
        console.error("Call initialization error:", err);
        setError("Failed to initialize call");
        setIsCallActive(false);
        setIsInitializing(false);
      }
    };

    validateCall();
  }, [rtcToken, rtmToken, channel, callId, appId, currentCallId, callService]);

  // Handle socket connection and events
  useEffect(() => {
    if (!socket || !currentUser || !callId || !isCallActive) return;

    const setupCallConnection = () => {
      // Setup call on connection
      socket.emit(CallEventName.SETUP, {
        callId,
        user: {
          id: currentUser?._id,
          name: currentUser?.userName || currentUser?.email,
          avatar: currentUser?.photo,
        },
      });
    };

    // Initial setup
    setupCallConnection();

    // Handle socket reconnection
    const handleReconnect = () => {
      if (reconnectAttempts < 3) {
        setCallNoti("Reconnecting to call...");
        setupCallConnection();
        setReconnectAttempts((prev) => prev + 1);
      } else {
        setError("Unable to reconnect to call after multiple attempts");
        setIsCallActive(false);
      }
    };

    // Handle call events
    socket.on(CallEventName.CALL_REJECTED, ({ user }: { user: CalleeInfo }) => {
      setCallNoti(`${user.name} has rejected the call`);
    });

    socket.on(CallEventName.CALLEE_JOINED, (payload) => {
      setCallNoti(`${payload.name} has joined the call`);
    });

    socket.on(CallEventName.CALLEE_LEFT, (user: CalleeInfo) => {
      setCallNoti(`${user.name} has left the call`);
    });

    socket.on(CallEventName.CALLEES_CHANGED, (payload) => {
      setCallees(payload);

      if (payload.length <= 1 && payload.includes(currentUser._id)) {
        setCallNoti("You're the only participant in this call");
      }
    });

    socket.on("reconnect", handleReconnect);
    socket.on("connect_error", () => {
      setCallNoti("Connection error. Attempting to reconnect...");
    });

    return () => {
      socket.off(CallEventName.CALL_REJECTED);
      socket.off(CallEventName.CALLEE_JOINED);
      socket.off(CallEventName.CALLEE_LEFT);
      socket.off(CallEventName.CALLEES_CHANGED);
      socket.off("reconnect");
      socket.off("connect_error");
    };
  }, [socket, callId, currentUser, isCallActive, reconnectAttempts]);

  const handleCallEndClicked = useCallback(async () => {
    if (!currentUser || !callId) return;

    try {
      setIsCallActive(false);

      if (callees.length <= 1) {
        await callService.endCall({ callId: callId });
      } else {
        const userData = {
          name: currentUser?.userName || currentUser?.email,
          id: currentUser._id,
        };

        socket?.emit(CallEventName.CALLEE_LEAVE, { callId, user: userData });
      }

      navigate("/user/chat");
    } catch (error) {
      console.error("Error ending call:", error);
      // Even if there's an error, try to navigate back to chat
      navigate("/user/chat");
    }
  }, [callId, callees, currentUser, navigate, socket]);

  // Handle browser back button or navigation away from call
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isCallActive && callId && currentUser) {
        const userData = {
          name: currentUser?.userName || currentUser?.email,
          id: currentUser._id,
        };
        socket?.emit(CallEventName.CALLEE_LEAVE, { callId, user: userData });
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);

      if (isCallActive && callId && currentUser && socket) {
        const userData = {
          name: currentUser?.userName || currentUser?.email,
          id: currentUser._id,
        };
        socket.emit(CallEventName.CALLEE_LEAVE, { callId, user: userData });
      }
    };
  }, [callId, currentUser, isCallActive, socket]);

  // Handle navigation with history API
  useEffect(() => {
    const handlePopState = () => {
      handleCallEndClicked();
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [handleCallEndClicked]);

  if (isInitializing) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          width: "100vw",
          bgcolor: "background.paper",
        }}
      >
        <CircularProgress color="primary" size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Initializing call...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          width: "100vw",
          bgcolor: "background.paper",
          p: 3,
        }}
      >
        <Typography variant="h5" color="error" gutterBottom>
          Call Error
        </Typography>
        <Typography align="center" sx={{ mb: 3 }}>
          {error}
        </Typography>
        <Box mt={2} display="flex" gap={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/user/chat")}
          >
            Return to Chat
          </Button>
          {error.includes("ended") && (
            <Button
              variant="outlined"
              onClick={() => {
                navigate("/user/chat");
                // Add any logic to start a new call if needed
              }}
            >
              Start New Call
            </Button>
          )}
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={!!callNoti}
        autoHideDuration={3000}
        onClose={() => setCallNoti(null)}
        onAnimationEnd={() => setCallNoti(null)}
        TransitionComponent={SlideIn}
      >
        <Alert severity="info" variant="standard">
          {callNoti}
        </Alert>
      </Snackbar>

      {isCallActive && mediaType === "VIDEO_CALL" && (
        <VideoCallView
          onCallEndClick={handleCallEndClicked}
          appId={appId}
          agoraRtcConfig={{ token: rtcToken, uid: rtcUid, channel }}
          agoraRtmConfig={{ token: rtmToken, uid: rtmUid, channel }}
        />
      )}
    </Box>
  );
};

export default Call;
