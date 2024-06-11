import React from "react";
import { FileMessagePropsType } from "../types";
import MessageItemWrapper from "../MessageItemWrapper";
import { Chip } from "@mui/material";
import { Download } from "@mui/icons-material";
import { downloadFile } from "../../../utils";

const FileMessage: React.FC<FileMessagePropsType> = ({ file, ...rest }) => {
  const handleDownloadFile = async () => {
    await downloadFile(file.downloadUrl, file.originalName);
  };
  return (
    <MessageItemWrapper {...rest}>
      <Chip
        sx={{ px: 1, py: 2.5 }}
        label={file.originalName}
        onDelete={handleDownloadFile}
        deleteIcon={<Download />}
      />
    </MessageItemWrapper>
  );
};

export default FileMessage;
