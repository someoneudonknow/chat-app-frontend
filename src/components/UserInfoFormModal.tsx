import {
  Box,
  CircularProgress,
  FormControl,
  FormHelperText,
  Input,
  InputLabel,
  LinearProgress,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { DialogResult, Gender } from "../constants/types";
import ConfirmDialog from "./ConfirmDialog";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { toast } from "react-toastify";
import { updateProfile } from "../store/user/asyncThunks";
import CountriesSelect, { Country } from "./CountriesSelect";
import RadioButtonGroup from "./UIs/RadioButtonGroup";
import IndustriesSelect from "./IndustriesSelect";
import Industry from "../models/industry.model";
import DateOfBirthPicker from "./UIs/DateOfBirthPicker";
import { useForm } from "react-hook-form";
import { Moment } from "moment";
import User from "../models/user.model";
import { removeDublicatedKeys } from "../utils";

type UserInfoFormModalPropsType = {
  open: boolean;
  handleClose: () => void;
};

const LoadingComponent = () => {
  return (
    <Box
      sx={{
        position: "absolute",
        zIndex: (theme) => theme.zIndex.drawer,
        bottom: 0,
        left: 0,
        width: "100%",
        height: "100%",
        bgcolor: "rgba(255, 255, 255, 0.2)",
        overflow: "hidden",
        display: "flex",
        alignItems: "flex-end",
        borderRadius: 1,
      }}
    >
      <CircularProgress />
    </Box>
  );
};

const UserInfoFormModal: React.FC<UserInfoFormModalPropsType> = ({
  open,
  handleClose,
}) => {
  const user = useSelector((state: RootState) => state.user.currentUser);
  const dispatch = useDispatch<AppDispatch>();
  const loading = useSelector((state: RootState) => state.user.isLoading);
  const [selectedCountry, setSelectedCountry] = useState<Country>();
  const [selectedGender, setSelectedGender] = useState<string | undefined>(
    user?.gender
  );
  const [selectedIndustry, setSelectedIndustry] = useState<
    Industry | undefined
  >(user?.industry as Industry);
  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<{ username: string; userDob: Moment | undefined }>({
    defaultValues: {
      username: user?.userName,
    },
  });

  const handleConfirm = async (result: DialogResult) => {
    if (result === DialogResult.OK) {
      handleSubmit(async ({ userDob, username }) => {
        const collectedData: Partial<User> = {
          userName: username,
          gender: selectedGender,
          ...(selectedCountry && {
            country: {
              countryName: selectedCountry.name,
              countryCode: selectedCountry.Iso2,
            },
          }),
          industry: selectedIndustry?._id,
          ...(userDob && { birthday: userDob?.toDate() }),
        };

        if (user) {
          removeDublicatedKeys(collectedData, {
            ...user,
            industry: (user.industry as Industry)._id,
            ...(user?.birthday && { birthday: new Date(user?.birthday) }),
          });

          await dispatch(updateProfile(collectedData));
          handleClose();
        }
      })();
    } else if (result === DialogResult.CANCEL) {
      handleClose();
    } else {
      handleClose();
    }
  };

  const handleContriesSelectionChange = (country: Country | undefined) => {
    if (country) {
      setSelectedCountry(country);
    }
  };

  const handleIndustrySelectionChange = (_: any, newVal?: Industry) => {
    if (newVal) {
      setSelectedIndustry(newVal);
    }
  };

  const handleGenderCheckedChanged = (val: string) => {
    setSelectedGender(val);
  };

  return (
    <ConfirmDialog
      title={
        <Typography sx={{ fontSize: "24px" }}>Edit my information</Typography>
      }
      open={open}
      actions={[
        {
          label: "Cancel",
          resultType: DialogResult.CANCEL,
          ownProps: {
            disabled: loading,
          },
        },
        {
          label: "Save",
          resultType: DialogResult.OK,
          ownProps: {
            variant: "contained",
            disabled: loading,
          },
        },
      ]}
      onConfirm={handleConfirm}
      bodyContent={
        <Box
          sx={{
            width: "500px",
            mt: 1,
            position: "relative",
          }}
          component="form"
        >
          {loading && <LoadingComponent />}
          <FormControl fullWidth sx={{ mb: 3 }}>
            <Typography sx={{ mb: 1 }}>Username</Typography>
            <TextField
              {...register("username", {
                required: "This field cannot be empty",
              })}
              defaultValue={user?.userName}
              variant="outlined"
            />
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <RadioButtonGroup
              formLabel="Genders"
              defaultValue={user?.gender || Gender.MALE}
              onCheckChange={handleGenderCheckedChanged}
              id="gender-select"
              name="gender-select"
              data={[
                {
                  label: "Male",
                  value: Gender.MALE,
                },
                {
                  label: "Female",
                  value: Gender.FEMALE,
                },
                {
                  label: "Non binary",
                  value: Gender.NON_BINARY,
                },
                {
                  label: "Genderqueer",
                  value: Gender.GENDERQUEER,
                },
                {
                  label: "Unknown",
                  value: Gender.UNKNOWN,
                },
              ]}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <Typography sx={{ mb: 1 }}>Country</Typography>
            <CountriesSelect
              defaultValue={
                user?.country
                  ? ({
                      name: user?.country?.countryName,
                      Iso2: user?.country?.countryCode,
                    } as Country)
                  : undefined
              }
              label=""
              onSelectionChange={handleContriesSelectionChange}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <Typography sx={{ mb: 1 }}>Industries</Typography>
            <IndustriesSelect
              sx={{ width: "100%" }}
              label=""
              onSelectionChange={handleIndustrySelectionChange}
              defaultValue={user?.industry as Industry}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <Typography sx={{ mb: 1 }}>Birthday</Typography>
            <DateOfBirthPicker
              control={control}
              defaultValue={user?.birthday}
              label=""
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!errors.userDob,
                  helperText: errors?.userDob?.message,
                },
              }}
            />
          </FormControl>
        </Box>
      }
    />
  );
};

export default UserInfoFormModal;
