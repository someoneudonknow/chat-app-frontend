import { Box, Button, ButtonGroup, Paper } from "@mui/material";
import React from "react";
import { useSearchParams } from "react-router-dom";
import PendingContactsList from "./PendingContactsList";
import SentContactsList from "./SentContactsList";
import { UserContact } from "../../components/UserContact";

const MyContacts: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const handlePendingContactsClick = () => {
    setSearchParams({ q: "pending" });
    sessionStorage.setItem("active-tab", "pending");
  };

  const handleSentContactsClick = () => {
    setSearchParams({ q: "sent" });
    sessionStorage.setItem("active-tab", "sent");
  };

  const handleAllContactsClick = () => {
    setSearchParams({ q: "all" });
    sessionStorage.setItem("active-tab", "all");
  };
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        position: "relative",
        px: {
          xs: 0,
          md: 5,
        },
        py: {
          xs: 0,
          md: 3,
        },
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      <Paper
        sx={{
          p: 2,
          borderRadius: 3,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <ButtonGroup
          fullWidth
          sx={{
            "& > button:first-of-type": {
              borderTopLeftRadius: 3,
              borderBottomLeftRadius: 3,
            },
            "& > button:last-child": {
              borderTopRightRadius: 3,
              borderBottomRightRadius: 3,
            },
          }}
        >
          <Button
            variant={searchParams.get("q") === "all" ? "contained" : "outlined"}
            onClick={handleAllContactsClick}
          >
            My contacts
          </Button>
          <Button
            variant={
              searchParams.get("q") === "pending" ? "contained" : "outlined"
            }
            onClick={handlePendingContactsClick}
          >
            Pendding contact requests
          </Button>

          <Button
            variant={
              searchParams.get("q") === "sent" ? "contained" : "outlined"
            }
            onClick={handleSentContactsClick}
          >
            Sent contact requests
          </Button>
        </ButtonGroup>
      </Paper>
      {searchParams.get("q") === "all" && <UserContact />}
      {searchParams.get("q") === "pending" && <PendingContactsList />}
      {searchParams.get("q") === "sent" && <SentContactsList />}
    </Box>
  );
};

export default MyContacts;
