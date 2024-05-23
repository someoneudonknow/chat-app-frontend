import { Grid } from "@mui/material";
import React from "react";
import { ProfileCard } from "../../components/ProfileCard";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import User from "../../models/user.model";
import { EditInterest } from "../../components/EditInterest";
import { ProfilePageLayout } from "../../components/Layouts";

const Profile: React.FC = () => {
  const user: User = useSelector<RootState>(
    (state) => state.user.currentUser
  ) as User;

  return (
    <ProfilePageLayout>
      <Grid container spacing={4}>
        <Grid item md={5} sm={12} xs={12}>
          <ProfileCard user={user} />
        </Grid>
        <Grid item md={7} sm={12} xs={12}>
          <EditInterest />
        </Grid>
      </Grid>
    </ProfilePageLayout>
  );
};

export default Profile;
