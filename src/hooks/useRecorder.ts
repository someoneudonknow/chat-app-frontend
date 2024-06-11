import { useCallback, useEffect, useRef, useState } from "react";
import { closeStream, getUserStream } from "../utils";

type UseRecorderProps = {
  onStopRecording?: (blob: Blob) => void;
  onDataavailable?: (blobEvent: BlobEvent) => void;
};

const useRecorder = ({
  onStopRecording,
  onDataavailable,
}: UseRecorderProps) => {
  const audioRecorderRef = useRef<MediaRecorder | null>(null);
  const [currentMediaStream, setCurrentMediaStream] =
    useState<MediaStream | null>(null);
  const [error, setError] = useState<any | null>();
  const chunks = useRef<Blob[]>([]);
  const [gettingMediaStream, setGettingMediaStream] = useState<boolean>(false);

  useEffect(() => {
    const recordingSetup = async () => {
      setGettingMediaStream(true);
      try {
        const stream = await getUserStream({
          audio: {
            echoCancellation: false,
            autoGainControl: false,
            noiseSuppression: false,
          },
        });

        audioRecorderRef.current = new MediaRecorder(stream);

        audioRecorderRef.current.ondataavailable = (e: BlobEvent) => {
          if (e.data.size > 0) {
            chunks.current.push(e.data);
          }
          onDataavailable && onDataavailable(e);
        };

        audioRecorderRef.current.start();

        setCurrentMediaStream(stream);
      } catch (error: any) {
        setError(error);
      }
      setGettingMediaStream(false);
    };

    if (!currentMediaStream && !gettingMediaStream) {
      recordingSetup();
    }

    return () => {
      if (currentMediaStream) {
        closeStream(currentMediaStream);
      }
    };
  }, [
    currentMediaStream,
    onStopRecording,
    gettingMediaStream,
    onDataavailable,
  ]);

  const handleStopRecording = useCallback(() => {
    if (audioRecorderRef.current) {
      audioRecorderRef.current.stop();

      audioRecorderRef.current.onstop = () => {
        if (chunks.current.length === 0) return;

        const blob: Blob = new Blob(chunks.current, {
          type: "audio/ogg; codecs=opus",
        });

        if (currentMediaStream) {
          closeStream(currentMediaStream);
        }

        chunks.current = [];

        onStopRecording && onStopRecording(blob);
      };
    } else {
      setError(new Error("Audio recorder not available"));
    }
  }, [onStopRecording, currentMediaStream]);

  const handleRestart = useCallback(() => {
    setCurrentMediaStream(null);
  }, []);

  return {
    error,
    currentMediaStream,
    stopRecord: handleStopRecording,
    restartRecord: handleRestart,
    loading: gettingMediaStream,
    chunks,
  };
};

export default useRecorder;
