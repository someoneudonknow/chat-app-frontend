import {
  Avatar,
  AvatarGroup,
  Box,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import React, { useContext, useMemo } from "react";
import SquareTooltipIconButton from "../UIs/SquareTootltipIconButton";
import { Call, MoreHoriz, VideoCall } from "@mui/icons-material";
import { motion } from "framer-motion";
import {
  Conservation,
  ConservationType,
} from "../../models/conservation.model";
import { getConservationItemInfo } from "../../utils";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import MessageSearchBox from "./MessageSearchBox";
import { useChatRoom } from "./context/ChatRoomProvider";
import { CallService } from "../../services";
import { BASE_URL } from "../../constants/api-endpoints";
import { useSocket } from "../../hooks";
import { CallEventName, IncommingCallInfo } from "../../constants/types";
import { ConservationItem } from "../Conservation";
import { toast } from "react-toastify";
import { useCall } from "../../contexts/CallContext";

type ChatRoomHeaderPropsType = {
  conservation: Conservation;
  onShowSideBarClick?: () => void;
};

const callService = new CallService(BASE_URL);

const ChatRoomHeader: React.FC<ChatRoomHeaderPropsType> = ({
  conservation,
  onShowSideBarClick,
}) => {
  const currentUserId = useSelector(
    (state: RootState) => state.user.currentUser?._id
  );
  const { socket } = useSocket();
  const chatRoomCtx = useChatRoom();
  const conservationInfo = getConservationItemInfo(conservation, currentUserId);
  const { startCall } = useCall();

  const onlineState = useMemo<string>(() => {
    switch (conservation.type) {
      case ConservationType.INBOX: {
        const isUserOnline = conservation.members.find(
          (m) => m.user._id !== currentUserId
        )?.user.isOnline;

        return isUserOnline ? "Online" : "Offline";
      }
      case ConservationType.GROUP: {
        const numberOfOnlineUser = conservation.members.reduce((a, m) => {
          const isUserOnline = m.user._id !== currentUserId && m.user.isOnline;

          if (isUserOnline) return a + 1;
          else return a;
        }, 0);

        if (numberOfOnlineUser <= 0) return "No ones are online at this time.";

        return `There are ${numberOfOnlineUser} users online`;
      }
      default:
        return "Offline";
    }
  }, [conservation, currentUserId]);

  const handleVoiceCallClick = async () => {
    try {
      const { status, metadata } = await callService.initCall({
        conservationId: conservation._id,
        mediaType: "AUDIO_CALL",
      });

      if (status === 200) {
        const { call, channel, rtcToken, rtmToken, rtcUid, rtmUid } = metadata;

        socket?.emit(CallEventName.CREATE_CALL, {
          conservationId: conservation._id,
          callerId: currentUserId,
          from: conservationInfo?.name,
          avatar: conservationInfo?.cover,
          callId: call._id,
          channelName: channel,
          mediaType: call.mediaType,
        });

        startCall({
          callId: call._id,
          rtcToken,
          rtmToken,
          channel,
          rtcUid,
          rtmUid,
          mediaType: call.mediaType,
          type: call.type,
        });
      }
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const handleVideoCallClick = async () => {
    try {
      const { status, metadata } = await callService.initCall({
        conservationId: conservation._id,
        mediaType: "VIDEO_CALL",
      });

      if (status === 200) {
        const { call, channel, rtcToken, rtmToken, rtcUid, rtmUid } = metadata;

        socket?.emit(CallEventName.CREATE_CALL, {
          conservationId: conservation._id,
          callerId: currentUserId,
          from: conservationInfo?.name,
          avatar: conservationInfo?.cover,
          callId: call._id,
          channelName: channel,
          mediaType: call.mediaType,
        });

        startCall({
          callId: call._id,
          rtcToken,
          rtmToken,
          channel,
          rtcUid,
          rtmUid,
          mediaType: call.mediaType,
          type: call.type,
        });
      }
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <motion.div
      style={{ position: "relative" }}
      initial={{ y: -40 }}
      animate={{ y: 0 }}
    >
      <Paper
        sx={{
          boxShadow: 2,
          display: "flex",
          justifyContent: "space-between",
          p: 2,
        }}
      >
        <Box sx={{ display: "flex", gap: "15px", alignItems: "center" }}>
          {!conservationInfo?.cover && <Avatar />}
          {conservationInfo?.cover &&
            Array.isArray(conservationInfo?.cover) && (
              <AvatarGroup>
                {conservationInfo.cover.map((avt) => (
                  <Avatar src={avt || undefined} />
                ))}
              </AvatarGroup>
            )}
          {conservationInfo?.cover &&
            typeof conservationInfo?.cover === "string" && (
              <Avatar src={conservationInfo?.cover} />
            )}
          <Box>
            <Typography sx={{ fontSize: "18px" }}>
              {conservationInfo?.name}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontSize: "13px",
                color: (theme) =>
                  onlineState !== "Offline" ? theme.palette.success.main : "",
              }}
            >
              {onlineState}
            </Typography>
          </Box>
        </Box>
        <Stack spacing={2} direction="row">
          <SquareTooltipIconButton
            placement="bottom"
            sx={{ borderRadius: "50%", aspectRatio: 1 / 1 }}
            title="Audio call"
            color="info"
            onClick={handleVoiceCallClick}
          >
            <Call />
          </SquareTooltipIconButton>
          <SquareTooltipIconButton
            onClick={handleVideoCallClick}
            placement="bottom"
            sx={{ borderRadius: "50%", aspectRatio: 1 / 1 }}
            title="Video call"
            color="info"
          >
            <VideoCall />
          </SquareTooltipIconButton>
          <IconButton
            sx={{ aspectRatio: 1 / 1 }}
            onClick={() => onShowSideBarClick && onShowSideBarClick()}
          >
            <MoreHoriz />
          </IconButton>
        </Stack>
      </Paper>
      {chatRoomCtx.searchMessageShow && <MessageSearchBox />}
    </motion.div>
  );
};

export default ChatRoomHeader;
