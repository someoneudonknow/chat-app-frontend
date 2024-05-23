import React from "react";
import LoadingButton from "./UIs/LoadingButton";
import { FacebookOutlined, Google } from "@mui/icons-material";
import { SubmitHandler, useForm } from "react-hook-form";
import { LoginFormValues } from "./LoginForm";
import { useNavigate } from "react-router-dom";
import { Box, Divider, Grid, TextField, Typography, Link } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { signup } from "../store/user/asyncThunks";
import { SignInType } from "../constants/types";
import { AppDispatch, RootState } from "../store";
import PasswordTextField from "./UIs/PasswordTextField";

type RegisterFormValues = {
  email: string;
  password: string;
  passwordConfirm: string;
};

const RegisterForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>();
  const isLoading = useSelector((state: RootState) => state.user.isLoading);
  const navigate = useNavigate();
  const password = watch("password");
  const dispatch = useDispatch<AppDispatch>();

  const onFormSubmit: SubmitHandler<LoginFormValues> = async (data) => {
    const submitData: SignInType = {
      email: data.email,
      password: data.password,
    };

    await dispatch(signup(submitData));

    navigate("/user/chat", { replace: true });
  };

  const handleRegisterWithGoogle = async () => {};

  const handleLoginRegisterFacebook = async () => {};

  const handleRegisterLinkClicked = (): void => {
    navigate("/auth/login");
  };

  return (
    <Box
      sx={{ width: "450px" }}
      onSubmit={handleSubmit(onFormSubmit)}
      component="form"
    >
      <Typography
        sx={{
          textAlign: "center",
          fontWeight: "bold",
        }}
        variant="h4"
        mb={4}
      >
        Register
      </Typography>
      <Grid spacing={2} container>
        <Grid item xs={12}>
          <TextField
            label="Email"
            fullWidth
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                message: "Email is invalid",
              },
            })}
            error={!!errors.email}
            helperText={errors?.email?.message}
          />
        </Grid>
        <Grid item xs={12}>
          <PasswordTextField
            label="Password"
            fullWidth
            {...register("password", {
              required: "Password is required",
              maxLength: {
                value: 20,
                message: "Password must be lower than 20 characters",
              },
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            error={!!errors.password}
            helperText={errors?.password?.message}
          />
        </Grid>
        <Grid item xs={12}>
          <PasswordTextField
            label="Password Confirm"
            fullWidth
            {...register("passwordConfirm", {
              required: "Password is required",
              maxLength: {
                value: 20,
                message: "Password must be lower than 20 characters",
              },
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
              validate: {
                validator: (value) =>
                  value === password || "Password confirm do not match",
              },
            })}
            error={!!errors.passwordConfirm}
            helperText={errors?.passwordConfirm?.message}
          />
        </Grid>
        <Grid item mt={3} xs={12}>
          <LoadingButton
            sx={{ height: "40px", fontWeight: "bold" }}
            variant="contained"
            fullWidth
            type="submit"
            loading={isLoading}
          >
            Register
          </LoadingButton>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body2">
            Already have an account?{" "}
            <Link
              onClick={handleRegisterLinkClicked}
              sx={{ cursor: "pointer" }}
            >
              {" "}
              Login
            </Link>
          </Typography>
        </Grid>
        <Grid mt={2} item xs={12}>
          <Divider>
            <strong>Register</strong> with others
          </Divider>
        </Grid>
        <Grid item xs={12}>
          <LoadingButton
            startIcon={<Google />}
            sx={{ height: "40px", fontWeight: "bold" }}
            variant="contained"
            fullWidth
            onClick={handleRegisterWithGoogle}
            type="button"
            loading={isLoading}
          >
            Register with google
          </LoadingButton>
        </Grid>
        <Grid item xs={12}>
          <LoadingButton
            startIcon={<FacebookOutlined />}
            sx={{ height: "40px", fontWeight: "bold" }}
            variant="contained"
            fullWidth
            onClick={handleLoginRegisterFacebook}
            type="button"
            loading={isLoading}
          >
            Register with Facebook
          </LoadingButton>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RegisterForm;
