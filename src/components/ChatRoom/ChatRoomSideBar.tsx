import React from "react";
import { Avatar, AvatarGroup, Box, Paper, useTheme } from "@mui/material";
import { TextOverflowEllipsis } from "../Person/PersonItem";
import { Link } from "react-router-dom";
import {
  Conservation,
  ConservationType,
} from "../../models/conservation.model";
import { getConservationItemInfo } from "../../utils";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { motion } from "framer-motion";
import { GroupActions, InboxActions } from "./SideBarActions";

type ChatRoomSideBarPropsType = {
  show: boolean;
  conservation: Conservation;
  onSearchBtnClick?: () => void;
};

const AVT_SIZE = 100;

const ChatRoomSideBar: React.FC<ChatRoomSideBarPropsType> = ({
  show,
  conservation,
}) => {
  const currentUserId = useSelector(
    (state: RootState) => state.user.currentUser?._id
  );
  const theme = useTheme();
  const conservationInfo = getConservationItemInfo(conservation, currentUserId);

  return (
    <motion.div
      key={conservation._id}
      initial={{ x: 40 }}
      animate={{ x: 0 }}
      style={{
        width: show ? "30%" : "0%",
        transition: "all ease 0.3s",
        height: "100%",
        overflow: "hidden",
        borderLeft: `1px solid ${theme.palette.background.paper}`,
      }}
    >
      <Paper sx={{ width: "100%", height: "100%", overflowY: "scroll" }}>
        <Box
          component="div"
          sx={{
            p: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          {!conservationInfo?.cover && (
            <Avatar sx={{ width: AVT_SIZE, height: AVT_SIZE }} />
          )}
          {conservationInfo?.cover &&
            Array.isArray(conservationInfo?.cover) && (
              <AvatarGroup max={3}>
                {conservationInfo.cover.map((avt) => (
                  <Avatar
                    sx={{ width: AVT_SIZE - 20, height: AVT_SIZE - 20 }}
                    src={avt || undefined}
                  />
                ))}
              </AvatarGroup>
            )}
          {conservationInfo?.cover &&
            typeof conservationInfo?.cover === "string" && (
              <Avatar
                sx={{ width: AVT_SIZE, height: AVT_SIZE }}
                src={conservationInfo?.cover}
              />
            )}
          <TextOverflowEllipsis
            component="span"
            variant="h6"
            sx={{
              mt: 1,
              color: (theme) =>
                theme.palette.mode === "dark" ? "white" : "black",
            }}
          >
            {conservation.type === ConservationType.INBOX && (
              <Link
                style={{ color: "inherit" }}
                to={`/user/discover/${
                  conservation.members.find((m) => m.user._id !== currentUserId)
                    ?.user._id
                }`}
              >
                {conservationInfo?.name}
              </Link>
            )}
            {conservation.type === ConservationType.GROUP &&
              conservationInfo?.name}
          </TextOverflowEllipsis>
        </Box>
        {conservation.type === ConservationType.INBOX && (
          <InboxActions conservation={conservation} />
        )}
        {conservation.type === ConservationType.GROUP && <GroupActions />}
      </Paper>
    </motion.div>
  );
};

export default ChatRoomSideBar;
