import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../../store";
import { toast } from "react-toastify";
import { reset } from "../../store/toast";
import { UserProfileFormModal } from "../../components/UserProfileFormModal";
import Cookies from "js-cookie";
import { ACCESS_TOKEN, CLIENT_ID, REFRESH_TOKEN } from "../../constants";
import { getProfile, refreshToken } from "../../store/user";

const Root: React.FC = () => {
  const toastState = useSelector((state: RootState) => state.toast);
  const dispatch = useDispatch<AppDispatch>();
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const navigate = useNavigate();
  const [open, setModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (currentUser && currentUser.lastCompletedUserProfileStep < 3) {
      setModalOpen(true);
    } else {
      setModalOpen(false);
    }
  }, [currentUser, currentUser?.lastCompletedUserProfileStep]);

  useEffect(() => {
    const fetchUserData = async () => {
      const _userId = Cookies.get(CLIENT_ID);
      const _accessToken = Cookies.get(ACCESS_TOKEN);
      const _refreshToken = Cookies.get(REFRESH_TOKEN);

      if (_userId && _accessToken && _refreshToken) {
        try {
          await dispatch(refreshToken());
          await dispatch(getProfile());
          navigate("/user");
        } catch (error: any) {
          toast.error(error.message);
        }
      }
    };

    fetchUserData();

    return () => {
      console.log("unmounted");
    };
  }, []);

  useEffect(() => {
    switch (toastState.type) {
      case "success":
        toast.success(toastState.message);
        break;
      case "error":
        toast.error(toastState.message);
        break;
      case "warning":
        toast.warning(toastState.message);
        break;
      default:
        break;
    }
    dispatch(reset());
  }, [toastState, dispatch]);

  return (
    <>
      <UserProfileFormModal onClose={() => setModalOpen(false)} open={open} />
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default Root;
