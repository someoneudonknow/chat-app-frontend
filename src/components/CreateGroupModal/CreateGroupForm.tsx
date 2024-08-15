import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import ContactSelection from "../ContactSelection";
import { Group } from "@mui/icons-material";
import { UserContact } from "../../models/user.model";
import RadioButtonGroup from "../UIs/RadioButtonGroup";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

type CreateGroupFormPropsType = UseFormReturn;

const CreateGroupForm: React.FC<CreateGroupFormPropsType> = ({
  register,
  formState: { errors },
  setValue,
  setError,
  clearErrors,
}) => {
  const currentUserName = useSelector(
    (state: RootState) =>
      state.user.currentUser?.userName || state.user.currentUser?.email
  );

  const handleMembersSelectionChange = (selectedMems: UserContact[]) => {
    setValue("members", selectedMems);

    if (selectedMems.length < 3) {
      return setError("members", {
        message: "Please select at least 3 members",
      });
    } else if (selectedMems.length > 100) {
      return setError("members", {
        message: "Members amount must be lower than 100",
      });
    } else {
      clearErrors("members");
    }
  };

  const handleGroupAccessibilityChanged = (value: string) => {
    setValue("groupAccessibility", value);
  };

  return (
    <Box component="form" sx={{ width: { md: 400 } }}>
      <Stack spacing={3}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            justifyContent: "center",
          }}
        >
          <Group />
          <Typography variant="h5">Create group</Typography>
        </Box>
        <TextField
          fullWidth
          label="Group's name *"
          defaultValue={`${currentUserName}'s Group`}
          {...register("groupNameInput", {
            required: "Please enter a group's name",
          })}
          error={!!errors?.groupNameInput}
          helperText={errors?.groupNameInput?.message as string}
        />
        <ContactSelection
          helperText={errors?.members?.message as string}
          error={!!errors?.members}
          onSelectionChange={handleMembersSelectionChange}
        />
        <RadioButtonGroup
          id="groupAccessibility"
          name="groupAccessibility"
          formLabel="Group accessibility"
          data={[
            { label: "publish", value: "PUBLISH" },
            { label: "private", value: "PRIVATE" },
          ]}
          onCheckChange={handleGroupAccessibilityChanged}
          defaultValue="PUBLISH"
        />
        <TextField
          multiline
          minRows={3}
          label="Group's descriptions"
          placeholder="Write a short description..."
          {...register("groupDescriptions")}
        />
      </Stack>
    </Box>
  );
};

export default CreateGroupForm;
