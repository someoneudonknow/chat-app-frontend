import { useState } from "react";
import ChatBarAnimationWrapper from "../../../UIs/ChatBarAnimationWrapper";
import {
  Box,
  Button,
  IconButton,
  Paper,
  Stack,
  Theme,
  Tooltip,
} from "@mui/material";
import { Delete, RestartAlt, Send } from "@mui/icons-material";
import { useChatRoom } from "../../context/ChatRoomProvider";
import AudioRecorderBar from "./AudioRecorderBar";
import WaveFormAudioPlayer from "../../../WaveFormAudioPlayer";
import { SubmitedMessageType } from "../../types";
import { MessageType } from "../../../../models/message.model";

type AudioChatBarPropsType = {
  onSubmit?: (data: SubmitedMessageType) => Promise<void>;
  sendDisable?: boolean;
};

const AudioChatBar: React.FC<AudioChatBarPropsType> = ({
  onSubmit,
  sendDisable,
}) => {
  const roomCtx = useChatRoom();
  const [mode, setMode] = useState<"record" | "preview-recored" | "idle">(
    "record"
  );
  const [recordedSrc, setRecordedSrc] = useState<Blob>();

  const handleCancel = () => {
    roomCtx.setChatBar("regular");
  };

  const handleSendAudio = async () => {
    if (!recordedSrc) return;
    roomCtx.setChatBar("regular");
    onSubmit &&
      (await onSubmit({ type: MessageType.AUDIO, content: recordedSrc }));
  };

  const handleStopRecording = (recordedSrc: Blob) => {
    setMode("preview-recored");
    setRecordedSrc(recordedSrc);
  };

  const handleRestartRecording = () => {
    setMode("idle");

    setTimeout(() => {
      setMode("record");
    }, 0);
  };

  return (
    <ChatBarAnimationWrapper>
      <Paper
        sx={{
          p: 1,
          gap: "10px",
          boxShadow: 2,
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        {mode === "record" && (
          <AudioRecorderBar
            sx={{ width: "100%", height: "45px" }}
            onStopRecording={handleStopRecording}
          />
        )}
        {mode === "preview-recored" && recordedSrc && (
          <WaveFormAudioPlayer
            sx={{
              flex: 1,
              height: "45px",
              bgcolor: (theme: Theme) =>
                theme.palette.containerPrimary &&
                theme.palette.containerPrimary[theme.palette.mode],
            }}
            src={recordedSrc}
          />
        )}
        <Box
          component="div"
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Stack
            component="span"
            direction="row"
            sx={{ display: "inline-flex" }}
            spacing={2}
          >
            <Tooltip title="cancel">
              <IconButton
                onClick={handleCancel}
                color="error"
                sx={{ aspectRatio: 1 / 1, width: "38px", height: "38px" }}
              >
                <Delete />
              </IconButton>
            </Tooltip>
            <Tooltip onClick={handleRestartRecording} title="Restart">
              <IconButton
                sx={{ aspectRatio: 1 / 1, width: "38px", height: "38px" }}
              >
                <RestartAlt />
              </IconButton>
            </Tooltip>
          </Stack>
          <Button
            disabled={sendDisable}
            onClick={handleSendAudio}
            variant="contained"
            endIcon={<Send />}
          >
            Send
          </Button>
        </Box>
      </Paper>
    </ChatBarAnimationWrapper>
  );
};

export default AudioChatBar;
