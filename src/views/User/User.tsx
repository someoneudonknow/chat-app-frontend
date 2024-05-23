import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { AppDispatch, RootState } from "../../store";
import {
  getPendingContactRequest,
  getSentContactRequest,
} from "../../store/contactRequest";

const User: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user.currentUser);

  useEffect(() => {
    if (user) {
      dispatch(getSentContactRequest());
      dispatch(getPendingContactRequest());
    }
  }, [dispatch, user]);

  return (
    <>
      <Outlet />
    </>
  );
};

export default User;
