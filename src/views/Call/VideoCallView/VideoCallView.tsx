import { useTheme } from "@mui/material";
import AgoraUIKit, { layout } from "agora-react-uikit";
import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../../store";

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
  const navigate = useNavigate();
  const currentUser = useSelector((state: RootState) => state.user.currentUser);

  return (
    <AgoraUIKit
      styleProps={{
        theme: theme.palette.primary.main,
        UIKitContainer: {
          position: "absolute",
          inset: 0,
          width: "100%",
        },
        gridVideoContainer: {
          gap: "10px",
          padding: "10px",
        },
        gridVideoCells: {
          borderRadius: "15px",
          overflow: "hidden",
        },
      }}
      callbacks={{
        EndCall: () => {
          onCallEndClick && onCallEndClick();
          navigate("..");
        },
      }}
      rtcProps={{
        uid: agoraRtcConfig.uid,
        token: agoraRtcConfig.token,
        appId: appId,
        channel: agoraRtcConfig.channel,
        layout: layout.grid,
      }}
      rtmProps={{
        username: currentUser?.userName || currentUser?.email,
        displayUsername: true,
        token: agoraRtmConfig.token,
        uid: agoraRtmConfig.uid,
      }}
    />
  );
};

export default VideoCallView;
