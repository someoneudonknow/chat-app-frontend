import { Box, Divider } from "@mui/material";
import React, { useState } from "react";
import LeftSideBar from "../../components/LeftSideBar";
import { LeftSideBarItemName } from "../../constants/types";
import { Outlet, useNavigate } from "react-router-dom";

const lastSideBarClicked = "last-sidebar-item-name";
const activeTabKey = "active-tab";

const Chat: React.FC = () => {
  const [preferComponent, setPreferComponent] = useState<string>(
    window.sessionStorage.getItem(lastSideBarClicked) ||
      LeftSideBarItemName.ALL_CONSERVATIONS
  );
  const navigate = useNavigate();

  const onLeftMostSideBarItemClicked = (name: LeftSideBarItemName) => {
    setPreferComponent(name);

    window.sessionStorage.setItem(lastSideBarClicked, name);

    switch (name) {
      case LeftSideBarItemName.ALL_CONSERVATIONS:
        navigate("/user/chat/all-conservations");
        break;
      case LeftSideBarItemName.EVERYONE:
        navigate("/user/chat/everyone");
        break;
      case LeftSideBarItemName.MY_CONTACTS:
        navigate({
          pathname: "/user/chat/my-contacts",
          search: `?q=${sessionStorage.getItem(activeTabKey) || "all"}`,
        });
        break;
      default:
        return;
    }
  };

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        display: "flex",
      }}
    >
      <LeftSideBar
        defaultItem={preferComponent}
        onSideBarItemClicked={onLeftMostSideBarItemClicked}
      />
      <Divider orientation="vertical" />
      <Outlet />
    </Box>
  );
};

export default Chat;
