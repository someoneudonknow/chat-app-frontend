import {
  Avatar,
  AvatarGroup,
  Box,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useContext, useMemo } from "react";
import SquareTooltipIconButton from "../UIs/SquareTootltipIconButton";
import { MoreHoriz, VideoCall } from "@mui/icons-material";
import { motion } from "framer-motion";
import {
  Conservation,
  ConservationType,
  ConservationMember,
} from "../../models/conservation.model";
import { getConservationItemInfo } from "../../utils";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import MessageSearchBox from "./MessageSearchBox";
import { useChatRoom } from "./context/ChatRoomProvider";
import { CallService } from "../../services";
import { BASE_URL } from "../../constants/api-endpoints";
import { useSocket } from "../../hooks";
import { CallEventName } from "../../constants/types";
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
  const conservationInfo = getConservationItemInfo(
    conservation,
    currentUserId || ""
  );
  const { startCall } = useCall();

  const onlineState = useMemo<string>(() => {
    switch (conservation.type) {
      case ConservationType.INBOX: {
        const member = conservation.members.find((m) => {
          if (typeof m === "string") return false;
          const member = m as ConservationMember;
          return member.user && member.user._id !== currentUserId;
        }) as ConservationMember | undefined;

        return member?.user.isOnline ? "Online" : "Offline";
      }
      case ConservationType.GROUP: {
        const numberOfOnlineUser = conservation.members.reduce((count, m) => {
          if (typeof m === "string") return count;

          const member = m as ConservationMember;
          if (
            member.user &&
            member.user._id !== currentUserId &&
            member.user.isOnline
          ) {
            return count + 1;
          }
          return count;
        }, 0);

        if (numberOfOnlineUser <= 0) return "No ones are online at this time.";

        return `There are ${numberOfOnlineUser} users online`;
      }
      default:
        return "Offline";
    }
  }, [conservation, currentUserId]);

  const handleVideoCallClick = async () => {
    try {
      console.log("Initiating video call for conservation:", conservation._id);
      const { status, metadata } = await callService.initCall({
        conservationId: conservation._id,
        mediaType: "VIDEO_CALL",
      });

      if (status === 200) {
        const { call, channel, rtcToken, rtmToken, rtcUid, rtmUid } = metadata;
        console.log("Call initiated successfully:", { call, channel, rtcUid });

        toast.info("Initiating video call...", {
          position: "top-center",
          autoClose: 2000,
        });

        const callPayload = {
          conservationId: conservation._id,
          callerId: currentUserId,
          from: conservationInfo?.name,
          avatar: conservationInfo?.cover,
          callId: call._id,
          channelName: channel,
          mediaType: call.mediaType,
        };

        console.log(
          "Emitting call event:",
          CallEventName.CREATE_CALL,
          callPayload
        );
        socket?.emit(CallEventName.CREATE_CALL, callPayload);

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
      console.error("Failed to start video call:", e);
      toast.error(e.message || "Failed to start video call");
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
                {conservationInfo.cover.map((avt, index) => (
                  <Avatar key={index} src={avt || undefined} />
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
          <Tooltip title="Start video call" placement="bottom">
            <SquareTooltipIconButton
              onClick={handleVideoCallClick}
              placement="bottom"
              sx={{
                borderRadius: "50%",
                aspectRatio: 1 / 1,
                backgroundColor: (theme) => theme.palette.primary.main,
                color: "#fff",
                "&:hover": {
                  backgroundColor: (theme) => theme.palette.primary.dark,
                },
              }}
              title="Video call"
              color="inherit"
            >
              <VideoCall />
            </SquareTooltipIconButton>
          </Tooltip>
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
