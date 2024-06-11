import {
  Box,
  Button,
  FormHelperText,
  IconButton,
  Stack,
  SxProps,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { MouseEvent } from "react";
import ChipFileList from "./ChipFileList";
import { Delete, NoteAdd, Send } from "@mui/icons-material";
import { RecognizableFile } from "../../constants/types";

type ChipFileListPreviewPropsType = {
  files: RecognizableFile[];
  onFileChipDelete?: (file: File, id: string) => void;
  onCancel?: (e: MouseEvent<HTMLButtonElement>) => void;
  onSend?: (e: MouseEvent<HTMLButtonElement>) => void;
  error?: string | null;
  openFileDialog?: () => void;
  sx?: SxProps;
  disableSend?: boolean;
};

const ChipFileListPreview: React.FC<ChipFileListPreviewPropsType> = ({
  files,
  sx,
  onFileChipDelete,
  onCancel,
  onSend,
  openFileDialog,
  error,
  disableSend,
}) => {
  const handleAddFilesClick = () => {
    openFileDialog && openFileDialog();
  };

  return (
    <Box
      component="form"
      onSubmit={(e) => e.preventDefault()}
      sx={{ flex: 1, ...sx }}
    >
      <Box
        component="div"
        sx={{
          pb: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      >
        <Typography>Add files</Typography>
        <IconButton
          sx={{ aspectRatio: 1 / 1 }}
          onClick={handleAddFilesClick}
          color="info"
        >
          <NoteAdd />
        </IconButton>
      </Box>
      <ChipFileList files={files} onFileChipDelete={onFileChipDelete} />
      <Box
        sx={{
          mt: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Stack direction="row" spacing={2}>
          <Tooltip title="Cancel" color="error">
            <IconButton onClick={onCancel}>
              <Delete />
            </IconButton>
          </Tooltip>
        </Stack>
        {error && <FormHelperText error={true}>{error}</FormHelperText>}
        <Button
          disabled={disableSend}
          onClick={onSend}
          startIcon={<Send />}
          variant="contained"
        >
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default ChipFileListPreview;
