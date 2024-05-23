import React, { ChangeEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { Box, LinearProgress, Modal, TextField, styled } from "@mui/material";
import { FadeIn } from "./Transitions";
import ConfirmDialog from "./ConfirmDialog";
import { DialogResult } from "../constants/types";
import { updateProfile } from "../store/user/asyncThunks";
import { toast } from "react-toastify";

const TextFieldAutoGrow = styled(TextField)(() => ` scrollbar-width: "none";`);

type UserDescriptionFormModalPropsType = {
  open: boolean;
  handleClose: () => void;
};

const UserDescriptionFormModal: React.FC<UserDescriptionFormModalPropsType> = ({
  open,
  handleClose,
}) => {
  const currentDescription = useSelector(
    (state: RootState) => state.user.currentUser?.description
  );
  const [desc, setDesc] = useState<string>();
  const dispatch = useDispatch<AppDispatch>();
  const loading = useSelector((state: RootState) => state.user.isLoading);

  const handleConfirm = async (result: DialogResult) => {
    if (result === DialogResult.OK) {
      try {
        await dispatch(updateProfile({ description: desc }));
        handleClose();
      } catch (err: any) {
        toast.error(err?.message || "Something went wrong");
      }
    } else if (result === DialogResult.CANCEL) {
      handleClose();
    } else {
      handleClose();
    }
  };

  return (
    <ConfirmDialog
      title="Edit my description"
      open={open}
      actions={[
        {
          label: "Cancel",
          resultType: DialogResult.CANCEL,
          ownProps: {
            disabled: loading,
          },
        },
        {
          label: "Save",
          resultType: DialogResult.OK,
          ownProps: {
            variant: "contained",
            disabled: loading,
          },
        },
      ]}
      onConfirm={handleConfirm}
      bodyContent={
        <Box
          sx={{ width: "500px", mt: 1, position: "relative" }}
          component="form"
        >
          {loading && (
            <Box
              sx={{
                position: "absolute",
                zIndex: (theme) => theme.zIndex.drawer,
                bottom: 0,
                left: 0,
                width: "100%",
                height: "100%",
                bgcolor: "rgba(255, 255, 255, 0.2)",
                overflow: "hidden",
                display: "flex",
                alignItems: "flex-end",
                borderRadius: 1,
              }}
            >
              <LinearProgress
                sx={{
                  width: "100%",
                  borderBottomLeftRadius: "100vmax",
                  borderBottomRightRadius: "100vmax",
                }}
              />
            </Box>
          )}
          <TextFieldAutoGrow
            label="Share your thought..."
            fullWidth
            multiline
            minRows={4}
            defaultValue={currentDescription}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setDesc(e.target.value)
            }
            value={desc}
          />
        </Box>
      }
    />
  );
};

export default UserDescriptionFormModal;
