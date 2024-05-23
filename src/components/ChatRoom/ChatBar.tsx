import {
  AddCircle,
  AttachFile,
  EmojiEmotions,
  GifBox,
  ThumbUp,
} from "@mui/icons-material";
import {
  Box,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";
import React, { MouseEvent, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { motion } from "framer-motion";
import EmojiPickerMenu from "../EmojiPickerMenu";
import GiphyPickerMenu from "../GiphyPicker";

type ChatBarPropsType = {
  onSubmit: (data: FieldValues) => void;
};

const ChatBar: React.FC<ChatBarPropsType> = ({ onSubmit }) => {
  const { handleSubmit, register, resetField } = useForm();
  const [emojiPickerAnchor, setEmojiPickerAnchor] =
    useState<null | HTMLElement>(null);
  const [emojiCanMount, setEmojiCanMount] = useState<boolean>(false);
  const [gifphyPickerAnchor, setGifphyPickerAnchor] =
    useState<null | HTMLElement>(null);
  const [otherActionHover, setOtherActionHover] = useState<boolean>(false);

  const handleFormSubmit = (data: FieldValues) => {
    resetField("messageInput");
    onSubmit(data);
  };

  const handleEmojiBtnClicked = (e: MouseEvent<HTMLButtonElement>) => {
    setEmojiPickerAnchor(e.currentTarget);
  };

  const handleCloseEmojiPicker = () => {
    setEmojiPickerAnchor(null);
  };

  const handleGifBtnClicked = (e: MouseEvent<HTMLButtonElement>) => {
    setGifphyPickerAnchor(e.currentTarget);
  };

  const handleCloseGifphyPicker = () => {
    setGifphyPickerAnchor(null);
  };

  return (
    <>
      {emojiCanMount && (
        <EmojiPickerMenu
          anchor={emojiPickerAnchor}
          onClose={handleCloseEmojiPicker}
        />
      )}
      <GiphyPickerMenu
        anchor={gifphyPickerAnchor}
        onClose={handleCloseGifphyPicker}
      />
      <motion.div
        onAnimationComplete={() => setEmojiCanMount(true)}
        initial={{ y: 40 }}
        animate={{ y: 0 }}
      >
        <Paper
          sx={{
            p: 1,
            display: "flex",
            alignItems: "center",
            gap: "10px",
            boxShadow: 2,
          }}
          component="form"
          onSubmit={handleSubmit(handleFormSubmit)}
        >
          <Stack direction="row">
            <Box
              onMouseEnter={() => setOtherActionHover(true)}
              onMouseLeave={() => setOtherActionHover(false)}
              sx={{ position: "relative" }}
            >
              <Tooltip sx={{ postion: "relative" }} title="Others actions">
                <IconButton color="info">
                  <AddCircle />
                </IconButton>
              </Tooltip>
            </Box>
            <Tooltip title="Send files">
              <IconButton color="info">
                <AttachFile />
              </IconButton>
            </Tooltip>
            <Tooltip title="Send gif">
              <IconButton onClick={handleGifBtnClicked} color="info">
                <GifBox />
              </IconButton>
            </Tooltip>
          </Stack>
          <TextField
            InputProps={{
              sx: {
                borderRadius: "100vmax",
              },
              endAdornment: (
                <InputAdornment position="end">
                  <Tooltip title="Send emoji">
                    <IconButton
                      onClick={handleEmojiBtnClicked}
                      color="info"
                      sx={{
                        aspectRatio: 1 / 1,
                      }}
                    >
                      <EmojiEmotions />
                    </IconButton>
                  </Tooltip>
                </InputAdornment>
              ),
            }}
            {...register("messageInput", {
              required: true,
            })}
            sx={{ flex: 1 }}
            size="small"
            placeholder="Aa"
          />
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
};

export default ChatBar;
