import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useRef,
} from "react";
import { useSocket } from "../hooks";
import { CallEventName, IncommingCallInfo } from "../constants/types";
import { Call, CallMediaType, CallType } from "../models/call.model";
import { CallService } from "../services";
import { BASE_URL } from "../constants/api-endpoints";
import { IncomingCallSnackBar } from "../components/Calls";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store";

type StartCallFuncParams = {
  rtcToken: string;
  rtmToken: string;
  channel: string;
  rtcUid: string;
  rtmUid: string;
  type: CallType;
  mediaType: CallMediaType;
  callId: Call["_id"];
};

type CallContextType = {
  startCall: (payload: StartCallFuncParams) => void;
  acceptCall: (payload: { callId: Call["_id"] }) => void;
  rejectCall: (callId: Call["_id"]) => void;
  endCurrentCall: () => Promise<void>;
  startRecording: (params: {
    uid: string;
    channelName: string;
  }) => Promise<boolean>;
  pauseRecording: () => Promise<boolean>;
  stopRecording: () => Promise<boolean>;
  isInCall: boolean;
  currentCallId: string | null;
  callStatus: "idle" | "connecting" | "connected" | "reconnecting" | "error";
  callError: string | null;
  isRecording: boolean;
  isRecordingPaused: boolean;
};

type CallContextProviderPropsType = {
  children: ReactNode;
};

const initVal: CallContextType = {
  startCall: () => {},
  acceptCall: () => {},
  rejectCall: () => {},
  endCurrentCall: async () => {},
  startRecording: async () => false,
  pauseRecording: async () => false,
  stopRecording: async () => false,
  isInCall: false,
  currentCallId: null,
  callStatus: "idle",
  callError: null,
  isRecording: false,
  isRecordingPaused: false,
};

export const CallContext = createContext(initVal);

const callService = new CallService(BASE_URL);

