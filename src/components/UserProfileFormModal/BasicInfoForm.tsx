import { Box, Button, Grid, TextField } from "@mui/material";
import React, { useState } from "react";
import { FieldValue, FieldValues, useForm } from "react-hook-form";
import CountriesSelect, { Country } from "../CountriesSelect";
import DateOfBirthPicker from "../UIs/DateOfBirthPicker";
import moment from "moment";
import RadioButtonGroup from "../UIs/RadioButtonGroup";
import { motion } from "framer-motion";
import TextTypingAnimate from "../UIs/TextTypingAnimate";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import LoadingButton from "../UIs/LoadingButton";
import User from "../../models/user.model";
import UserService from "../../services/UserService";
import { BASE_URL } from "../../constants/api-endpoints";
import { toast } from "react-toastify";
import { updateProfile } from "../../store/user/asyncThunks";

type BasicInfoFormPropsType = {
  onSubmitSuccess: () => void;
};

const BasicInfoForm: React.FC<BasicInfoFormPropsType> = ({
  onSubmitSuccess,
}) => {
  const currUser = useSelector((state: RootState) => state.user.currentUser);
  const [gender, setGender] = useState<string>(currUser?.gender || "MALE");
  const [selectedCountry, setSelectedCountry] = useState<{
    countryName: string;
    countryCode: string;
  }>();
  const loading = useSelector((state: RootState) => state.user.isLoading);
  const dispatch = useDispatch<AppDispatch>();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleCountriesSelectionChange = (c?: Country) => {
    if (c) {
      const newSelection = {
        countryName: c.name,
        countryCode: c.Iso2,
      };
      setSelectedCountry(newSelection);
    }
  };

  const handleGendersChange = (val: any) => {
    setGender(val);
  };

  const handleFormSubmit = async (formValues: FieldValues) => {
    const colectedData: Partial<User> = {
      userName: formValues.userName,
      birthday: formValues.userDob.toDate(),
      gender: gender,
      country: selectedCountry,
    };

    try {
      await dispatch(updateProfile(colectedData));
      onSubmitSuccess();
    } catch (err: any) {
      toast.error("Something went wrong please try again later");
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(handleFormSubmit)}
      sx={{ width: "100%" }}
    >
      <TextTypingAnimate
        style={{ fontSize: "32px" }}
        text="Let us know a little bit about you"
      />
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            defaultValue={currUser?.userName || ""}
            fullWidth
            label="Enter your username or display name..."
            {...register("userName", {
              maxLength: {
                value: 50,
                message: "Username must be lower than 50 characters ",
              },
            })}
            error={!!errors?.userName}
            helperText={errors?.userName?.message as string}
          />
        </Grid>
        <Grid item xs={12}>
          <RadioButtonGroup
            onCheckChange={handleGendersChange}
            defaultValue={currUser?.gender || "MALE"}
            id="gender"
            name="gender radio btn"
            formLabel="Select your gender"
            data={[
              {
                label: "Male",
                value: "MALE",
              },
              {
                label: "Female",
                value: "FEMALE",
              },
              {
                label: "Nonbinary",
                value: "NON_BINARY",
              },
              {
                label: "Genderqueer",
                value: "GENDERQUEER",
              },
              {
                label: "Unknown",
                value: "UNKNOWN",
              },
            ]}
          />
        </Grid>
        <Grid item xs={6}>
          <CountriesSelect onSelectionChange={handleCountriesSelectionChange} />
        </Grid>
        <Grid item xs={6}>
          <DateOfBirthPicker
            control={control}
            name="userDob"
            defaultValue={moment(currUser?.birthday).toDate()}
            slotProps={{
              textField: {
                fullWidth: true,
                error: !!errors.userDob,
                helperText: errors?.userDob?.message,
              },
            }}
          />
        </Grid>
      </Grid>
      <Box
        component="div"
        sx={{ display: "flex", justifyContent: "center", mt: "70px" }}
      >
        <LoadingButton
          loading={loading}
          type="submit"
          variant="contained"
          sx={{ width: "70%" }}
        >
          Next
        </LoadingButton>
      </Box>
    </Box>
  );
};

export default BasicInfoForm;
