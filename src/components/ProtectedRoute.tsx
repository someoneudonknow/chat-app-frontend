import { ReactNode } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState } from "../store";

type PropsType = {
  children: ReactNode;
};

const ProtectedRoute: React.FC<PropsType> = ({ children }) => {
  const user = useSelector((state: RootState) => state.user.currentUser);

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
