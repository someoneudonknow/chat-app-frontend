import React from "react";
import ReactDOM from "react-dom/client";
import App from "./views/App.tsx";
import "react-toastify/dist/ReactToastify.css";
import "react-image-crop/dist/ReactCrop.css";
import { ThemeContext } from "./contexts";
import "./style/global.css";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/index.ts";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import SocketProvider from "./contexts/SocketContext.tsx";
import CallProvider from "./contexts/CallContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  <Provider store={store}>
    <Router>
      <SocketProvider>
        <CallProvider>
          <ThemeContext>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <App />
            </LocalizationProvider>
          </ThemeContext>
        </CallProvider>
      </SocketProvider>
    </Router>
  </Provider>
  // </React.StrictMode>
);
