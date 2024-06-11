import React from "react";
import { motion } from "framer-motion";
import {
  Button,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  Search,
} from "@mui/icons-material";
import { useChatRoom } from "../context/ChatRoomContextProvider";
import { FieldValues, useForm } from "react-hook-form";

const MessageSearchBox: React.FC = () => {
  const chatRoomCtx = useChatRoom();
  const { handleSubmit, register } = useForm();

  const handleCancelSearch = () => {
    chatRoomCtx.hideSearchMessageBox();
  };

  const handleSearchSubmit = (data: FieldValues) => {
    console.log({ data });
  };

  return (
    <motion.div
      initial={{ opacity: 0, top: "0px", y: -20 }}
      animate={{ opacity: 1, top: "100%", y: 0 }}
    >
      <Paper
        onSubmit={handleSubmit(handleSearchSubmit)}
        component="form"
        sx={{ display: "flex", gap: "5px", p: 1 }}
      >
        <TextField
          {...register("messageSearchInput", {
            required: true,
          })}
          autoFocus
          sx={{ flex: 1 }}
          size="small"
          placeholder="Search for messages..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="start">
                <Typography variant="body2" color="initial">
                  10/100
                </Typography>
              </InputAdornment>
            ),
            sx: {
              borderRadius: "100vmax",
            },
          }}
        />
        <IconButton>
          <KeyboardArrowUp />
        </IconButton>
        <IconButton>
          <KeyboardArrowDown />
        </IconButton>
        <Button onClick={handleCancelSearch} variant="contained">
          Cancel
        </Button>
      </Paper>
    </motion.div>
  );
};

export default MessageSearchBox;
