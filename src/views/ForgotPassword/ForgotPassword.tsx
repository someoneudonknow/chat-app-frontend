import {
  Box,
  CircularProgress,
  Container,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import VerifyEmailForm from "../../components/VerifyEmailForm";
import { FieldValues } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import UserService from "../../services/UserService";
import { BASE_URL } from "../../constants/api-endpoints";
import { toast } from "react-toastify";

const ForgotPassword: React.FC = () => {
  const [currentEmail, setCurrentEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleEmailFormSubmit = async (data: FieldValues) => {
    const { email } = data;

    try {
      setIsLoading(true);
      const userService = new UserService(BASE_URL);
      await userService.forgotPassword({ email });

      setCurrentEmail(email);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const navigate = useNavigate();

  const handleBackToLogin = () => {
    navigate("/auth/login");
  };
  return (
    <Container sx={{ display: "grid", placeItems: "center", height: "100vh" }}>
      {!isLoading && !currentEmail && (
        <VerifyEmailForm onSubmit={handleEmailFormSubmit} />
      )}
      {!isLoading && currentEmail && (
        <Stack sx={{ width: "30rem" }} spacing={5}>
          <Typography variant="h6">
            {`If an account exists for ${currentEmail}, you will get an
            email with instructions on resetting your password. If it doesn't
            arrive, be sure to check your spam folder.`}
          </Typography>
          <Typography sx={{ textAlign: "center" }} variant="body1">
            <Link sx={{ cursor: "pointer" }} onClick={handleBackToLogin}>
              Back to login
            </Link>
          </Typography>
        </Stack>
      )}
      {isLoading && <CircularProgress />}
    </Container>
  );
};

export default ForgotPassword;
