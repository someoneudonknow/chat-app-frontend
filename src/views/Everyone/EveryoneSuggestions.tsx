import { AccountCircle } from "@mui/icons-material";
import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  SxProps,
  useTheme,
} from "@mui/material";
import React from "react";

export type EveryoneSuggestionsItem = {
  name?: string;
  email: string;
  photo?: string;
  id: string;
};

type EveryoneSuggestionsPropsType = {
  loading?: boolean;
  data: EveryoneSuggestionsItem[];
  sx?: SxProps;
  onSuggestionItemClick?: (id: string) => void;
};

const EveryoneSuggestions: React.FC<EveryoneSuggestionsPropsType> = ({
  loading,
  data,
  sx,
  onSuggestionItemClick,
}) => {
  const theme = useTheme();
  const isLightMode = theme.palette.mode === "light";

  return (
    <List
      sx={{
        zIndex: (theme) => theme.zIndex.drawer,
        bgcolor: (theme) => theme.palette.background.paper,
        ...(isLightMode && { boxShadow: 3 }),
        borderRadius: 1,
        ...sx,
      }}
    >
      {loading && (
        <ListItem>
          <ListItemText>Loading...</ListItemText>
        </ListItem>
      )}
      {!loading && data?.length <= 0 && <ListItem>No data result</ListItem>}
      {!loading &&
        data?.length > 0 &&
        data.map((d) => (
          <ListItemButton
            key={d.id}
            onClick={() => onSuggestionItemClick && onSuggestionItemClick(d.id)}
          >
            <ListItemAvatar>
              <Avatar src={d.photo}>
                <AccountCircle />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={d.name ? d.name : d.email}
              secondary={d.name ? d.email : ""}
            />
          </ListItemButton>
        ))}
    </List>
  );
};

export default EveryoneSuggestions;
