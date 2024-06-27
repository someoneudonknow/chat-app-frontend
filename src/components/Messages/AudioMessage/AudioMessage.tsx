import React, { useEffect, useState } from "react";
import { AudioMessagePropsType } from "../types";
import { Box } from "@mui/material";
import WaveFormAudioPlayer from "../../WaveFormAudioPlayer";

const AudioMessage: React.FC<AudioMessagePropsType> = ({ audioInfo, sx }) => {
  const [srcBlob, setSrcBlob] = useState<Blob>();

  useEffect(() => {
    (async () => {
      const response = await fetch(audioInfo.url);
      const blobResponse = await response.blob();

      setSrcBlob(blobResponse);
    })();

    // eslint-disable-next-line
  }, []);

  return (
    <Box sx={{ width: "300px", ...sx }}>
      {srcBlob && (
        <WaveFormAudioPlayer
          buttonColor="white"
          progressColor="#cccccc"
          sx={{ flex: 1, height: "45px" }}
          initState="pause"
          src={srcBlob}
        />
      )}
    </Box>
  );
};

export default AudioMessage;
