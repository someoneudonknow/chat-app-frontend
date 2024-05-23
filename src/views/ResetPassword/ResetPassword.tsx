import { Container } from "@mui/material";
import React, { useEffect, useState } from "react";
import ResetPasswordForm from "../../components/ResetPasswordForm";
import { FieldValues } from "react-hook-form";
import { toast } from "react-toastify";
import UserService from "../../services/UserService";
import { BASE_URL } from "../../constants/api-endpoints";
import { useLocation, useNavigate } from "react-router-dom";

const ResetPassword: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { search } = useLocation();
  const navigate = useNavigate();

  const handleResetPassword = async (data: FieldValues) => {
    const { password } = data;

    try {
      setLoading(true);
      const userService = new UserService(BASE_URL);
      const query = new URLSearchParams(search);

      await userService.resetPassword({
        otpToken: query.get("otp") || "",
        uid: query.get("id") || "",
        newPassword: password,
      });

      toast.success("Your password has been reset");
      navigate("/auth/login");
    } catch (err: any) {
      if (typeof err === "string") {
        toast.error(err);
      } else {
        toast.error(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container sx={{ display: "grid", placeItems: "center", height: "100vh" }}>
      <ResetPasswordForm loading={loading} onSubmit={handleResetPassword} />
    </Container>
  );
};

export default ResetPassword;
