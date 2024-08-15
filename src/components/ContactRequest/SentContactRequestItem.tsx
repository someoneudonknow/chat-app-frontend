import React, { SyntheticEvent, useState } from "react";
import ContactRequest from "../../models/contactRequest.model";
import { Avatar, Button, Stack, TextField, Tooltip } from "@mui/material";
import { TextOverflowEllipsis } from "../Person/PersonItem";
import User from "../../models/user.model";
import ContactRequestCardWrapper from "./ContactRequestCardWrapper";
import { DialogResult } from "../../constants/types";
import ConfirmDialog from "../ConfirmDialog";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { ContactService } from "../../services";
import { BASE_URL } from "../../constants/api-endpoints";
import { useNavigate } from "react-router-dom";

type ContactRequestItemPropsType = {
  data: ContactRequest;
  onCancelClick?: (id: string) => void;
  onEditSuccess?: (updatedContactRequest: ContactRequest) => void;
  loading?: boolean;
};

const GAP = "1rem";

const SentContactRequestItem: React.FC<ContactRequestItemPropsType> = ({
  data,
  onCancelClick,
  onEditSuccess,
  loading,
}) => {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [updateLoading, setUpdateLoading] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ requestMessage: string }>({
    defaultValues: {
      requestMessage: data.requestMessage || "",
    },
  });
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/user/discover/${(data.receiver as User)._id}`);
  };

  const handleEditBtnClicked = (e: SyntheticEvent) => {
    e.stopPropagation();
    setDialogOpen(true);
  };

  const handleConfirm = async (result: DialogResult) => {
    if (result === DialogResult.OK) {
      handleSubmit(async ({ requestMessage }) => {
        if (requestMessage !== data.requestMessage) {
          try {
            setUpdateLoading(true);
            const contactService = new ContactService(BASE_URL);
            const updated = await contactService.updateContactRequest({
              id: data._id,
              message: requestMessage,
            });

            onEditSuccess &&
              onEditSuccess(updated.metadata.contactRequest as ContactRequest);
          } catch (e: any) {
            toast.error(e.message as string);
          } finally {
            setUpdateLoading(false);
          }
        }

        setDialogOpen(false);
      })();
    } else {
      setDialogOpen(false);
    }
  };

  return (
    <>
      <ConfirmDialog
        actions={[
          {
            label: "Cancel",
            resultType: DialogResult.CANCEL,
            ownProps: { disabled: updateLoading },
          },
          {
            label: "Save",
            resultType: DialogResult.OK,
            ownProps: {
              variant: "contained",
              disabled: updateLoading,
            },
          },
        ]}
        bodyContent={
          <TextField
            {...register("requestMessage", {
              required: "Request message is required",
            })}
            error={!!errors.requestMessage}
            helperText={errors?.requestMessage?.message}
            placeholder="Enter your request message"
            sx={{ width: "400px" }}
            fullWidth
          />
        }
        open={dialogOpen}
        title="Edit contact request"
        onConfirm={handleConfirm}
      />
      <ContactRequestCardWrapper gap={GAP} onClick={handleCardClick}>
        <Avatar
          src={(data.receiver as Partial<User>).photo}
          sx={{
            width: `100%`,
            height: `212px`,
            borderRadius: 2,
          }}
        />
        <Stack
          direction="column"
          sx={{ width: "100%", mt: "auto", position: "relative" }}
        >
          <TextOverflowEllipsis
            variant="h5"
            sx={{
              oveflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
            }}
          >
            {(data.receiver as Partial<User>).userName ||
              (data.receiver as Partial<User>).email}
          </TextOverflowEllipsis>
          <Tooltip title="Edit request message">
            <TextOverflowEllipsis
              onClick={handleEditBtnClicked}
              sx={{
                letterSpacing: 1,
                "&:hover": {
                  opacity: 0.7,
                },
              }}
              color="secondary"
            >
              {data.requestMessage}
            </TextOverflowEllipsis>
          </Tooltip>
        </Stack>
        <Stack direction="column" spacing={1} sx={{ mt: 3 }}>
          <Button
            disabled={loading}
            onClick={(e) => {
              e.stopPropagation();
              onCancelClick && onCancelClick(data._id);
            }}
            variant="contained"
            color="error"
          >
            Cancel
          </Button>
        </Stack>
      </ContactRequestCardWrapper>
    </>
  );
};

export default SentContactRequestItem;
