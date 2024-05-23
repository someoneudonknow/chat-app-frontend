import React, { useState } from "react";
import UserAvatarChooser from "../UserAvatarChooser";
import { ImagePreviewModal } from "../ImagePreviewModal";
import { CropType, DialogResult } from "../../constants/types";
import { SxProps } from "@mui/material";

type UserAvtChooserPreviewPropsType = {
  src?: string;
  onSelect: (imgBase64: string) => void;
  sx?: SxProps;
  avatarSize?: number;
  loading?: boolean;
};

const UserAvtChooserPreview: React.FC<UserAvtChooserPreviewPropsType> = ({
  src,
  onSelect,
  sx,
  avatarSize,
  loading,
}) => {
  const [selectedAvt, setSelectedAvt] = useState<string>();
  const [previewModalOpen, setPreviewModalOpen] = useState<boolean>(false);

  const handleAvtInput = (file: File) => {
    const url = URL.createObjectURL(file);

    setSelectedAvt(url);
    setPreviewModalOpen(true);
  };

  const handleConfirm = (result: DialogResult, croppedImg?: string) => {
    if (result == DialogResult.OK && croppedImg) {
      onSelect(croppedImg);
    }
    setPreviewModalOpen(false);
    setSelectedAvt(undefined);
  };

  return (
    <>
      <ImagePreviewModal
        src={selectedAvt}
        onConfirm={handleConfirm}
        open={previewModalOpen}
        cropType={CropType.CIRCLE}
      />
      <UserAvatarChooser
        loading={loading}
        size={avatarSize || 120}
        borderWidth={4}
        sx={sx}
        onInput={handleAvtInput}
        src={src}
      />
    </>
  );
};

export default UserAvtChooserPreview;
