import { AttachFile } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import React, { useEffect } from "react";
import { useFilePicker } from "../../../../hooks";

type FileSelectorPropsType = {
  onSelectedChange?: (fileList: FileList | null) => void;
  multiple?: boolean;
  accept?: string;
};

const FileSelector: React.FC<FileSelectorPropsType> = ({
  onSelectedChange,
  multiple = false,
  accept = "*",
}) => {
  const { openDialog, error } = useFilePicker({
    multiple: multiple,
    accept: accept,
    onChange: onSelectedChange,
    validator: (files) => {
      const totalBytes = Array.from(files).reduce(
        (a, f: File) => a + f.size,
        0
      );

      if (totalBytes > 1024 * 25) {
        alert("File size must be lower than 25mb");
        return "File size must be lower than 25mb";
      }

      return true;
    },
  });

  useEffect(() => {
    if (error) alert(error);
  }, [error]);

  return (
    <Tooltip title="Send files">
      <IconButton onClick={() => openDialog()} color="info">
        <AttachFile />
      </IconButton>
    </Tooltip>
  );
};

export default FileSelector;
