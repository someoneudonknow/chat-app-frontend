import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Snackbar,
  Stack,
  styled,
  useTheme,
} from "@mui/material";
import React from "react";
import { SlideIn } from "../../Transitions";
import { TextOverflowEllipsis } from "../../Person/PersonItem";
import { CallEnd, Mic, Videocam } from "@mui/icons-material";
import { Call, CallMediaType } from "../../../models/call.model";

type IncomingCallSnackBarPropsType = {
  open: boolean;
  mediaType?: CallMediaType;
  avatars?: string[] | string;
  from: string;
  callId: Call["_id"];
  handleCallReject?: (callId: Call["_id"]) => void;
  handleCallAccept?: (callId?: Call["_id"]) => void;
};

type CallActionButtonPropsType = {
  sizes?: number;
};

export const CallActionButton = styled(Button, {
  shouldForwardProp: (props) => props !== "sizes",
})<CallActionButtonPropsType>(({ sizes }) => ({
  borderRadius: "50%",
  minWidth: "0px",
  width: `${sizes}px`,
  height: `${sizes}px`,
}));

const IncomingCallSnackBar: React.FC<IncomingCallSnackBarPropsType> = ({
  open,
  mediaType,
  avatars,
  from,
  handleCallReject,
  handleCallAccept,
  callId,
}) => {
  const theme = useTheme();
  const avatarSize = 65;
  const actionSize = 45;
  const mediaTypeMap: { [k in CallMediaType]: string } = {
    AUDIO_CALL: "voice call",
    VIDEO_CALL: "video call",
  };

  return (
    <Snackbar
      anchorOrigin={{ horizontal: "center", vertical: "top" }}
      TransitionComponent={SlideIn}
      open={open}
    >
      <Box
        sx={{
          display: "flex",
          p: 2,
          borderRadius: 4,
          bgcolor: theme.palette?.primary[theme.palette.mode],
          color: "white",
          gap: 3,
        }}
      >
        {avatars && typeof avatars === "string" && (
          <Avatar
            src={avatars}
            sx={{ width: `${avatarSize}px`, height: `${avatarSize}px` }}
          />
        )}
        {avatars && Array.isArray(avatars) && avatars?.length >= 1 && (
          <AvatarGroup max={3}>
            {avatars.map((src) => (
              <Avatar
                src={src}
                sx={{ width: `${avatarSize}px`, height: `${avatarSize}px` }}
              />
            ))}
          </AvatarGroup>
        )}
        <Stack sx={{ flex: 1 }}>
          <TextOverflowEllipsis variant="h6">
            Incoming {mediaType ? mediaTypeMap[mediaType] : ""} call...
          </TextOverflowEllipsis>
          <TextOverflowEllipsis variant="body1">
            From {from}
          </TextOverflowEllipsis>
        </Stack>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <CallActionButton
            sizes={actionSize}
            variant="contained"
            color="error"
            onClick={() => handleCallReject && handleCallReject(callId)}
          >
            <CallEnd />
          </CallActionButton>
          <CallActionButton
            sizes={actionSize}
            onClick={() => handleCallAccept && handleCallAccept(callId)}
            variant="contained"
            color="success"
          >
            {mediaType === "VIDEO_CALL" && <Videocam />}
            {mediaType === "AUDIO_CALL" && <Mic />}
          </CallActionButton>
        </Box>
      </Box>
    </Snackbar>
  );
};

export default IncomingCallSnackBar;
