import React, { useState } from "react";
import { DialogResult } from "../../constants/types";
import { ImagePreviewModal } from "../ImagePreviewModal";
import UserBackgroundChooser from "../UserBackgroundChooser";
import { SxProps } from "@mui/material";

type UserBgChooserPreview = {
  onSelect: (base64: string) => void;
  src?: string;
  sx?: SxProps;
  loading?: boolean;
};

const UserBgChooserPreview: React.FC<UserBgChooserPreview> = ({
  onSelect,
  src,
  sx,
  loading,
}) => {
  const [selectedBackground, setSelectedBackground] = useState<string>();
  const [previewModalOpen, setPreviewModalOpen] = useState<boolean>(false);

  const handleBackgroundInput = (file: File) => {
    const selectedImage = URL.createObjectURL(file);
    setSelectedBackground(selectedImage);
    setPreviewModalOpen(true);
  };

  const handlePreviewImageModalConfirm = (
    result: DialogResult,
    croppedImg?: string
  ) => {
    if (result == DialogResult.OK && croppedImg) {
      onSelect(croppedImg);
    }
    setSelectedBackground(undefined);
    setPreviewModalOpen(false);
  };

  return (
    <div>
      <ImagePreviewModal
        open={previewModalOpen}
        src={selectedBackground}
        onConfirm={handlePreviewImageModalConfirm}
      />

      <UserBackgroundChooser
        loading={loading}
        sx={sx}
        src={src}
        onInput={handleBackgroundInput}
      />
    </div>
  );
};

export default UserBgChooserPreview;
