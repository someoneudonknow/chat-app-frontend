import React, { ReactNode, forwardRef, useCallback, useState } from "react";
import ConfirmDialog from "../ConfirmDialog";
import { CropType, DialogResult } from "../../constants/types";
import { SlideIn } from "../Transitions";
import ImagePreview from "./ImagePreview";

type ImagePreviewModalPropsType = {
  src?: string;
  open: boolean;
  onConfirm: (result: DialogResult, imgFile?: string) => void;
  cropType?: CropType;
};

const ImagePreviewModal: React.FC<ImagePreviewModalPropsType> = ({
  src,
  open,
  onConfirm,
  cropType = CropType.RECTANGLE,
}) => {
  const [croppedImage, setCroppedImage] = useState<string | undefined>();

  const handleCropComplete = (blobString: string) => {
    setCroppedImage(blobString);
  };

  const handleConfirm = (result: DialogResult) => {
    onConfirm(result, croppedImage);
  };

  return (
    <ConfirmDialog
      transitionComponent={SlideIn}
      open={open}
      actions={[
        { label: "Cancel", resultType: DialogResult.CANCEL },
        { label: "OK", resultType: DialogResult.OK },
      ]}
      bodyContent={
        <ImagePreview
          onCropComplete={handleCropComplete}
          src={src}
          cropType={cropType}
        />
      }
      title="Selected image"
      onConfirm={handleConfirm}
    />
  );
};

export default ImagePreviewModal;
