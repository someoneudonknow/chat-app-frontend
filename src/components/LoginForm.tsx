import {
  Box,
  Checkbox,
  Divider,
  FormControlLabel,
  FormGroup,
  Grid,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import React, { ChangeEvent, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import LoadingButton from "./UIs/LoadingButton";
import { FacebookOutlined, Google } from "@mui/icons-material";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { loginWithEmailPassword } from "../store/user/asyncThunks";
import PasswordTextField from "./UIs/PasswordTextField";

export type LoginFormValues = {
  email: string;
  password: string;
};

const LoginForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>();
  const [isRememberMe, setIsRememberMe] = useState<boolean>(false);
  const navigate: NavigateFunction = useNavigate();
  const isLoading: boolean = useSelector(
    (state: RootState) => state.user.isLoading
  );
  const dispatch = useDispatch<AppDispatch>();

  const onFormSubmit: SubmitHandler<LoginFormValues> = async ({
    email,
    password,
  }) => {
    await dispatch(
      loginWithEmailPassword({ email, password, remember: isRememberMe })
    );
    navigate("/user/chat", { replace: true });
  };

  const handleLoginWithGoogle = async () => {};

  const handleLoginWithFacebook = async () => {};

  const handleRegisterLinkClicked = (): void => {
    navigate("/auth/register");
  };

  const handleRememberMeCheckChanged = (e: ChangeEvent<HTMLInputElement>) => {
    setIsRememberMe(e.target.checked);
  };

  const handleForgotPassword = () => {
    navigate("/auth/forgot-password");
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
        Login
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
          <FormGroup>
            <FormControlLabel
              label="Remember me?"
              control={
                <Checkbox
                  checked={isRememberMe}
                  onChange={handleRememberMeCheckChanged}
                  color="primary"
                />
              }
            />
          </FormGroup>
        </Grid>
        <Grid item mt={3} xs={12}>
          <LoadingButton
            sx={{ height: "40px", fontWeight: "bold" }}
            variant="contained"
            fullWidth
            type="submit"
            loading={isLoading}
          >
            Login
          </LoadingButton>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body2">
            Don't have an account?{" "}
            <Link
              onClick={handleRegisterLinkClicked}
              sx={{ cursor: "pointer" }}
            >
              {" "}
              Register
            </Link>
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography
            variant="body2"
            sx={{ cursor: "pointer", textAlign: "right" }}
          >
            <Link onClick={handleForgotPassword}>Forgot password?</Link>
          </Typography>
        </Grid>
        <Grid mt={2} item xs={12}>
          <Divider>
            <strong>Login</strong> with others
          </Divider>
        </Grid>
        <Grid item xs={12}>
          <LoadingButton
            startIcon={<Google />}
            sx={{ height: "40px", fontWeight: "bold" }}
            variant="contained"
            fullWidth
            onClick={handleLoginWithGoogle}
            type="button"
            loading={isLoading}
          >
            Login with Google
          </LoadingButton>
        </Grid>
        <Grid item xs={12}>
          <LoadingButton
            startIcon={<FacebookOutlined />}
            sx={{ height: "40px", fontWeight: "bold" }}
            variant="contained"
            fullWidth
            onClick={handleLoginWithFacebook}
            type="button"
            loading={isLoading}
          >
            Login with Facebook
          </LoadingButton>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LoginForm;
