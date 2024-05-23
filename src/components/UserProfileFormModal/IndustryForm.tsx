import { Box } from "@mui/material";
import React, { useState } from "react";
import Industry from "../../models/industry.model";
import TextTypingAnimate from "../UIs/TextTypingAnimate";
import LoadingButton from "../UIs/LoadingButton";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { updateProfile } from "../../store/user/asyncThunks";
import IndustriesSelect from "../IndustriesSelect";

type IndustryFormPropsType = {
  onSubmitSuccess: () => void;
};

const IndustryForm: React.FC<IndustryFormPropsType> = ({ onSubmitSuccess }) => {
  const [selectedIndustry, setSelectedIndustry] = useState<Industry | null>(
    null
  );
  const dispatch = useDispatch<AppDispatch>();
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);

  const handleSelectionChange = (_: any, newVal?: Industry) => {
    if (newVal) {
      setSelectedIndustry(newVal);
    }
  };

  const handleSubmit = async () => {
    if (!selectedIndustry) return;

    try {
      setSubmitLoading(true);
      await dispatch(updateProfile({ industry: selectedIndustry._id }));
    } catch (err: any) {
      console.error(err);
    } finally {
      setSubmitLoading(false);
    }

    onSubmitSuccess();
  };

  return (
    <Box
      component="div"
      sx={{
        height: "60vh",
        textAlign: "center",
        "& > *": {
          display: "inline-block",
        },
        position: "relative",
      }}
    >
      <TextTypingAnimate
        style={{ fontSize: "32px" }}
        text="The field you are currently working in 📚"
      />
      <IndustriesSelect onSelectionChange={handleSelectionChange} />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: "auto",
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
        }}
      >
        <LoadingButton
          onClick={handleSubmit}
          loading={submitLoading}
          variant="contained"
          sx={{ width: "70%" }}
        >
          Next
        </LoadingButton>
      </Box>
    </Box>
  );
};

export default IndustryForm;
