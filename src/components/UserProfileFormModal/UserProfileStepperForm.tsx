import {
  Box,
  Button,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import AnimatedStepIcon from "./AnimatedStepIcon";
import AnimatedStepConnector from "./AnimatedStepConnector";
import BasicInfoForm from "./BasicInfoForm";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { increaseProfileStep } from "../../store/user/asyncThunks";
import { toast } from "react-toastify";
import InterestsForm from "./InterestForm/InterestsForm";
import IndustryForm from "./IndustryForm";
import Lottie from "lottie-react";
import congratAni from "../../assets/animations/congrat-ani.json";
import congratPopoutAni from "../../assets/animations/congrat-popout-ani.json";

const STEPS = [
  "Basic information ℹ️",
  "Your Industry or Area of study 📚",
  "Share your Interests with us 😃",
];

type UserProfileStepperFormPropsType = {
  initStep: number;
  closeModal: () => void;
};

const UserProfileStepperForm: React.FC<UserProfileStepperFormPropsType> = ({
  initStep = 0,
  closeModal,
}) => {
  const [activeStep, setActiveStep] = useState<number>(initStep);
  const [completed, setCompleted] = useState<{ [k: number]: boolean }>(() => {
    let obj: { [k: number]: boolean } = {};

    for (let i = 0; i < initStep; i++) {
      obj[i] = true;
    }

    return obj;
  });
  const dispatch = useDispatch<AppDispatch>();

  const allStepsCompleted = () => {
    return Object.keys(completed).length === STEPS.length;
  };

  const isLastStep = () => activeStep === STEPS.length - 1;

  const nextStep = () => {
    setActiveStep((prev) => {
      if (!isLastStep()) {
        return prev + 1;
      }
      return prev;
    });
    setCompleted((prev) => ({ ...prev, [activeStep]: true }));
  };

  const handleSubmitSuccess = async () => {
    try {
      await dispatch(increaseProfileStep());
      nextStep();
    } catch (e: any) {
      toast.error(e.message || "Something failed");
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      {!allStepsCompleted() && (
        <>
          <Stepper
            activeStep={activeStep}
            nonLinear
            alternativeLabel
            connector={<AnimatedStepConnector />}
          >
            {STEPS.map((step, i) => (
              <Step key={step} completed={completed[i]}>
                <StepLabel StepIconComponent={AnimatedStepIcon}>
                  {step}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
          <Box
            sx={{
              width: "100%",
              px: "50px",
              py: "20px",
            }}
          >
            {activeStep === 0 && (
              <BasicInfoForm onSubmitSuccess={handleSubmitSuccess} />
            )}
            {activeStep === 1 && (
              <IndustryForm onSubmitSuccess={handleSubmitSuccess} />
            )}
            {activeStep === 2 && (
              <InterestsForm onSubmitSuccess={handleSubmitSuccess} />
            )}
          </Box>
        </>
      )}
      {allStepsCompleted() && (
        <Box
          sx={{
            height: "60vh",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            backgroundClip: "padding-box",
            border: "solid 5px transparent",
            overflow: "hidden",

            "&:before": {
              content: "''",
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              zIndex: -1,
              margin: "-5px" /* !importanté */,
              borderRadius: "10px" /* !importanté */,
              backgroundColor: "#0093E9",
              backgroundImage:
                "linear-gradient(160deg, #0093E9 0%, #80D0C7 100%)",
            },
          }}
        >
          <div
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography variant="h4">That's all, thank you</Typography>
            <Lottie
              style={{
                width: 100,
              }}
              animationData={congratPopoutAni}
            />
          </div>
          <Lottie
            style={{
              height: 200,
            }}
            animationData={congratAni}
          />
          <div>
            <Button
              onClick={() => closeModal()}
              sx={{ width: "40%" }}
              variant="contained"
            >
              Finish
            </Button>
          </div>
        </Box>
      )}
    </Box>
  );
};

export default UserProfileStepperForm;
