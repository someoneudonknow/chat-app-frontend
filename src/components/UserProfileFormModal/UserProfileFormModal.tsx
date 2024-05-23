import React from "react";
import ConfirmDialog from "../ConfirmDialog";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Modal,
  Slide,
} from "@mui/material";
import { FadeIn } from "../Transitions";
import { motion } from "framer-motion";
import UserProfileStepperForm from "./UserProfileStepperForm";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

type UserProfileFormModalPropsType = {
  open: boolean;
  onClose: () => void;
};

const UserProfileFormModal: React.FC<UserProfileFormModalPropsType> = ({
  open,
  onClose,
}) => {
  const currentStep = useSelector(
    (state: RootState) => state.user.currentUser?.lastCompletedUserProfileStep
  );

  return (
    <Modal
      open={open}
      closeAfterTransition
      slotProps={{
        backdrop: {
          TransitionComponent: FadeIn,
        },
      }}
    >
      <motion.div
        style={{ position: "absolute", top: "50%", left: "50%" }}
        initial={{ y: window.innerHeight, x: "-50%", opacity: 0 }}
        animate={{ y: "-50%", x: "-50%", opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Box
          sx={{
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 3,
            width: 1200,
            borderRadius: "10px",
          }}
        >
          <UserProfileStepperForm
            closeModal={onClose}
            initStep={currentStep ?? 0}
          />
        </Box>
      </motion.div>
    </Modal>
  );
};

export default UserProfileFormModal;
