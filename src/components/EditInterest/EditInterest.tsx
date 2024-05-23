import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { Box, IconButton, Modal, Slide, Typography } from "@mui/material";
import UserInterestList from "../UserInterestList";
import { EditButton } from "../ProfileCard/ProfileCard";
import { ModeEdit } from "@mui/icons-material";
import ConfirmDialog from "../ConfirmDialog";
import { DialogResult } from "../../constants/types";
import EditInterestForm from "./EditInterestForm";

const EditInterest = () => {
  const userInterest = useSelector(
    (state: RootState) => state.user.currentUser?.interests
  );
  const [hover, setHover] = useState<boolean>(false);
  const [openEditForm, setOpenEditForm] = useState<boolean>(false);

  const handleCloseModal = () => {
    setOpenEditForm(false);
  };

  return (
    <>
      <Modal open={openEditForm}>
        <EditInterestForm handleClose={handleCloseModal} />
      </Modal>
      <Box
        component="div"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        sx={{ position: "relative" }}
      >
        <Typography sx={{ fontSize: "20px", mb: 1 }}>Interests</Typography>
        <UserInterestList data={userInterest} />

        {hover && (
          <EditButton onClick={() => setOpenEditForm(true)}>
            <ModeEdit />
          </EditButton>
        )}
      </Box>
    </>
  );
};

export default EditInterest;
