import { Box, CircularProgress, SxProps, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  ContactRequestListWrapper,
  PendingContactRequestItem,
} from "../../components/ContactRequest";
import { ContactService } from "../../services";
import { BASE_URL } from "../../constants/api-endpoints";
import ContactRequest from "../../models/contactRequest.model";
import { toast } from "react-toastify";

const PendingContactsList: React.FC = () => {
  const [pendingContactRequest, setPendingContactRequest] = useState<
    ContactRequest[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const contactRequestService = new ContactService(BASE_URL);
        const result = await contactRequestService.getReceivedContactRequests();

        setPendingContactRequest(result.metadata.list);
      } catch (e: any) {
        toast.error(e.message as string);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleActionsSuccess = (id: string) => {
    setPendingContactRequest((prev) => prev.filter((c) => c._id !== id));
  };

  return (
    <>
      {loading && (
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress />
        </Box>
      )}
      {!loading && pendingContactRequest && (
        <ContactRequestListWrapper>
          {pendingContactRequest.length > 0 &&
            pendingContactRequest.map((ctr) => (
              <PendingContactRequestItem
                onAcceptSuccess={handleActionsSuccess}
                onRejectSuccess={handleActionsSuccess}
                key={ctr._id}
                data={ctr}
              />
            ))}
          {pendingContactRequest.length === 0 && (
            <Typography
              component="div"
              variant="h5"
              sx={{ textAlign: "center", width: "100%" }}
            >
              You haven't had any pendding contact requests
            </Typography>
          )}
        </ContactRequestListWrapper>
      )}
    </>
  );
};

export default PendingContactsList;
