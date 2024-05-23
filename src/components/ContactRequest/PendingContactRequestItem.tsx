import React, { SyntheticEvent, useState } from "react";
import ContactRequestCardWrapper from "./ContactRequestCardWrapper";
import { Avatar, Button, Stack, Tooltip } from "@mui/material";
import { TextOverflowEllipsis } from "../Person/PersonItem";
import ContactRequest from "../../models/contactRequest.model";
import User from "../../models/user.model";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ContactService } from "../../services";
import { BASE_URL } from "../../constants/api-endpoints";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { getProfile } from "../../store/user";

type PendingContactRequestItemPropsType = {
  data: ContactRequest;
  onAcceptSuccess?: (id: string) => void;
  onRejectSuccess?: (id: string) => void;
};

const GAP = "1rem";

const PendingContactRequestItem: React.FC<
  PendingContactRequestItemPropsType
> = ({ data, onAcceptSuccess, onRejectSuccess }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();

  const handleCardClick = () => {
    navigate(`/user/discover/${(data.sender as User)._id}`);
  };

  const handleAccept = async (e: SyntheticEvent) => {
    e.stopPropagation();
    try {
      setLoading(true);
      const contactService = new ContactService(BASE_URL);
      await contactService.acceptContactRequest(data._id);
      await dispatch(getProfile());
      toast.success(
        `Successfully add ${
          (data.sender as User).userName || (data.sender as User).email
        } to your contacts`
      );
      onAcceptSuccess && onAcceptSuccess(data._id);
    } catch (e: any) {
      toast.error(e.message as string);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (e: SyntheticEvent) => {
    e.stopPropagation();
    try {
      setLoading(true);
      const contactService = new ContactService(BASE_URL);
      await contactService.rejectContactRequest(data._id);
      onRejectSuccess && onRejectSuccess(data._id);
    } catch (e: any) {
      toast.error(e.message as string);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ContactRequestCardWrapper gap={GAP} onClick={handleCardClick}>
      <Avatar
        src={(data.sender as User).photo}
        sx={{
          width: `100%`,
          height: `212px`,
          borderRadius: 2,
        }}
      />
      <Stack direction="column" sx={{ width: "100%" }}>
        <TextOverflowEllipsis variant="h5">
          {(data.sender as Partial<User>).userName ||
            (data.sender as Partial<User>).email}
        </TextOverflowEllipsis>
        <Tooltip title={data.requestMessage}>
          <TextOverflowEllipsis sx={{ letterSpacing: 1 }} color="secondary">
            {data.requestMessage}
          </TextOverflowEllipsis>
        </Tooltip>
        <Stack direction="column" spacing={1} sx={{ mt: 3 }}>
          <Button disabled={loading} onClick={handleAccept} variant="contained">
            Accept
          </Button>
          <Button disabled={loading} onClick={handleReject} variant="outlined">
            Reject
          </Button>
        </Stack>
      </Stack>
    </ContactRequestCardWrapper>
  );
};

export default PendingContactRequestItem;
