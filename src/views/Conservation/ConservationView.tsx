import { useParams } from "react-router-dom";
import { ChatRoom } from "../../components/ChatRoom";
import { Conservation } from "../../models/conservation.model";
import { useLayoutEffect, useState } from "react";
import { ConservationService } from "../../services";
import { BASE_URL } from "../../constants/api-endpoints";
import { LinearProgress, Paper } from "@mui/material";
import ChatRoomContextProvider from "../../components/ChatRoom/context";
import ChatRoomAttachmentsProvider from "../../components/ChatRoom/context/ChatRoomAttachmentsProvider";

const ConservationView = () => {
  const { conservationId } = useParams();
  const [conservation, setConservation] = useState<Conservation>();
  const [loading, setLoading] = useState<boolean>(false);

  useLayoutEffect(() => {
    if (!conservationId) return;

    (async () => {
      setLoading(true);
      try {
        const conservationService = new ConservationService(BASE_URL);
        const foundConservation = await conservationService.getConservation(
          conservationId
        );
        setConservation(foundConservation.metadata as Conservation);
      } catch (err: any) {
        console.error(err);
      }
      setLoading(false);
    })();
  }, [conservationId]);

  return (
    <>
      {loading && (
        <Paper sx={{ flex: 1, position: "relative" }}>
          <LinearProgress
            sx={{ width: "100%", position: "absolute", top: 0 }}
          />
        </Paper>
      )}
      {conservation && !loading && (
        <ChatRoomContextProvider>
          <ChatRoomAttachmentsProvider>
            <ChatRoom conservation={conservation as Conservation} />
          </ChatRoomAttachmentsProvider>
        </ChatRoomContextProvider>
      )}
    </>
  );
};

export default ConservationView;
