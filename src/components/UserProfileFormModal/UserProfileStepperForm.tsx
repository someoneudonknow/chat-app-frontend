import { Box, Step, StepLabel, Stepper } from "@mui/material";
import React, { useState } from "react";
import AnimatedStepIcon from "./AnimatedStepIcon";
import AnimatedStepConnector from "./AnimatedStepConnector";
import BasicInfoForm from "./BasicInfoForm";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { increaseProfileStep } from "../../store/user/asyncThunks";
import { toast } from "react-toastify";
import InterestsForm from "./InterestForm/InterestsForm";
import IndustryForm from "./IndustryForm";

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
    const obj: { [k: number]: boolean } = {};

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
    </Box>
  );
};

export default UserProfileStepperForm;
