import {
  Box,
  Button,
  Container,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { FieldValues, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

type VerifyEmailFormPropsType = {
  onSubmit: (data: FieldValues) => void;
};

const VerifyEmailForm: React.FC<VerifyEmailFormPropsType> = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
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
        <TextField
          {...register("email", {
            required: "Please enter your email address",
            pattern: {
              value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
              message: "Email is invalid",
            },
          })}
          label="Enter your email"
          error={!!errors.email}
          helperText={errors?.email?.message as string}
          fullWidth
        />
        <Button
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
        </Button>
      </Box>
      <Typography
        variant="body2"
        sx={{
          cursor: "pointer",
          mt: 2,
        }}
      >
        <Link
          sx={{
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

export default VerifyEmailForm;
