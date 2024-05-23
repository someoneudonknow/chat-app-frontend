import {
  Avatar,
  AvatarGroup,
  Box,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";
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

type ChatRoomHeaderPropsType = {
  conservation: Conservation;
  onShowSideBarClick?: () => void;
};

const ChatRoomHeader: React.FC<ChatRoomHeaderPropsType> = ({
  conservation,
  onShowSideBarClick,
}) => {
  const currentUserId = useSelector(
    (state: RootState) => state.user.currentUser?._id
  );
  const conservationInfo = getConservationItemInfo(conservation, currentUserId);

  const getOnlineState = () => {
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
  };

  return (
    <motion.div
      initial={{ y: -40 }}
      animate={{ y: 0 }}
      // transition={{ ease: "linear", duration: 0.2 }}
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
            <Typography variant="body2" sx={{ fontSize: "13px" }}>
              {getOnlineState()}
            </Typography>
          </Box>
        </Box>
        <Stack spacing={2} direction="row">
          <SquareTooltipIconButton
            placement="bottom"
            sx={{ borderRadius: "50%", aspectRatio: 1 / 1 }}
            title="Audio call"
            color="info"
          >
            <Call />
          </SquareTooltipIconButton>
          <SquareTooltipIconButton
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
    </motion.div>
  );
};

export default ChatRoomHeader;
