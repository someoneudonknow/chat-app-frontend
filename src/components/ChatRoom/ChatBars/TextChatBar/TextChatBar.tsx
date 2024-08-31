import { IconButton, InputAdornment, TextField, Tooltip } from "@mui/material";
import React, {
  MouseEvent as ReactMouseEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import EmojiPickerMenu from "../../../EmojiPickerMenu";
import { EmojiEmotions } from "@mui/icons-material";
import { FieldValues, useForm } from "react-hook-form";
import { useKeyPress, useSocket } from "../../../../hooks";
import { EmojiClickData } from "emoji-picker-react";
import { useChatRoom } from "../../context/ChatRoomProvider";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";

type TextChatBarPropsType = {
  emojiCanMount: boolean;
  onSubmit?: (value: string) => Promise<void>;
};

const TextChatBar: React.FC<TextChatBarPropsType> = ({
  emojiCanMount,
  onSubmit,
}) => {
  const [emojiPickerAnchor, setEmojiPickerAnchor] =
    useState<null | HTMLElement>(null);
  const { handleSubmit, register, resetField, setValue, getValues, setFocus } =
    useForm();
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const currentUserId = useSelector(
    (state: RootState) => state.user.currentUser?._id
  );
  const { socket } = useSocket();
  const chatRoomCtx = useChatRoom();

  useEffect(() => {
    if (!currentUserId || !chatRoomCtx.conservation?._id) return;

    if (isTyping) {
      socket?.emit("conservation/typing", {
        userId: currentUserId,
        conservation: chatRoomCtx.conservation?._id,
      });
    } else {
      socket?.emit("conservation/cancel-typing", {
        userId: currentUserId,
        conservation: chatRoomCtx.conservation?._id,
      });
    }
  }, [isTyping, currentUserId, chatRoomCtx.conservation?._id, socket]);

  const { containerRef } = useKeyPress({
    registerKeys: [
      {
        mode: "all",
        keys: ["Enter", "Shift"],
        cb: (e: KeyboardEvent) => {
          e.preventDefault();
          const textarea = e.target as HTMLTextAreaElement;
          const currentCursorPosition = textarea.selectionStart;
          const textBeforeCurrentCursorPos = textarea.value.substring(
            0,
            currentCursorPosition
          );
          const textAfterCurrentCursorPos = textarea.value.substring(
            currentCursorPosition
          );
          const newText = `${textBeforeCurrentCursorPos}\n${textAfterCurrentCursorPos}`;
          textarea.value = newText;
          textarea.style.height = `${textarea.scrollHeight}px`;
          textarea.scrollTop = textarea.scrollHeight;
        },
      },
      {
        keys: "Enter",
        cb: (e: KeyboardEvent) => {
          if (!e.shiftKey) {
            e.preventDefault();

            handleSubmit(async (values: FieldValues) => {
              onSubmit && (await onSubmit(values.chatInput as string));
              resetField("chatInput");
            })();
          }
        },
      },
    ],
    options: { exact: true },
  });

  const handleEmojiBtnClicked = (e: ReactMouseEvent<HTMLButtonElement>) => {
    setEmojiPickerAnchor(e.currentTarget);
  };

  const handleCloseEmojiPicker = () => {
    setEmojiPickerAnchor(null);
    containerRef.current?.focus();
    setFocus("chatInput");
  };

  const handleEmojiSelect = (emojiData: EmojiClickData) => {
    setValue("chatInput", `${getValues("chatInput")}${emojiData.emoji}`);
  };

  return (
    <>
      {emojiCanMount && (
        <EmojiPickerMenu
          anchor={emojiPickerAnchor}
          onClose={handleCloseEmojiPicker}
          onEmojiClick={handleEmojiSelect}
        />
      )}
      <TextField
        inputRef={containerRef}
        multiline
        minRows={1}
        maxRows={5}
        InputProps={{
          sx: {
            borderRadius: 5,
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
        sx={{ flex: 1 }}
        size="small"
        placeholder="Aa"
        {...register("chatInput", {
          required: true,
          onChange: (e) => {
            if (e.target.value.trim() !== "") setIsTyping(true);
            else setIsTyping(false);
          },
          onBlur: (e) => {
            setIsTyping(false);
          },
        })}
      />
    </>
  );
};

export default TextChatBar;
