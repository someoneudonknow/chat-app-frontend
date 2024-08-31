import { Alert, Box, Snackbar } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CallMediaType } from "../../models/call.model";
import VoiceCallView from "./VoiceCallView";
import VideoCallView from "./VideoCallView";
import { useSocket } from "../../hooks";
import { CallEventName } from "../../constants/types";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { SlideIn } from "../../components/Transitions";
import { CallService } from "../../services";
import { BASE_URL } from "../../constants/api-endpoints";

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

  useEffect(() => {
    socket?.emit(CallEventName.SETUP, {
      callId,
      user: {
        id: currentUser?._id,
        name: currentUser?.userName || currentUser?.email,
        avatar: currentUser?.photo,
      },
    });

    socket?.on(
      CallEventName.CALL_REJECTED,
      ({ user }: { user: CalleeInfo }) => {
        setCallNoti(`${user.name} has rejected the call`);
      }
    );

    socket?.on(CallEventName.CALLEE_JOINED, (payload) => {
      setCallNoti(`${payload.name} has joined the call`);
    });

    socket?.on(CallEventName.CALLEE_LEFT, (user: CalleeInfo) => {
      setCallNoti(`${user.name} has left the call`);
    });

    socket?.on(CallEventName.CALLEES_CHANGED, (payload) => {
      setCallees(payload);
      console.log(payload);
    });

    return () => {
      socket?.off(CallEventName.CALL_REJECTED);
      socket?.off(CallEventName.CALLEE_JOINED);
      socket?.off(CallEventName.CALLEE_LEFT);
      socket?.off(CallEventName.CALLEES_CHANGED);
    };
  }, [socket, callId, currentUser]);

  const handleCallEndClicked = async () => {
    if (currentUser) {
      if (callees.length === 1) {
        await callService.endCall({ callId: callId });
      } else {
        const userData = {
          name: currentUser?.userName || currentUser?.email,
          id: currentUser._id,
        };

        socket?.emit(CallEventName.CALLEE_LEAVE, { callId, user: userData });
      }
    }
  };

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
      {mediaType === "AUDIO_CALL" && (
        <VoiceCallView
          onCallEndClick={handleCallEndClicked}
          appId={appId}
          agoraRtcConfig={{ token: rtcToken, uid: rtcUid, channel }}
          agoraRtmConfig={{ token: rtmToken, uid: rtmUid, channel }}
        />
      )}
      {mediaType === "VIDEO_CALL" && (
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
