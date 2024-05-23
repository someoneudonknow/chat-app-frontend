import React, { useEffect, useState } from "react";
import { ProfilePageLayout } from "../../components/Layouts";
import { useParams } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Grid,
  LinearProgress,
  Paper,
  TextField,
  Theme,
  Typography,
} from "@mui/material";
import ProfileCardBasicInfo from "../../components/ProfileCard/ProfileCardBasicInfo";
import UserService from "../../services/UserService";
import { BASE_URL } from "../../constants/api-endpoints";
import User from "../../models/user.model";
import BackgroundWrapper from "../../components/UIs/BackgroundWrapper";
import UserInterestList from "../../components/UserInterestList";
import { Cancel, PersonAdd } from "@mui/icons-material";
import AddContactDialog from "../../components/AddContactDialog";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { ContactService } from "../../services";
import ContactRequest from "../../models/contactRequest.model";

const AVT_SIZE = 120;

const PersonDiscover: React.FC = () => {
  const { userId } = useParams();
  const [currentUser, setCurrentUser] = useState<Partial<User>>();
  const [loading, setLoading] = useState<boolean>(false);
  const userContacts = useSelector(
    (state: RootState) => state.user.currentUser?.contactList
  );
  const isInContact = userId && userContacts && userContacts?.includes(userId);
  const [sentContactRequest, setSentContactRequest] = useState<string | null>(
    null
  );
  const [addContactDialogOpen, setAddContactDialogOpen] =
    useState<boolean>(false);

  const gradient = {
    dark: " linear-gradient(45deg, hsl(240deg 100% 20%) 0%, hsl(289deg 100% 21%) 11%, hsl(315deg 100% 27%) 22%, hsl(329deg 100% 36%) 33%, hsl(337deg 100% 43%) 44%, hsl(357deg 91% 59%) 56%, hsl(17deg 100% 59%) 67%,hsl(34deg 100% 53%) 78%,hsl(45deg 100% 50%) 89%, hsl(55deg 100% 50%) 100%)",
    light:
      "linear-gradient(40deg,hsl(240deg 47% 68%) 0%,hsl(294deg 37% 64%) 20%,hsl(334deg 65% 69%) 29%,hsl(357deg 83% 74%) 36%,hsl(18deg 83% 70%) 43%,hsl(36deg 67% 63%) 50%,hsl(30deg 70% 62%) 57%,hsl(24deg 72% 62%) 64%,hsl(17deg 72% 62%) 71%,hsl(9deg 70% 62%) 80%,hsl(0deg 66% 62%) 100%);",
  };

  useEffect(() => {
    if (!userId) return;

    (async () => {
      const userService = new UserService(BASE_URL);
      const contactService = new ContactService(BASE_URL);
      try {
        setLoading(true);
        const userInfo = await userService.discoverUser(userId);
        const sentContacts = await contactService.getSentContactRequests();

        setSentContactRequest(
          (sentContacts?.metadata?.list as ContactRequest[]).find(
            (u) => (u.receiver as User)._id === userId
          )?._id || null
        );
        setCurrentUser(userInfo.metadata);
      } catch (e: any) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [userId]);

  const handleOpenAddContactDialog = () => {
    setAddContactDialogOpen(true);
  };

  const handleSendContactSuccess = (newContactRequest: ContactRequest) => {
    setSentContactRequest(newContactRequest._id);
  };

  const handleCancelContactRequest = async () => {
    if (!sentContactRequest) return;

    const contactService = new ContactService(BASE_URL);
    try {
      setLoading(true);
      await contactService.cancelContactRequest(sentContactRequest);
      setSentContactRequest(null);
    } catch (e: any) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProfilePageLayout>
      {loading && <LinearProgress />}
      {currentUser?._id && (
        <AddContactDialog
          onSendSuccess={handleSendContactSuccess}
          userId={currentUser._id}
          handleClose={() => setAddContactDialogOpen(false)}
          open={addContactDialogOpen}
        />
      )}
      {!loading && currentUser && (
        <Grid container spacing={4}>
          <Grid item md={5} sm={12} xs={12}>
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
                  mb: `calc(50px * ${AVT_SIZE} / 100)`,
                }}
              >
                {isInContact && (
                  <Chip
                    size="small"
                    sx={{
                      position: "absolute",
                      top: "calc(100% + 5px)",
                      right: 0,
                      zIndex: 1001,
                      color: "white",
                    }}
                    label="In contacts"
                    color="info"
                  />
                )}
                <BackgroundWrapper
                  sx={{
                    backgroundImage: (theme: Theme) =>
                      `url(${currentUser?.background}), ${
                        gradient[theme.palette.mode]
                      }`,
                  }}
                />
                <Avatar
                  src={currentUser?.photo}
                  sx={{
                    width: `${AVT_SIZE}px`,
                    height: `${AVT_SIZE}px`,
                    zIndex: 1001,
                    position: "absolute",
                    bottom: "0",
                    left: "16px",
                    transform: "translateY(50%)",
                  }}
                />
              </Box>
              <Box
                component="div"
                sx={{
                  position: "relative",
                  pt: 1,
                  pb: 4,
                  borderRadius: "5px",
                  "& > *": {
                    display: "inline-block",
                  },
                }}
              >
                {currentUser && <ProfileCardBasicInfo user={currentUser} />}
              </Box>
              <TextField
                defaultValue={currentUser?.description}
                multiline
                fullWidth
                minRows={4}
                disabled
                placeholder="This user hasn't post any description"
              />
              {!isInContact && !sentContactRequest && (
                <Box sx={{ mt: 2, textAlign: "end" }}>
                  <Button
                    onClick={handleOpenAddContactDialog}
                    startIcon={<PersonAdd />}
                    variant="contained"
                    disabled={loading}
                  >
                    Add contact
                  </Button>
                </Box>
              )}
              {!isInContact && sentContactRequest && (
                <Box sx={{ mt: 2, textAlign: "end" }}>
                  <Button
                    onClick={handleCancelContactRequest}
                    startIcon={<Cancel />}
                    variant="contained"
                    color="error"
                    disabled={loading}
                  >
                    Cancel request
                  </Button>
                </Box>
              )}
            </Paper>
          </Grid>
          <Grid item md={7} sm={12} xs={12}>
            <Typography sx={{ fontSize: "20px", mb: 1 }}>
              Interested in
            </Typography>
            {currentUser?.interests && (
              <UserInterestList data={currentUser?.interests} />
            )}
          </Grid>
        </Grid>
      )}
    </ProfilePageLayout>
  );
};

export default PersonDiscover;
