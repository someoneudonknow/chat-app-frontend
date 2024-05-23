import React, { useEffect, useState } from "react";
import {
  ContactRequestListWrapper,
  SentContactRequestItem,
} from "../../components/ContactRequest";
import ContactRequest from "../../models/contactRequest.model";
import { ContactService } from "../../services";
import { BASE_URL } from "../../constants/api-endpoints";
import { Box, CircularProgress, Typography } from "@mui/material";
import { toast } from "react-toastify";

const SentContactsList: React.FC = () => {
  const [sentContactRequests, setSentContactRequests] = useState<
    ContactRequest[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [cancelLoading, setCancelLoading] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const contactRequestService = new ContactService(BASE_URL);
        const result = await contactRequestService.getSentContactRequests();

        setSentContactRequests(result.metadata.list);
      } catch (e: any) {
        console.error(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleItemCancelBtnClick = async (id: string) => {
    try {
      setCancelLoading(true);
      const contactRequestService = new ContactService(BASE_URL);
      const result = await contactRequestService.cancelContactRequest(id);

      setSentContactRequests((prev) =>
        prev.filter((c) => c._id !== result.metadata._id)
      );
    } catch (e: any) {
      toast.error(e.message as string);
    } finally {
      setCancelLoading(false);
    }
  };

  const handleEditSuccess = (updated: ContactRequest) => {
    setSentContactRequests(
      sentContactRequests.map((sc) => (sc._id === updated._id ? updated : sc))
    );
  };

  return (
    <>
      {loading && (
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress />
        </Box>
      )}
      {!loading && sentContactRequests && (
        <ContactRequestListWrapper>
          {sentContactRequests.length > 0 &&
            sentContactRequests.map((ctr) => (
              <SentContactRequestItem
                loading={cancelLoading}
                onCancelClick={handleItemCancelBtnClick}
                onEditSuccess={handleEditSuccess}
                key={ctr._id}
                data={ctr}
              />
            ))}
          {sentContactRequests.length === 0 && (
            <Typography
              component="div"
              variant="h5"
              sx={{ textAlign: "center", width: "100%" }}
            >
              You haven't sent contact requests
            </Typography>
          )}
        </ContactRequestListWrapper>
      )}
    </>
  );
};

export default SentContactsList;
