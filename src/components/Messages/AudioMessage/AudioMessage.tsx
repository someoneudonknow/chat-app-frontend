import React, { useEffect, useState } from "react";
import { AudioMessagePropsType } from "../types";
import MessageItemWrapper from "../MessageItemWrapper";
import { Box } from "@mui/material";
import WaveFormAudioPlayer from "../../WaveFormAudioPlayer";

const AudioMessage: React.FC<AudioMessagePropsType> = ({
  audioInfo,
  ...rest
}) => {
  const [srcBlob, setSrcBlob] = useState<Blob>();

  useEffect(() => {
    (async () => {
      const response = await fetch(audioInfo.url);
      const blobResponse = await response.blob();

      setSrcBlob(blobResponse);
    })();
  }, [audioInfo]);

  return (
    <MessageItemWrapper {...rest}>
      <Box sx={{ width: "300px" }}>
        {srcBlob && (
          <WaveFormAudioPlayer
            sx={{ flex: 1, height: "45px" }}
            initState="pause"
            src={srcBlob}
          />
        )}
      </Box>
    </MessageItemWrapper>
  );
};

export default AudioMessage;
