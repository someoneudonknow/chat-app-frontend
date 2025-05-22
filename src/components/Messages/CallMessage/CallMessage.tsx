import React from "react";
import { CallMessagePropsType } from "../types";
import { Box, Card, CardContent, Chip, Typography, Stack } from "@mui/material";
import VideocamIcon from "@mui/icons-material/Videocam";
import CallIcon from "@mui/icons-material/Call";
import DescriptionIcon from "@mui/icons-material/Description";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PeopleIcon from "@mui/icons-material/People";

const formatDuration = (seconds: number): string => {
  if (!seconds) return "0:00";

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  }

  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const CallMessage: React.FC<CallMessagePropsType> = ({ callInfo, sx }) => {
  if (!callInfo) {
    return null;
  }

  const {
    callType,
    duration,
    callStartedAt,
    callEndedAt,
    isRecorded,
    summary,
    participants,
  } = callInfo;

  const startDate = new Date(callStartedAt);
  const formattedStartTime = startDate.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const formattedDate = startDate.toLocaleDateString();

  return (
    <Card sx={{ width: "100%", maxWidth: 350, ...sx }}>
      <CardContent>
        <Stack spacing={1}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {callType === "video" ? (
                <VideocamIcon color="primary" sx={{ mr: 1 }} />
              ) : (
                <CallIcon color="primary" sx={{ mr: 1 }} />
              )}
              <Typography variant="h6" component="div">
                {callType === "video" ? "Video Call" : "Audio Call"}
              </Typography>
            </Box>
            {isRecorded !== undefined && (
              <Chip
                size="small"
                label={isRecorded ? "Recorded" : "Not Recorded"}
                color={isRecorded ? "success" : "default"}
              />
            )}
          </Box>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <AccessTimeIcon
              fontSize="small"
              sx={{ mr: 1, color: "text.secondary" }}
            />
            <Typography variant="body2" color="text.secondary">
              Duration: {formatDuration(duration)}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <CalendarTodayIcon
              fontSize="small"
              sx={{ mr: 1, color: "text.secondary" }}
            />
            <Typography variant="body2" color="text.secondary">
              {formattedDate} at {formattedStartTime}
            </Typography>
          </Box>

          {participants && participants.length > 0 && (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <PeopleIcon
                fontSize="small"
                sx={{ mr: 1, color: "text.secondary" }}
              />
              <Typography variant="body2" color="text.secondary">
                {participants.length} participants
              </Typography>
            </Box>
          )}

          {summary && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                <DescriptionIcon
                  fontSize="small"
                  sx={{ mr: 0.5, verticalAlign: "middle" }}
                />
                Summary
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  backgroundColor: "background.paper",
                  p: 1,
                  borderRadius: 1,
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                {summary}
              </Typography>
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default CallMessage;
