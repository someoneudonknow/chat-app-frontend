import React from "react";
import { Outlet } from "react-router-dom";
import { AppEventProvider } from "../../contexts";

const User: React.FC = () => {
  return (
    <AppEventProvider>
      <Outlet />
    </AppEventProvider>
  );
};

export default User;
