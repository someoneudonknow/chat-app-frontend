import { Avatar, Box, Button, Paper, Stack, Typography } from "@mui/material";
import React from "react";
import BackgroundWrapper from "../UIs/BackgroundWrapper";
import { Theme } from "react-toastify";
import { TextOverflowEllipsis } from "../Person/PersonItem";
import defaultFlag from "../../assets/images/icon/flag_icon.png";
import { calculateAge, getGender } from "../../utils";
import { Gender } from "../../constants/types";
import {
  Call,
  Chat,
  Delete,
  History,
  VideoCall,
  Visibility,
} from "@mui/icons-material";
import User from "../../models/user.model";
import Industry from "../../models/industry.model";
import SquareTooltipIconButton from "../UIs/SquareTootltipIconButton";
import { useNavigate } from "react-router-dom";

// name, country, gender, industry, same interests, same groups, messages count,
// time add contact, been together for
// avatar, bg, social ( improve )

const AVT_SIZE = 110;

type ContactStatsPropsType = {
  data: User;
};

const ContactStats: React.FC<ContactStatsPropsType> = ({ data }) => {
  const navigate = useNavigate();

  const gradient: { [k: string]: string } = {
    dark: "linear-gradient(45deg, hsl(240deg 100% 20%) 0%, hsl(289deg 100% 21%) 11%, hsl(315deg 100% 27%) 22%, hsl(329deg 100% 36%) 33%, hsl(337deg 100% 43%) 44%, hsl(357deg 91% 59%) 56%, hsl(17deg 100% 59%) 67%,hsl(34deg 100% 53%) 78%,hsl(45deg 100% 50%) 89%, hsl(55deg 100% 50%) 100%)",
    light:
      "linear-gradient(40deg,hsl(240deg 47% 68%) 0%,hsl(294deg 37% 64%) 20%,hsl(334deg 65% 69%) 29%,hsl(357deg 83% 74%) 36%,hsl(18deg 83% 70%) 43%,hsl(36deg 67% 63%) 50%,hsl(30deg 70% 62%) 57%,hsl(24deg 72% 62%) 64%,hsl(17deg 72% 62%) 71%,hsl(9deg 70% 62%) 80%,hsl(0deg 66% 62%) 100%);",
  };

  const handleViewProfileClick = () => {
    navigate(`/user/discover/${data._id}`);
  };

  return (
    <Paper
      sx={{
        height: "100%",
        borderRadius: 3,
        p: 2,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <BackgroundWrapper
        sx={{
          backgroundImage: (theme) =>
            `url(${data.background}), ${gradient[theme.palette.mode]}`,
          mb: `calc(62px * ${AVT_SIZE} / 100)`,
        }}
      >
        <Avatar
          src={data.photo}
          sx={{
            width: `${AVT_SIZE}px`,
            height: `${AVT_SIZE}px`,
            zIndex: 1001,
            position: "absolute",
            bottom: "0",
            left: "16px",
            transform: "translateY(50%)",
          }}
        />
        <Button
          onClick={handleViewProfileClick}
          sx={{
            borderRadius: 1,
            position: "absolute",
            top: "calc(100% + 10px)",
            right: 0,
            fontSize: "10px",
            letterSpacing: "1px",
          }}
          startIcon={<Visibility />}
          component="span"
          variant="contained"
        >
          View profile
        </Button>
      </BackgroundWrapper>
      <Stack direction="row" sx={{ alignItems: "center" }} spacing={1}>
        <TextOverflowEllipsis sx={{ maxWidth: "100%" }} variant="h5">
          {data?.userName || data.email}
        </TextOverflowEllipsis>
        {data?.gender && (
          <Typography sx={{ whiteSpace: "nowrap" }}>
            {" "}
            ( {data?.gender ? getGender(data?.gender as Gender) : ""} )
          </Typography>
        )}
        <img
          style={{ marginLeft: "10px" }}
          loading="lazy"
          width="26"
          srcSet={
            data?.country?.countryCode
              ? `https://flagcdn.com/w40/${data.country?.countryCode.toLowerCase()}.png 2x`
              : defaultFlag
          }
          src={
            data?.country?.countryCode
              ? `https://flagcdn.com/w20/${data.country?.countryCode.toLowerCase()}.png`
              : defaultFlag
          }
          alt="user-country"
        />
      </Stack>

      <Typography
        sx={{ letterSpacing: 1, mt: 0.5, fontSize: "13px" }}
        variant="body2"
      >
        {data?.birthday && calculateAge(data.birthday)}
        {(data.industry as Industry)?.name &&
          " | " + (data.industry as Industry)?.name}
      </Typography>

      <Stack
        direction="row"
        sx={{ mt: 2, justifyContent: "space-around", px: 5 }}
      >
        <SquareTooltipIconButton
          sx={{
            width: "60px",
            aspectRatio: "1/1",
            bgcolor: (theme) => theme.palette.containerPrimary?.main,
            borderRadius: "50%",
          }}
          placement="bottom"
          title="Audio call"
        >
          <Call />
        </SquareTooltipIconButton>
        <SquareTooltipIconButton
          sx={{
            width: "60px",
            borderRadius: "50%",
            aspectRatio: "1/1",
            bgcolor: (theme) => theme.palette.containerPrimary?.main,
          }}
          placement="bottom"
          title="Chat"
        >
          <Chat />
        </SquareTooltipIconButton>
        <SquareTooltipIconButton
          sx={{
            width: "60px",
            borderRadius: "50%",
            aspectRatio: "1/1",
            bgcolor: (theme) => theme.palette.containerPrimary?.main,
          }}
          placement="bottom"
          title="Video call"
        >
          <VideoCall />
        </SquareTooltipIconButton>
      </Stack>
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "flex-end",
          py: 1,
          justifyContent: "center",
        }}
      >
        <Button
          startIcon={<Delete />}
          variant="contained"
          color="error"
          sx={{
            width: "80%",
          }}
        >
          Remove contact
        </Button>
      </Box>
    </Paper>
  );
};

export default ContactStats;
