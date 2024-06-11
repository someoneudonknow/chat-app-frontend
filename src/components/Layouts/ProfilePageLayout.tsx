import { ArrowBack } from "@mui/icons-material";
import { Container, IconButton, Paper } from "@mui/material";
import React, { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

const APP_BAR_HEIGHT = 50;

type ProfilePageLayoutPropsType = {
  children: ReactNode;
};

const ProfilePageLayout: React.FC<ProfilePageLayoutPropsType> = ({
  children,
}) => {
  const navigate = useNavigate();

  const handleBackBtnClicked = () => {
    navigate("/user/chat/all-conservations");
  };

  return (
    <Container maxWidth="lg" sx={{ pt: `${APP_BAR_HEIGHT + 20}px` }}>
      <Paper
        sx={{
          width: "100vw",
          height: `${APP_BAR_HEIGHT}px`,
          position: "fixed",
          top: 0,
          left: 0,
          px: 2,
          display: "flex",
          alignItems: "center",
        }}
      >
        <IconButton onClick={handleBackBtnClicked} size="medium">
          <ArrowBack />
        </IconButton>
      </Paper>
      {children}
    </Container>
  );
};

export default ProfilePageLayout;