const CallProvider: React.FC<CallContextProviderPropsType> = ({ children }) => {
  const [incommingCall, setIncommingCall] = useState<IncommingCallInfo | null>(
    null
  );
  const [isInCall, setIsInCall] = useState<boolean>(false);
  const [currentCallId, setCurrentCallId] = useState<string | null>(null);
  const [callStatus, setCallStatus] = useState<
    "idle" | "connecting" | "connected" | "reconnecting" | "error"
  >("idle");
  const [callError, setCallError] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isRecordingPaused, setIsRecordingPaused] = useState<boolean>(false);
  const reconnectAttempts = useRef<number>(0);
  const maxReconnectAttempts = 3;

  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const { socket } = useSocket();
  const navigate = useNavigate();

  useEffect(() => {
    const handleDisconnect = () => {
      if (isInCall) {
        setCallStatus("reconnecting");
        toast.warning("Connection lost. Attempting to reconnect...", {
          position: "top-center",
          autoClose: false,
          toastId: "call-reconnect",
        });
      }
    };

    const handleReconnect = () => {
      if (isInCall) {
        reconnectAttempts.current += 1;

        if (reconnectAttempts.current <= maxReconnectAttempts) {
          toast.update("call-reconnect", {
            render: "Reconnecting to call...",
            type: "info",
            autoClose: 2000,
          });

          if (currentCallId && socket && currentUser) {
            socket.emit(CallEventName.SETUP, {
              callId: currentCallId,
              user: {
                id: currentUser._id,
                name: currentUser?.userName || currentUser?.email,
                avatar: currentUser?.photo,
              },
            });
            setCallStatus("connected");
          }
        } else {
          toast.update("call-reconnect", {
            render: "Failed to reconnect after multiple attempts",
            type: "error",
            autoClose: 3000,
          });
          setCallStatus("error");
          setCallError("Connection lost. Unable to reconnect to the call.");
          endCall(currentCallId);
        }
      }
    };

    socket?.on("disconnect", handleDisconnect);
    socket?.on("reconnect", handleReconnect);

    return () => {
      socket?.off("disconnect", handleDisconnect);
      socket?.off("reconnect", handleReconnect);
    };
  }, [socket, isInCall, currentCallId, currentUser]);

  useEffect(() => {
    const handleNewCall = (payload: IncommingCallInfo) => {
      console.log("New call received:", payload);
      if (!isInCall) {
        setIncommingCall(payload);
      } else {
        if (currentUser && payload.callId) {
          console.log("Already in a call, rejecting new call");
          socket?.emit(CallEventName.CALL_REJECT, {
            callId: payload.callId,
            user: currentUser,
          });
        }
      }
    };

    const handleCallEnd = (payload: string) => {
      console.log("Call ended:", payload, "Current call:", currentCallId);
      if (payload === currentCallId) {
        cleanupCall();

        toast.info("Call has ended", {
          position: "top-center",
          autoClose: 3000,
        });

        if (window.location.pathname.includes("/call")) {
          navigate("/user/chat");
        }
      }
      setIncommingCall(null);
    };

    if (socket) {
      console.log("Setting up socket listeners for calls");
      socket.on(CallEventName.NEW_CALL_ARRIVED, handleNewCall);
      socket.on(CallEventName.CALL_END, handleCallEnd);
    }

    return () => {
      if (socket) {
        console.log("Removing socket listeners for calls");
        socket.off(CallEventName.NEW_CALL_ARRIVED, handleNewCall);
        socket.off(CallEventName.CALL_END, handleCallEnd);
      }
    };
  }, [socket, currentUser, isInCall, currentCallId, navigate]);

  const cleanupCall = useCallback(() => {
    setIsInCall(false);
    setCurrentCallId(null);
    setCallStatus("idle");
    setCallError(null);
    setIsRecording(false);
    setIsRecordingPaused(false);
    reconnectAttempts.current = 0;
  }, []);

  // TODO: fix remote cannot receive new call noti in second time
  const startCall = useCallback(
    ({
      rtcToken,
      rtmToken,
      channel,
      rtcUid,
      rtmUid,
      type,
      mediaType,
      callId,
    }: StartCallFuncParams) => {
      try {
        setCallStatus("connecting");
        setIsInCall(true);
        setCurrentCallId(callId);
        reconnectAttempts.current = 0;

        const URL = `/user/call?call_id=${encodeURIComponent(
          callId
        )}&rtc_token=${encodeURIComponent(
          rtcToken
        )}&rtm_token=${encodeURIComponent(
          rtmToken
        )}&channel=${encodeURIComponent(channel)}&rtc_uid=${encodeURIComponent(
          rtcUid
        )}&rtm_uid=${rtmUid}&media_type=${encodeURIComponent(
          mediaType
        )}&type=${encodeURIComponent(type)}`;

        navigate(URL);

        setTimeout(() => {
          if (isInCall) {
            setCallStatus("connected");
          }
        }, 2000);
      } catch (error) {
        console.error("Error starting call:", error);
        setCallStatus("error");
        setCallError("Failed to start call");
        cleanupCall();
      }
    },
    [navigate, cleanupCall]
  );

  const acceptCall = useCallback(
    async ({ callId }: { callId: Call["_id"] }) => {
      try {
        setCallStatus("connecting");

        toast.info("Joining call...", {
          position: "top-center",
          autoClose: 2000,
        });

        const { status, metadata } = await callService.joinCall({ callId });

        if (status === 200) {
          const { call, rtcToken, rtmToken, channel, rtcUid, rtmUid } =
            metadata;

          startCall({
            callId: call._id,
            rtcToken,
            rtmToken,
            channel,
            rtcUid,
            rtmUid,
            type: call.type,
            mediaType: call.mediaType,
          });
        } else {
          throw new Error("Failed to join call");
        }
      } catch (err: any) {
        toast.error(err.message || "Failed to join call");
        setCallStatus("error");
        setCallError(err.message || "Failed to join call");
        cleanupCall();
      }
    },
    [startCall, cleanupCall]
  );

  const rejectCall = useCallback(
    async (callId: Call["_id"]) => {
      if (socket && currentUser) {
        try {
          socket.emit(CallEventName.CALL_REJECT, {
            callId,
            user: currentUser,
          });
        } catch (error) {
          console.error("Error rejecting call:", error);
        }
      }
    },
    [socket, currentUser]
  );

  const endCall = useCallback(
    async (callId: string | null) => {
      if (!callId) return;

      try {
        await callService.endCall({ callId });
      } catch (error) {
        console.error("Error ending call:", error);
      } finally {
        cleanupCall();
      }
    },
    [cleanupCall]
  );

  const startRecording = useCallback(
    async ({ uid, channelName }: { uid: string; channelName: string }) => {
      if (!currentCallId) {
        toast.error("No active call to record");
        return false;
      }

      try {
        const response = await callService.startRecording({
          callId: currentCallId,
          uid,
          channelName,
        });

        if (response.status === 200) {
          setIsRecording(true);
          setIsRecordingPaused(false);
          toast.success("Recording started");
          return true;
        }
        return false;
      } catch (error) {
        console.error("Error starting recording:", error);
        toast.error("Failed to start recording");
        return false;
      }
    },
    [currentCallId]
  );

  const pauseRecording = useCallback(async () => {
    if (!currentCallId || !isRecording) {
      toast.error("No active recording to pause");
      return false;
    }

    try {
      if (isRecordingPaused) {
        const response = await callService.resumeRecording(currentCallId);

        if (response.status === 200) {
          setIsRecordingPaused(false);
          toast.success("Recording resumed");
          return true;
        }
      } else {
        const response = await callService.pauseRecording(currentCallId);

        if (response.status === 200) {
          setIsRecordingPaused(true);
          toast.success("Recording paused");
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error("Error pausing/resuming recording:", error);
      toast.error("Failed to pause/resume recording");
      return false;
    }
  }, [currentCallId, isRecording, isRecordingPaused]);

  const stopRecording = useCallback(async () => {
    if (!currentCallId || !isRecording) {
      toast.error("No active recording to stop");
      return false;
    }

    try {
      const response = await callService.stopRecording(currentCallId);

      if (response.status === 200) {
        setIsRecording(false);
        setIsRecordingPaused(false);
        toast.success("Recording saved successfully");
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error stopping recording:", error);
      toast.error("Failed to stop recording");
      return false;
    }
  }, [currentCallId, isRecording]);

  const endCurrentCall = useCallback(async () => {
    if (!currentCallId || !currentUser) return;

    try {
      setCallStatus("idle");

      if (isRecording) {
        await stopRecording();
      }

      let participants: string[] = [];
      try {
        socket?.emit(
          "calls/get-participants",
          { callId: currentCallId },
          (response: string[]) => {
            participants = response || [];
          }
        );
      } catch (err) {
        console.error("Error getting participants:", err);
      }

      if (participants.length <= 1) {
        await callService.endCall({ callId: currentCallId });
      } else {
        const userData = {
          name: currentUser?.userName || currentUser?.email,
          id: currentUser._id,
        };

        socket?.emit(CallEventName.CALLEE_LEAVE, {
          callId: currentCallId,
          user: userData,
        });
      }

      cleanupCall();

      if (window.location.pathname.includes("/call")) {
        navigate("/user/chat");
      }
    } catch (error) {
      console.error("Error ending current call:", error);
      cleanupCall();

      if (window.location.pathname.includes("/call")) {
        navigate("/user/chat");
      }
    }
  }, [
    currentCallId,
    currentUser,
    socket,
    navigate,
    cleanupCall,
    isRecording,
    stopRecording,
  ]);

  const _value = useMemo(
    () => ({
      startCall,
      acceptCall,
      rejectCall,
      endCurrentCall,
      startRecording,
      pauseRecording,
      stopRecording,
      isInCall,
      currentCallId,
      callStatus,
      callError,
      isRecording,
      isRecordingPaused,
    }),
    [
      startCall,
      acceptCall,
      rejectCall,
      endCurrentCall,
      startRecording,
      pauseRecording,
      stopRecording,
      isInCall,
      currentCallId,
      callStatus,
      callError,
      isRecording,
      isRecordingPaused,
    ]
  );

  return (
    <CallContext.Provider value={_value}>
      {incommingCall && (
        <IncomingCallSnackBar
          handleCallReject={async (cid) => {
            await rejectCall(cid);
            setIncommingCall(null);
          }}
          handleCallAccept={async (cid) => {
            cid && (await acceptCall({ callId: cid }));
            setIncommingCall(null);
          }}
          callId={incommingCall?.callId}
          mediaType={incommingCall?.mediaType}
          from={incommingCall?.from}
          open={!!incommingCall}
          avatars={incommingCall?.avatar}
        />
      )}
      {children}
    </CallContext.Provider>
  );
};

export const useCall = () => useContext(CallContext);

export default CallProvider;
