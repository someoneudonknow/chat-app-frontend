import {
  Accordion,
  AccordionSummary,
  Avatar,
  AvatarGroup,
  Box,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
} from "@mui/material";
import { TextOverflowEllipsis } from "../../Person/PersonItem";
import { Link } from "react-router-dom";
import { GroupActions, InboxActions } from "../SideBarActions";
import { getConservationItemInfo } from "../../../utils";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { useChatRoom } from "../context/ChatRoomProvider";
import {
  ConservationMember,
  ConservationType,
} from "../../../models/conservation.model";
import {
  AttachFile,
  ExpandMore,
  FilePresent,
  Image,
  Info,
  Movie,
  People,
  PushPin,
} from "@mui/icons-material";
import { ChatRoomMemberList } from "../ChatRoomMemberList";
import { ConservationItemType } from "../../../constants/types";
import { AttachmentsSidebarTabNames } from "../types";

const AVT_SIZE = 100;

type PrimarySidebarViewPropsType = {
  show: boolean;
};

const PrimarySidebarView: React.FC<PrimarySidebarViewPropsType> = ({
  show,
}) => {
  const { conservation, setSidebarView } = useChatRoom();
  const currentUserId = useSelector(
    (state: RootState) => state.user.currentUser?._id
  );
  let conservationInfo = null;

  if (conservation && currentUserId) {
    conservationInfo = getConservationItemInfo(conservation, currentUserId);
  }

  if (!conservation || !conservationInfo) return null;

  const { type } = conservation;
  const members = conservation.members as ConservationMember[];
  const { cover, name } = conservationInfo as ConservationItemType;

  return (
    <Paper
      sx={{
        width: "100%",
        height: "100%",
        overflowY: "scroll",
        display: show ? "block" : "none",
      }}
    >
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
        {!cover && <Avatar sx={{ width: AVT_SIZE, height: AVT_SIZE }} />}
        {cover && Array.isArray(cover) && (
          <AvatarGroup max={3}>
            {cover.map((avt) => (
              <Avatar
                sx={{ width: AVT_SIZE - 20, height: AVT_SIZE - 20 }}
                src={avt || undefined}
              />
            ))}
          </AvatarGroup>
        )}
        {cover && typeof cover === "string" && (
          <Avatar sx={{ width: AVT_SIZE, height: AVT_SIZE }} src={cover} />
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
          {type === ConservationType.INBOX && (
            <Link
              style={{ color: "inherit" }}
              to={`/user/discover/${
                members.find((m) => m.user._id !== currentUserId)?.user._id
              }`}
            >
              {name}
            </Link>
          )}
          {type === ConservationType.GROUP && name}
        </TextOverflowEllipsis>
      </Box>
      <Box
        component="div"
        sx={{
          mb: 3,
        }}
      >
        {type === ConservationType.INBOX && (
          <InboxActions conservation={conservation} />
        )}
        {type === ConservationType.GROUP && <GroupActions />}
      </Box>
      <div>
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMore />} id="members-header">
            <People /> <span style={{ marginLeft: "5px" }}>Members</span>
          </AccordionSummary>
          <ChatRoomMemberList members={members} />
        </Accordion>
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMore />} id="attachment-header">
            <AttachFile />
            <span style={{ marginLeft: "5px" }}>Attachments</span>
          </AccordionSummary>
          <ListItemButton
            onClick={() => {
              setSidebarView({
                viewName: "attachments",
                data: { tab: AttachmentsSidebarTabNames.IMAGES },
              });
            }}
          >
            <ListItemIcon>
              <Image />
            </ListItemIcon>
            <ListItemText primary="Images" />
          </ListItemButton>
          <ListItemButton
            onClick={() =>
              setSidebarView({
                viewName: "attachments",
                data: { tab: AttachmentsSidebarTabNames.VIDEOS },
              })
            }
          >
            <ListItemIcon>
              <Movie />
            </ListItemIcon>
            <ListItemText primary="Videos" />
          </ListItemButton>
          <ListItemButton
            onClick={() =>
              setSidebarView({
                viewName: "attachments",
                data: { tab: AttachmentsSidebarTabNames.FILES },
              })
            }
          >
            <ListItemIcon>
              <FilePresent />
            </ListItemIcon>
            <ListItemText primary="Files" />
          </ListItemButton>
        </Accordion>
        {/* <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />} id="chat-info-header">
            <Info />
            <span style={{ marginLeft: "5px" }}>Chat informations</span>
          </AccordionSummary>
          <ListItemButton>
            <ListItemIcon>
              <PushPin />
            </ListItemIcon>
            <ListItemText primary="Pin messages" />
          </ListItemButton>
        </Accordion> */}
      </div>
    </Paper>
  );
};

export default PrimarySidebarView;
