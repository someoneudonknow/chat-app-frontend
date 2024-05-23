import React from "react";
import { Grid } from "@mui/material";
import authBg from "../../assets/images/auth-bg.webp";
import CoverImage from "../../components/UIs/CoverImage";
import Lottie from "lottie-react";
import authBgAni from "../../assets/animations/auth-bg-ani.json";
import { Outlet } from "react-router-dom";

const Auth: React.FC = () => {
  return (
    <Grid height="100vh" container>
      <Grid
        sx={{ justifyContent: "center", alignItems: "center", display: "flex" }}
        item
        md={6}
        p={2}
        xs={12}
      >
        <Outlet />
      </Grid>
      <Grid
        sx={{
          position: "relative",
        }}
        item
        md={6}
        xs={12}
      >
        <CoverImage
          src={authBg}
          style={{ position: "absolute", top: 0, left: 0 }}
        />
        <Lottie
          style={{
            height: 500,
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
          animationData={authBgAni}
        />
      </Grid>
    </Grid>
  );
};

export default Auth;
