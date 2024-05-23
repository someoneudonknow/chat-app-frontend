import {
  Link,
  List,
  ListItem,
  ListItemText,
  SxProps,
  Typography,
  useTheme,
} from "@mui/material";
import React from "react";
import ConservationItem from "./ConservationItem";
import { ConservationItemType } from "../../constants/types";

type ConservationSuggestionsPropsType = {
  loading: boolean;
  sx?: SxProps;
  onSuggestionItemClick?: (id: string) => void;
  data: ConservationItemType[];
};

const ConservationSuggestions: React.FC<ConservationSuggestionsPropsType> = ({
  loading,
  sx,
  data,
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
          <ConservationItem
            key={d._id}
            conservationId={d._id}
            conservationType={d.type}
            avatar={d?.cover}
            lastMessage={d?.lastMessage}
            name={d.name}
            onClick={onSuggestionItemClick}
          />
        ))}
      <Typography
        variant="body2"
        sx={{ mt: 1, textAlign: "center", cursor: "pointer" }}
      >
        <Link sx={{ color: "#c3c3c3c3" }}>Show more</Link>
      </Typography>
    </List>
  );
};

export default ConservationSuggestions;
