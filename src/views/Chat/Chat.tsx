import { Box, Divider } from "@mui/material";
import React, { useEffect } from "react";
import LeftSideBar from "../../components/LeftSideBar";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

const Chat: React.FC = () => {
  const currentSideBarItem = useSelector(
    (state: RootState) => state.app.currentSidebarItem
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (currentSideBarItem) {
      navigate(currentSideBarItem.path, {
        ...currentSideBarItem.navigateOptions,
      });
    }
    // eslint-disable-next-line
  }, [currentSideBarItem]);

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        display: "flex",
      }}
    >
      <LeftSideBar />
      <Divider orientation="vertical" />
      <Outlet />
    </Box>
  );
};

export default Chat;
