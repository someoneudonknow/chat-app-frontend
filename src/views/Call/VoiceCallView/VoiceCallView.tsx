import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import AgoraRTC, {
  IAgoraRTCClient,
  IAgoraRTCRemoteUser,
  ILocalTrack,
  UID,
} from "agora-rtc-sdk-ng";
import { Box, IconButton, Paper } from "@mui/material";
import { toast } from "react-toastify";
import { CallEnd, Mic, MicOff } from "@mui/icons-material";
import { CallActionButton } from "../../../components/Calls/IcomingCallSnackBar/IncomingCallSnackBar";
import { VoiceCallParticipantCard } from "../../../components/CallParticipantCard";
import AgoraRTM, { RtmChannel, RtmClient } from "agora-rtm-sdk";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { useNavigate } from "react-router-dom";
import { ConservationRole } from "../../../models/conservation.model";

type AgoraMediaType = "video" | "audio" | "datachannel";

type ParticipantInfo = {
  rtcUid: string;
  rtmUid: string;
  name: string;
  avatar: string;
  mic: boolean;
};

type VoiceCallViewPropsType = {
  appId: string;
  onCallEndClick?: () => void;
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

const VoiceCallView: React.FC<VoiceCallViewPropsType> = ({
  agoraRtcConfig,
  agoraRtmConfig,
  appId,
  onCallEndClick,
}) => {
  const rtcClientRef = useRef<IAgoraRTCClient>();
  const rtmClientRef = useRef<RtmClient>();
  const localAudioTrackRef = useRef<ILocalTrack>();
  const rtmChannelRef = useRef<RtmChannel>();
  const remoteAudioTracksRef = useRef<
    | {
        [k: string]: [IAgoraRTCRemoteUser["audioTrack"]];
      }
    | object
  >({});
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const [participant, setParticipant] = useState<ParticipantInfo[]>([]);
  const [participantsVolumeIndicator, setParticipantsVolumeIndicator] =
    useState<{ [k: string]: number } | object>({});
  const [micOn, setMicOn] = useState<boolean>(true);
  const iconSize = 60;
  const userCount = 2;
  const colWidth = Math.max(100 / userCount, 100 / 6);
  const gap = 16;
  const navigate = useNavigate();

  const handleVolumeIndicator = useCallback(
    (volumes: { level: number; uid: UID }[]) => {
      volumes.forEach((volume) => {
        setParticipantsVolumeIndicator((prev) => ({
          ...prev,
          [volume.uid.toString()]: volume.level,
        }));
      });
    },
    []
  );

  const handleToggleMic = () => {
    setMicOn((prev) => !prev);
  };

  const handleUserJoined = useCallback(async (memberId: string) => {
    if (rtmClientRef.current) {
      const { rtcUid, name, avatar } =
        await rtmClientRef.current.getUserAttributesByKeys(memberId, [
          "name",
          "avatar",
          "rtcUid",
        ]);

      setParticipant((prev) => [
        ...prev,
        { rtmUid: memberId, rtcUid, name, avatar, mic: true },
      ]);
    }
  }, []);

  const handleUserLeft = useCallback(async (memberId: string) => {
    setParticipant((prev) => {
      const foundMember = prev.find((p) => p.rtmUid === memberId);

      if (foundMember) {
        delete remoteAudioTracksRef.current[foundMember.rtcUid];
      }

      return prev.filter((p) => p.rtmUid !== memberId);
    });
  }, []);

  const handleUserUnPublished = useCallback(
    async (user: IAgoraRTCRemoteUser, mediaType: AgoraMediaType) => {
      if (mediaType === "audio") {
        setParticipant((prev) => {
          const foundParticipant = prev.find(
            (p) => p.rtcUid === user.uid.toString()
          );

          if (foundParticipant) {
            foundParticipant.mic = false;
          }

          return prev;
        });
      }
    },
    []
  );

  const handleUserPublished = useCallback(
    async (user: IAgoraRTCRemoteUser, mediaType: AgoraMediaType) => {
      if (rtcClientRef.current) {
        await rtcClientRef.current.subscribe(user, mediaType);

        if (mediaType === "audio") {
          user.audioTrack?.play();

          remoteAudioTracksRef.current[user.uid.toString()] = [user.audioTrack];

          setParticipant((prev) => {
            const foundParticipant = prev.find(
              (p) => p.rtcUid === user.uid.toString()
            );

            if (foundParticipant) {
              foundParticipant.mic = true;
            }

            return prev;
          });
        }
      }
    },
    []
  );

  const leave = useCallback(async () => {
    if (localAudioTrackRef.current) {
      localAudioTrackRef.current.stop();
      localAudioTrackRef.current.close();
    }

    if (rtcClientRef.current) {
      try {
        await rtcClientRef.current.unpublish();
        await rtcClientRef.current.leave();
      } catch (e) {
        console.error(e);
      }
    }

    if (rtmChannelRef.current) {
      try {
        await rtmChannelRef.current.leave();
      } catch (e) {
        console.error(e);
      }
    }

    if (rtmClientRef.current) {
      try {
        await rtmClientRef.current.logout();
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const initRtm = useCallback(async () => {
    try {
      const rtmInstance = AgoraRTM.createInstance(appId);

      await rtmInstance.login({
        uid: agoraRtmConfig.uid,
        token: agoraRtmConfig.token,
      });

      const newChannel = rtmInstance.createChannel(agoraRtmConfig.channel);

      await newChannel.join();

      if (currentUser) {
        await rtmInstance.addOrUpdateLocalUserAttributes({
          name: currentUser?.userName || currentUser.email,
          avatar: currentUser.photo || "",
          rtcUid: agoraRtcConfig.uid,
        });
      }

      const members = await newChannel.getMembers();

      const memberInfos = (await Promise.all(
        members.map(async (mid) => {
          const memberInfo = await rtmInstance.getUserAttributesByKeys(mid, [
            "name",
            "avatar",
            "rtcUid",
          ]);

          return {
            ...memberInfo,
            rtmUid: mid,
            mic: true,
          };
        })
      )) as ParticipantInfo[];

      setParticipant(memberInfos);

      newChannel.on("MemberJoined", handleUserJoined);
      newChannel.on("MemberLeft", handleUserLeft);

      rtmClientRef.current = rtmInstance;
      rtmChannelRef.current = newChannel;
    } catch (e: any) {
      console.error(e);
    }
    //eslint-disable-next-line
  }, [currentUser, handleUserJoined, handleUserLeft]);

  const initVolumeIndicator = useCallback(() => {
    if (rtcClientRef.current) {
      rtcClientRef.current.enableAudioVolumeIndicator();
      rtcClientRef.current.on("volume-indicator", handleVolumeIndicator);
    }
  }, [handleVolumeIndicator]);

  const initRtc = useCallback(async () => {
    rtcClientRef.current = AgoraRTC.createClient({
      mode: "rtc",
      codec: "vp8",
    });

    AgoraRTC.setLogLevel(3);

    try {
      await rtcClientRef.current.join(
        appId,
        agoraRtcConfig.channel,
        agoraRtcConfig.token,
        agoraRtcConfig.uid
      );

      rtcClientRef.current.on("user-published", handleUserPublished);
      rtcClientRef.current.on("user-unpublished", handleUserUnPublished);

      const createdLocalAudioTrack =
        await AgoraRTC.createMicrophoneAudioTrack();

      await rtcClientRef.current.publish([createdLocalAudioTrack]);

      localAudioTrackRef.current = createdLocalAudioTrack;

      initVolumeIndicator();
    } catch (e: any) {
      toast.error(e.message);
    }

    rtcClientRef.current.on("exception", (e) => {
      toast.error(e.msg);
    });

    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    (async () => {
      if (!rtcClientRef.current) {
        await initRtc();
      }
      if (!rtmChannelRef.current) {
        await initRtm();
      }
    })();

    return () => {
      (async () => {
        if (rtcClientRef.current && rtmChannelRef.current) {
          await leave();
        }
      })();
    };
  }, [leave, initRtc, initRtm]);

  useEffect(() => {
    if (localAudioTrackRef.current) {
      if (micOn) {
        localAudioTrackRef.current.setMuted(false);
      } else {
        localAudioTrackRef.current.setMuted(true);
      }
    }
  }, [micOn]);

  const handleEndCall = useCallback(async () => {
    onCallEndClick && onCallEndClick();
    navigate("..");
  }, [navigate, onCallEndClick]);

  return (
    <Box
      component="div"
      sx={{ width: "100%", height: "100%", display: "flex" }}
    >
      <Box
        component="div"
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          component="div"
          sx={{
            flex: 1,
            p: 2,
            display: "flex",
            gap: `${gap}px`,
            width: "100%",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {participant.map((p) => (
            <Box
              key={p.rtcUid}
              sx={{
                width: `calc(${colWidth}% - ${gap}px)`,
                textAlign: "center",
              }}
            >
              <VoiceCallParticipantCard
                micOff={!p.mic}
                name={p.name}
                avatar={p.avatar}
                isTalked={participantsVolumeIndicator[p.rtcUid] > 40}
              />
            </Box>
          ))}
        </Box>
        <Paper
          sx={{
            width: "100%",
            p: 2,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 20,
          }}
        >
          <IconButton
            onClick={handleToggleMic}
            sx={{ height: `${iconSize}px`, width: `${iconSize}px` }}
          >
            {micOn && <Mic sx={{ fontSize: "30px" }} />}
            {!micOn && <MicOff sx={{ fontSize: "30px" }} />}
          </IconButton>
          <CallActionButton
            onClick={handleEndCall}
            sizes={60}
            variant="contained"
            color="error"
          >
            <CallEnd sx={{ fontSize: "30px" }} />
          </CallActionButton>
        </Paper>
      </Box>
      {/* <Paper sx={{ width: "350px", height: "100%" }}></Paper> */}
    </Box>
  );
};

const MemorizedVoiceCallView = memo(VoiceCallView);

export default MemorizedVoiceCallView;
