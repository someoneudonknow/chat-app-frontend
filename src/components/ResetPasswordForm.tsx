import { Box, Button, Link, TextField, Typography } from "@mui/material";
import React from "react";
import { FieldValues, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import PasswordTextField from "./UIs/PasswordTextField";
import LoadingButton from "./UIs/LoadingButton";

type ReactResetPasswordFormPropsType = {
  onSubmit: (data: FieldValues) => void;
  loading?: boolean;
};

const ResetPasswordForm: React.FC<ReactResetPasswordFormPropsType> = ({
  onSubmit,
  loading,
}) => {
  const {
    handleSubmit,
    watch,
    formState: { errors },
    register,
  } = useForm();
  const password = watch("password");
  const navigate = useNavigate();

  const handleBackToLogin = () => {
    navigate("/auth/login");
  };
  return (
    <Box
      sx={{
        p: 2,
        width: "30rem",
        borderRadius: "5px",
        bgcolor: (theme) => theme.palette.containerPrimary?.main,
      }}
    >
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <Typography variant="h4" mb={2}>
          Choose a new password
        </Typography>
        <PasswordTextField
          fullWidth
          {...register("password", {
            required: "Please enter your new password",
            maxLength: {
              value: 20,
              message: "Password must be lower than 20 characters",
            },
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
          label="Password"
          error={!!errors.password}
          helperText={errors.password?.message as string}
        />
        <PasswordTextField
          sx={{ mt: 2 }}
          fullWidth
          {...register("passwordConfirm", {
            required: "Please enter your password confirmation",
            validate: {
              validator: (value) =>
                value === password || "Password confirm do not match",
            },
          })}
          label="Password Confirm"
          error={!!errors.passwordConfirm}
          helperText={errors.passwordConfirm?.message as string}
        />
        <LoadingButton
          loading={loading || false}
          sx={{
            mt: 3,
            bgcolor: (theme) => theme.palette.containerPrimary?.contrastText,
            "&:hover": {
              color: (theme) => theme.palette.containerSecondary?.contrastText,
            },
          }}
          fullWidth
          variant="contained"
          type="submit"
        >
          Submit
        </LoadingButton>
      </Box>
      <Typography mt={3} variant="body2">
        <Link
          sx={{
            cursor: "pointer",
            color: (theme) => theme.palette.containerPrimary?.contrastText,
          }}
          onClick={handleBackToLogin}
        >
          Back to login
        </Link>
      </Typography>
    </Box>
  );
};

export default ResetPasswordForm;
