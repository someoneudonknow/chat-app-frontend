import {
  AddCircle,
  AttachFile,
  GifBox,
  LocationOn,
  Mic,
  ThumbUp,
} from "@mui/icons-material";
import { Box, IconButton, Paper, Stack, Tooltip } from "@mui/material";
import { MouseEvent, memo, useEffect, useState } from "react";
import GiphyPickerMenu from "../../GiphyPicker";
import { IGif } from "@giphy/js-types";
import { useChatRoom } from "../context/ChatRoomContextProvider";
import { motion, useAnimationControls } from "framer-motion";
import TextChatBar from "./TextChatBar";
import ChipFileListPreview from "../../ChipFileListPreview";
import { MessageType } from "../../../models/message.model";
import { SubmitedMessageType } from "../types";
import { useFilePicker } from "../../../hooks";
import { toast } from "react-toastify";
import { UploadService } from "../../../services";
import { BASE_URL } from "../../../constants/api-endpoints";
import { v4 as uuidv4 } from "uuid";
import { RecognizableFile } from "../../../constants/types";
import LoadingSnackbar from "../../UIs/LoadingSnackbar";

type ChatBarPropsType = {
  onSubmit: (data: SubmitedMessageType) => Promise<void>;
  shouldShow: boolean;
};

const ChatBar = memo<ChatBarPropsType>(({ onSubmit, shouldShow }) => {
  const [emojiCanMount, setEmojiCanMount] = useState<boolean>(false);
  const [gifphyPickerAnchor, setGifphyPickerAnchor] =
    useState<null | HTMLElement>(null);
  const [otherActionHover, setOtherActionHover] = useState<boolean>(false);
  const chatRoomCtx = useChatRoom();
  const wrapperAnimationControls = useAnimationControls();
  const [selectedFiles, setSelectedFiles] = useState<
    (RecognizableFile & {
      upload: any;
    })[]
  >([]);
  const [fileUploading, setFileUploading] = useState<boolean>(false);
  const { openDialog, error } = useFilePicker({
    accept: "*",
    multiple: true,
    onChange: async (files: FileList | null) => {
      if (files) {
        setFileUploading(true);

        await Promise.all(
          Array.from(files).map(async (file) => {
            const uploadService = new UploadService(BASE_URL);
            const id = uuidv4();
            const formData = new FormData();
            const recognizableFile = file as RecognizableFile & {
              upload: any;
            };

            recognizableFile.id = id;
            formData.append("attachment", file);
            try {
              const uploadResponse = await uploadService.uploadOne({
                formData,
              });
              const uploaded = uploadResponse.metadata;

              recognizableFile.upload = uploaded;

              setSelectedFiles((prev) => [...prev, recognizableFile]);
            } catch (e: any) {
              toast.error(
                `Can't upload ${file.name} due to some error happened`
              );
            }
          })
        );

        setFileUploading(false);
      }
    },
    validator: (files: File[]) => {
      const prevFiles = (selectedFiles && Array.from(selectedFiles)) || [];
      const totalBytes = [...prevFiles, ...files].reduce(
        (a, f: File) => a + f.size,
        0
      );

      if (totalBytes > 1024 * 1024 * 25) {
        return "Total file size must be lower than 25mb";
      }

      return true;
    },
  });

  useEffect(() => {
    if (selectedFiles.length === 0 && error) {
      toast.warning(error, {
        position: "top-center",
      });
    }
  }, [error, selectedFiles]);

  useEffect(() => {
    if (shouldShow) {
      wrapperAnimationControls.start({ y: 0 });
    } else {
      wrapperAnimationControls.start({ y: 40 });
    }
  }, [shouldShow, wrapperAnimationControls]);

  const handleTextInputSubmit = async (value: string) => {
    await onSubmit({ type: MessageType.TEXT, content: value });
  };

  const handleGifClick = async (gif: IGif) => {
    await onSubmit({ type: MessageType.GIF, content: gif });
    setGifphyPickerAnchor(null);
  };

  const handleSendFiles = async () => {
    await onSubmit({ type: MessageType.FILE, content: selectedFiles });
    setSelectedFiles([]);
  };

  const handleFileChipDelete = (_: File, id: string) => {
    if (!fileUploading) {
      setSelectedFiles((prev) => prev.filter((file) => file.id !== id));
    }
  };

  const handleCancelFileSelect = () => {
    setSelectedFiles([]);
  };

  const handleGifBtnClicked = (e: MouseEvent<HTMLButtonElement>) => {
    setGifphyPickerAnchor(e.currentTarget);
  };

  const handleCloseGifphyPicker = () => {
    setGifphyPickerAnchor(null);
  };

  const handleAudioMessageBtnClick = () => {
    chatRoomCtx.setChatBar("audio");
  };

  return (
    <>
      <GiphyPickerMenu
        onGifClick={handleGifClick}
        anchor={gifphyPickerAnchor}
        onClose={handleCloseGifphyPicker}
      />
      <LoadingSnackbar
        loading={fileUploading}
        loadingText="Uploading files..."
      />
      <motion.div
        initial={{ y: 40 }}
        animate={wrapperAnimationControls}
        onAnimationComplete={() => setEmojiCanMount(true)}
        style={{ display: shouldShow ? "block" : "none" }}
      >
        <Paper
          sx={{
            p: 1,
            display: "flex",
            alignItems: "flex-end",
            gap: "10px",
            boxShadow: 2,
          }}
        >
          <Stack direction="row">
            <Box
              onMouseEnter={() => setOtherActionHover(true)}
              onMouseLeave={() => setOtherActionHover(false)}
              sx={{
                position: "relative",
                "&:before": {
                  content: "''",
                  position: "absolute",
                  bottom: "100%",
                  width: "150px",
                  height: "10px",
                  display: otherActionHover ? "block" : "none",
                },
              }}
            >
              <Box component="div" sx={{ postion: "relative" }}>
                {otherActionHover && (
                  <Paper
                    sx={{
                      position: "absolute",
                      bottom: "calc(100% + 10px)",
                      boxShadow: 2,
                      left: 0,
                      p: 1,
                    }}
                  >
                    <Stack spacing={2} direction="row">
                      <Tooltip title="Send voice" placement="top">
                        <IconButton
                          onClick={handleAudioMessageBtnClick}
                          color="info"
                        >
                          <Mic />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Send locations" placement="top">
                        <IconButton color="info">
                          <LocationOn />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </Paper>
                )}
                <IconButton color="info">
                  <AddCircle />
                </IconButton>
              </Box>
            </Box>
            <Tooltip title="Send files">
              <IconButton
                onClick={() => {
                  setSelectedFiles([]);
                  openDialog();
                }}
                color="info"
              >
                <AttachFile />
              </IconButton>
            </Tooltip>
            <Tooltip title="Send gif">
              <IconButton onClick={handleGifBtnClicked} color="info">
                <GifBox />
              </IconButton>
            </Tooltip>
          </Stack>
          {selectedFiles.length > 0 && (
            <ChipFileListPreview
              disableSend={fileUploading}
              onSend={handleSendFiles}
              error={error}
              sx={{ flex: 1 }}
              openFileDialog={openDialog}
              onFileChipDelete={handleFileChipDelete}
              onCancel={handleCancelFileSelect}
              files={selectedFiles}
            />
          )}
          {selectedFiles.length <= 0 && (
            <TextChatBar
              onSubmit={handleTextInputSubmit}
              emojiCanMount={emojiCanMount}
            />
          )}
          <Tooltip title="Send like">
            <IconButton
              sx={{
                transition: "all ease-in-out .1s",
                "&:hover": {
                  transform: "rotate(-20deg)",
                },
              }}
              color="info"
            >
              <ThumbUp />
            </IconButton>
          </Tooltip>
        </Paper>
      </motion.div>
    </>
  );
});

export default ChatBar;
