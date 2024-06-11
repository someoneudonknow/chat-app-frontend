import { Chip } from "@mui/material";
import React, { useCallback } from "react";
import { formatFileSize } from "../../utils";
import {
  AudioFile,
  Delete,
  FilePresent,
  Image,
  VideoFile,
} from "@mui/icons-material";

type FileChipPropsType = {
  file: File;
  onDelete?: () => void;
};

const FileChip: React.FC<FileChipPropsType> = ({ file, onDelete }) => {
  const getFileIconByType = useCallback((fileType: string) => {
    if (!fileType) return;
    if (fileType.startsWith("video")) return <VideoFile />;
    if (fileType.startsWith("audio")) return <AudioFile />;
    if (fileType.startsWith("image")) return <Image />;
    return <FilePresent />;
  }, []);

  return (
    <Chip
      icon={getFileIconByType(file.type)}
      label={`${file.name} (${formatFileSize(file.size)})`}
      deleteIcon={<Delete />}
      onDelete={onDelete}
    />
  );
};

export default FileChip;
