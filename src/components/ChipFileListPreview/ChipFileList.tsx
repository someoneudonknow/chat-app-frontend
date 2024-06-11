import { SxProps } from "@mui/material";
import { Box } from "@mui/system";
import React, { useMemo } from "react";
import FileChip from "./FileChip";
import { RecognizableFile } from "../../constants/types";

type FileListPropsType = {
  files: RecognizableFile[];
  onFileChipDelete?: (file: File, index: string) => void;
  sx?: SxProps;
};

const FileList: React.FC<FileListPropsType> = ({
  files,
  sx,
  onFileChipDelete,
}) => {
  return (
    <Box
      sx={{
        maxHeight: "150px",
        overflowY: "auto",
        display: "flex",
        flexWrap: "wrap",
        gap: "10px",
        ...sx,
      }}
    >
      {files.map((file) => (
        <FileChip
          onDelete={() => onFileChipDelete && onFileChipDelete(file, file.id)}
          key={file.id}
          file={file}
        />
      ))}
    </Box>
  );
};

export default FileList;
