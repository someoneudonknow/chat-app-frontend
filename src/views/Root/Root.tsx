import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { AppDispatch, RootState } from "../../store";
import { toast } from "react-toastify";
import { reset } from "../../store/toast";
import { UserProfileFormModal } from "../../components/UserProfileFormModal";

const Root: React.FC = () => {
  const toastState = useSelector((state: RootState) => state.toast);
  const dispatch = useDispatch<AppDispatch>();
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const [open, setModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (currentUser && currentUser.lastCompletedUserProfileStep < 3) {
      setModalOpen(true);
    } else {
      setModalOpen(false);
    }
  }, [currentUser, currentUser?.lastCompletedUserProfileStep]);

  useEffect(() => {
    console.log("call-api");
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
