import React from "react";
import { FileMessagePropsType } from "../types";
import { Chip } from "@mui/material";
import { Download } from "@mui/icons-material";
import { downloadFile } from "../../../utils";

const FileMessage: React.FC<FileMessagePropsType> = ({ file, sx }) => {
  const handleDownloadFile = async () => {
    await downloadFile(file.downloadUrl, file.originalName);
  };
  return (
    <Chip
      sx={{ px: 1, py: 2.5, ...sx }}
      label={file.originalName}
      onDelete={handleDownloadFile}
      deleteIcon={<Download />}
    />
  );
};

export default FileMessage;
