import React, { useState } from "react";
import { Box, IconButton, Paper, TextField, styled } from "@mui/material";
import UserBgChooserPreview from "../ImageChooserPreview/UserBgChooserPreview";
import UserAvtChooserPreview from "../ImageChooserPreview/UserAvtChooserPreview";
import User from "../../models/user.model";
import { convertBase64ToBlob } from "../../utils";
import { ModeEdit } from "@mui/icons-material";
import UploadService from "../../services/UploadService";
import { BASE_URL } from "../../constants/api-endpoints";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { updateProfile } from "../../store/user/asyncThunks";
import UserDescriptionFormModal from "../UserDescriptionFormModal";
import UserInfoFormModal from "../UserInfoFormModal";
import ProfileCardBasicInfo from "./ProfileCardBasicInfo";

type ProfileCardPropsType = {
  user: User;
};

export const EditButton = styled(IconButton)(({ theme }) => ({
  height: "45px",
  width: "45px",
  boxShadow: theme.shadows[4],
  position: "absolute",
  right: "16px",
  bottom: "16px",
  border: `1px solid ${theme.palette.background.paper}`,
}));

const AVATAR_SIZE = 120;

const ProfileCard: React.FC<ProfileCardPropsType> = ({ user }) => {
  const [userBg, setUserBg] = useState<string | undefined>(user?.background);
  const [userAvt, setUserAvt] = useState<string | undefined>(user?.photo);
  const [infoHover, setInfoHover] = useState<boolean>();
  const [descHover, setDescHover] = useState<boolean>();
  const [bgUploadLoading, setBgUploadLoading] = useState<boolean>();
  const [avtLoading, setAvtLoading] = useState<boolean>(false);
  const [openDescForm, setOpenDescForm] = useState<boolean>(false);
  const [openInfoForm, setOpenInfoForm] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();

  const handleBgSelect = async (imgBase64: string) => {
    const uploadService = new UploadService(BASE_URL);
    const formData = new FormData();
    const blobObj = convertBase64ToBlob(imgBase64);

    formData.append("attachment", blobObj);

    try {
      setBgUploadLoading(true);

      const downloadUrl = await uploadService.uploadOne({ formData });

      await dispatch(
        updateProfile({ background: downloadUrl?.metadata?.content?.secureUrl })
      );

      setUserBg(imgBase64);
    } catch (e: any) {
      console.error(e);
    } finally {
      setBgUploadLoading(false);
    }
  };

  const handleAvtSelect = async (imgBase64: string) => {
    const uploadService = new UploadService(BASE_URL);
    const formData = new FormData();
    const blobObj = convertBase64ToBlob(imgBase64);

    formData.append("attachment", blobObj);

    try {
      setAvtLoading(true);

      const downloadUrl = await uploadService.uploadOne({ formData });

      await dispatch(
        updateProfile({ photo: downloadUrl?.metadata?.content?.secureUrl })
      );

      setUserAvt(imgBase64);
    } catch (e: any) {
      console.error(e);
    } finally {
      setAvtLoading(false);
    }
  };

  return (
    <>
      <UserDescriptionFormModal
        handleClose={() => setOpenDescForm(false)}
        open={openDescForm}
      />
      <UserInfoFormModal
        open={openInfoForm}
        handleClose={() => setOpenInfoForm(false)}
      />
      <Paper
        sx={{
          borderRadius: 5,
          width: "100%",
          p: 3,
        }}
        component="div"
      >
        <Box
          component="div"
          sx={{
            position: "relative",
            mb: `calc(50px * ${AVATAR_SIZE} / 100)`,
          }}
        >
          <UserBgChooserPreview
            loading={bgUploadLoading}
            src={userBg}
            onSelect={handleBgSelect}
          />
          <UserAvtChooserPreview
            sx={{
              zIndex: 1001,
              position: "absolute",
              bottom: "0",
              left: "16px",
              transform: "translateY(50%)",
            }}
            loading={avtLoading}
            avatarSize={AVATAR_SIZE}
            src={userAvt}
            onSelect={handleAvtSelect}
          />
        </Box>
        <div style={{ height: "0.05px" }}></div>
        <Box
          onMouseEnter={() => setInfoHover(true)}
          onMouseLeave={() => setInfoHover(false)}
          component="div"
          sx={{
            position: "relative",
            pt: 1,
            pb: 4,
            borderRadius: "5px",
            "& > *": {
              display: "inline-block",
            },
            "&:hover": {
              cursor: "pointer",
            },
            "&:hover > *:not(:last-child)": {
              opacity: 0.4,
            },
          }}
        >
          <ProfileCardBasicInfo user={user} />
          {infoHover && (
            <EditButton onClick={() => setOpenInfoForm(true)}>
              <ModeEdit />
            </EditButton>
          )}
        </Box>
        <Box
          component="div"
          onMouseEnter={() => setDescHover(true)}
          onMouseLeave={() => setDescHover(false)}
          sx={{
            position: "relative",
            "&:hover": {
              cursor: "pointer",
            },
            "&:hover > *:not(:last-child)": {
              opacity: 0.4,
            },
          }}
        >
          <TextField
            InputProps={{
              readOnly: true,
            }}
            value={user?.description || ""}
            fullWidth
            multiline
            minRows={4}
            placeholder="Share your thought..."
          />
          {descHover && (
            <EditButton onClick={() => setOpenDescForm(true)}>
              <ModeEdit />
            </EditButton>
          )}
        </Box>
      </Paper>
    </>
  );
};

export default ProfileCard;
