import { StepConnector, stepConnectorClasses, styled } from "@mui/material";

const AnimatedStepConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 10,
    left: "calc(-50% + 25px)",
    right: "calc(50% + 25px)",
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor:
      theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
    borderTopWidth: 3,
    borderRadius: 1,
    postion: "relative",
    transition: "all ease 1s",

    [`&::before`]: {
      content: "''",
      position: "absolute",
      top: 0,
      left: 0,
      bottom: 0,
      height: "100%",
      width: "0%",
      backgroundColor: "#784af4",
      transition: "all ease 1s",
    },
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      [`&::before`]: {
        width: "100%",
      },
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      [`&::before`]: {
        width: "100%",
      },
    },
  },
}));

export default AnimatedStepConnector;
