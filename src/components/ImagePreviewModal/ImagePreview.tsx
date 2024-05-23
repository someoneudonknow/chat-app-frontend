import { Box } from "@mui/material";
import React, {
  EventHandler,
  ReactEventHandler,
  useRef,
  useState,
} from "react";
import ReactCrop, {
  Crop,
  PercentCrop,
  PixelCrop,
  centerCrop,
  makeAspectCrop,
} from "react-image-crop";
import { convertImageToCanvas } from "../../utils";
import { CropType } from "../../constants/types";

type ImagePreviewPropsType = {
  src?: string;
  onCropComplete: (croppedImage: string) => void;
  cropType: CropType;
};

const ImagePreview: React.FC<ImagePreviewPropsType> = ({
  src,
  onCropComplete,
  cropType = CropType.RECTANGLE,
}) => {
  const [crop, setCrop] = useState<Crop | undefined>();
  const imgRef = useRef<HTMLImageElement>(null);
  const ASPECT_RATIO = cropType === CropType.RECTANGLE ? 10 / 4 : 1 / 1;

  const handleCropChange = (_: Crop, percentCrop: PercentCrop) => {
    setCrop(percentCrop);
  };

  const handleImgLoad: ReactEventHandler<HTMLImageElement> = (e) => {
    const { naturalWidth: width, naturalHeight: height } = e.currentTarget;

    const crop = centerCrop(
      makeAspectCrop(
        {
          unit: "%",
          width: 100,
        },
        ASPECT_RATIO,
        width,
        height
      ),
      width,
      height
    );

    setCrop(crop);
  };

  const handleCropComplete = (crop: Crop) => {
    if (src) {
      const image = imgRef.current;

      if (image) {
        const croppedImage = convertImageToCanvas(image, crop);
        if (croppedImage) {
          onCropComplete(croppedImage);
        }
      }
    }
  };

  return (
    <Box sx={{ height: "100%", width: "100%" }}>
      <ReactCrop
        ruleOfThirds
        onComplete={handleCropComplete}
        aspect={ASPECT_RATIO}
        onChange={handleCropChange}
        crop={crop}
        circularCrop={cropType === CropType.CIRCLE}
      >
        <img
          ref={imgRef}
          onLoad={handleImgLoad}
          style={{
            objectFit: "cover",
            objectPosition: "center",
            maxWidth: "500px",
            maxHeight: "500px",
            minHeight: "300px",
            minWidth: "300px",
          }}
          src={src}
        />
      </ReactCrop>
    </Box>
  );
};

export default ImagePreview;
