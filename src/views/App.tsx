import { Suspense } from "react";
import PageLoader from "../components/PageLoader";
import { Navigate, Route, Routes } from "react-router-dom";
import { Error } from "./Error";
import { lazy } from "react";
import ProtectedRoute from "../components/ProtectedRoute";
import { Auth } from "./Auth";
import { ToastContainer } from "react-toastify";
import { useTheme } from "@mui/material";
import { Bounce } from "react-toastify";
import User from "./User/User";
import { initStateWithPrevTab } from "redux-state-sync";
import store from "../store";

const LoginView = lazy(() =>
  import("../components/LoginForm").then((module) => ({
    default: module.default,
  }))
);
const RegisterView = lazy(() =>
  import("../components/RegisterForm").then((module) => ({
    default: module.default,
  }))
);
const ChatView = lazy(() =>
  import("./Chat").then((module) => ({ default: module.Chat }))
);
const RootView = lazy(() =>
  import("./Root").then((module) => ({ default: module.RootView }))
);
const ErrorView = lazy(() =>
  import("./Error").then((module) => ({ default: module.Error }))
);
const ForgotPasswordView = lazy(() =>
  import("./ForgotPassword").then((module) => ({
    default: module.ForgotPassword,
  }))
);
const ResetPasswordView = lazy(() =>
  import("./ResetPassword").then((module) => ({
    default: module.ResetPassword,
  }))
);
const ProfileView = lazy(() =>
  import("./Profile").then((module) => ({
    default: module.Profile,
  }))
);
const PersonDiscoverView = lazy(() =>
  import("./PersonDiscover").then((module) => ({
    default: module.PersonDiscover,
  }))
);
const AllConservations = lazy(() =>
  import("./AllConservations").then((module) => ({
    default: module.AllConservations,
  }))
);
const Everyone = lazy(() =>
  import("./Everyone").then((module) => ({
    default: module.Everyone,
  }))
);
const MyContacts = lazy(() =>
  import("./MyContacts").then((module) => ({
    default: module.MyContacts,
  }))
);
const ConservationView = lazy(() =>
  import("./Conservation").then((module) => ({
    default: module.ConservationView,
  }))
);
const CallView = lazy(() =>
  import("./Call").then((module) => ({
    default: module.Call,
  }))
);

function App() {
  const theme = useTheme();
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        draggable
        transition={Bounce}
        theme={`${theme.palette.mode}`}
      />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route errorElement={<Error />} path="/" element={<RootView />}>
            <Route index element={<Navigate to="user" />} />
            <Route path="auth" element={<Auth />}>
              <Route index element={<Navigate to="login" />} />
              <Route path="login" element={<LoginView />} />
              <Route path="register" element={<RegisterView />} />
            </Route>
            <Route
              path="auth/forgot-password"
              element={<ForgotPasswordView />}
            />
            <Route path="resetPassword" element={<ResetPasswordView />} />

            <Route path="user" element={<User />}>
              <Route index element={<Navigate to="chat" />} />
              <Route
                path="call"
                element={
                  <ProtectedRoute>
                    <CallView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="profile"
                element={
                  <ProtectedRoute>
                    <ProfileView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="discover/:userId"
                element={
                  <ProtectedRoute>
                    <PersonDiscoverView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="chat"
                element={
                  <ProtectedRoute>
                    <ChatView />
                  </ProtectedRoute>
                }
              >
                <Route path="all-conservations" element={<AllConservations />}>
                  <Route
                    path=":conservationId"
                    element={<ConservationView />}
                  />
                </Route>
                <Route path="everyone" element={<Everyone />} />
                <Route path="my-contacts" element={<MyContacts />} />
              </Route>
            </Route>
            <Route path="*" element={<ErrorView />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
