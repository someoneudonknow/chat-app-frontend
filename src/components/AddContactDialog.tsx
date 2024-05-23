import React, { useState } from "react";
import ConfirmDialog from "./ConfirmDialog";
import { DialogResult } from "../constants/types";
import { Box, TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { addContact } from "../store/contactRequest";
import { ContactService } from "../services";
import { BASE_URL } from "../constants/api-endpoints";
import { toast } from "react-toastify";
import ContactRequest from "../models/contactRequest.model";

type AddContactDialogPropsType = {
  open: boolean;
  handleClose: () => void;
  userId: string;
  onSendSuccess?: (newContactRequest: ContactRequest) => void;
};

const AddContactDialog: React.FC<AddContactDialogPropsType> = ({
  open,
  handleClose,
  userId,
  onSendSuccess,
}) => {
  const [requestMessage, setRequestMessage] = useState<string>(
    "Hello, Let's be friends!!!"
  );
  const [loading, setLoading] = useState<boolean>(false);

  const handleConfirm = async (result: DialogResult) => {
    if (result === DialogResult.OK) {
      try {
        setLoading(true);
        const contactRequestService = new ContactService(BASE_URL);
        const result = await contactRequestService.addContact({
          receiver: userId,
          requestMessage: requestMessage,
        });
        onSendSuccess && onSendSuccess(result.metadata as ContactRequest);
        toast.success("Contact request has been sent");
      } catch (e: any) {
        toast.error(e.message as string);
      } finally {
        setLoading(false);
        handleClose();
      }
    } else if (result === DialogResult.CANCEL) {
      handleClose();
    }
  };

  return (
    <ConfirmDialog
      title="Create a contact request "
      open={open}
      onConfirm={handleConfirm}
      actions={[
        {
          label: "Cancel",
          resultType: DialogResult.CANCEL,
          ownProps: {
            disabled: loading,
          },
        },
        {
          label: "Add",
          resultType: DialogResult.OK,
          ownProps: {
            variant: "contained",
            sx: {
              marginLeft: 1,
            },
            disabled: loading,
          },
        },
      ]}
      bodyContent={
        <Box sx={{ py: 1, width: "25vw" }}>
          <TextField
            autoFocus
            fullWidth
            value={requestMessage}
            onChange={(e) => setRequestMessage(e.target.value)}
            placeholder="Write your short greeting text..."
          />
        </Box>
      }
    />
  );
};

export default AddContactDialog;
