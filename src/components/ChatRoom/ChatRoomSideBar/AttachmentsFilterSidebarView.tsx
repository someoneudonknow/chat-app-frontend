import { ArrowBack } from "@mui/icons-material";
import { IconButton, Paper, Button, ButtonGroup, Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useChatRoom } from "../context/ChatRoomContextProvider";
import {
  AttachmentsSidebarTabNames,
  AttachmentsSidebarTabNamesValues,
} from "../types";
import {
  FileAttachmentList,
  ImageAttachmentList,
  VideoAttachmentList,
} from "./AttachmentList";

type AttachmentsFilterSidebarViewPropsType = {
  show: boolean;
};

const AttachmentsFilterSidebarView: React.FC<
  AttachmentsFilterSidebarViewPropsType
> = ({ show }) => {
  const { setSidebarView, sidebarView } = useChatRoom();
  const [currentTab, setCurrentTab] =
    useState<AttachmentsSidebarTabNamesValues>(
      AttachmentsSidebarTabNames.IMAGES
    );

  useEffect(() => {
    if (sidebarView.viewName === "attachments" && sidebarView.data?.tab) {
      setCurrentTab(sidebarView.data.tab);
    }
  }, [sidebarView]);

  const handleTabClicked = (tab: AttachmentsSidebarTabNamesValues) => {
    setCurrentTab(tab);
  };

  return (
    <Paper
      component="div"
      sx={{
        display: show ? "flex" : "none",
        position: "relative",
        width: "100%",
        height: "100%",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Box sx={{ p: 1, textAlign: "left", width: "100%" }}>
        <IconButton onClick={() => setSidebarView({ viewName: "primary" })}>
          <ArrowBack />
        </IconButton>
      </Box>
      <ButtonGroup sx={{ mb: 1.5 }}>
        {Object.values(AttachmentsSidebarTabNames).map((tabName) => (
          <Button
            key={tabName}
            variant={currentTab === tabName ? "contained" : "outlined"}
            onClick={() => handleTabClicked(tabName)}
          >
            {tabName}
          </Button>
        ))}
      </ButtonGroup>
      {currentTab === AttachmentsSidebarTabNames.IMAGES && (
        <ImageAttachmentList />
      )}
      {currentTab === AttachmentsSidebarTabNames.FILES && (
        <FileAttachmentList />
      )}
      {currentTab === AttachmentsSidebarTabNames.VIDEOS && (
        <VideoAttachmentList />
      )}
    </Paper>
  );
};

export default AttachmentsFilterSidebarView;
