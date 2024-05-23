import { Box, Paper, Slide } from "@mui/material";
import Lottie from "lottie-react";
import pageloadAnimation from "../assets/animations/page-loading.json";

const PageLoader: React.FC = () => {
  return (
    <Slide in={true}>
      <Paper
        elevation={8}
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <Lottie
            style={{
              width: 200,
            }}
            animationData={pageloadAnimation}
          />
        </Box>
      </Paper>
    </Slide>
  );
};

export default PageLoader;
