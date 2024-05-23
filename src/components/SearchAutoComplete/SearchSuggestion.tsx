import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  SxProps,
  useTheme,
} from "@mui/material";
import React, { ReactNode } from "react";
import { motion } from "framer-motion";
import {
  CONSERVATION_ITEM_VARIANT,
  CONSERVATION_LIST_VARIANT,
} from "../../constants/framer-motions/variants";
import AnimatedList from "../UIs/AnimatedList";

type SearchSuggestionPropsType = {
  data: SearchSuggestionDataType;
  loading?: boolean;
  onSuggestionItemClick?: (id: any) => void;
  sx?: SxProps;
  loader?: ReactNode;
};

export type SearchSuggestionDataType = Array<{ id: any; value: string }>;

const SearchSuggestion: React.FC<SearchSuggestionPropsType> = ({
  data,
  loading,
  onSuggestionItemClick,
  sx,
  loader,
}) => {
  const theme = useTheme();
  const isLightMode = theme.palette.mode === "light";

  return (
    <List
      sx={{
        zIndex: (theme) => theme.zIndex.drawer,
        bgcolor: (theme) => theme.palette.background.paper,
        ...(isLightMode && { boxShadow: 1 }),
        borderRadius: 1,
        ...sx,
      }}
    >
      {loading && (
        <ListItem>
          {loader ? loader : <ListItemText>Loading...</ListItemText>}
        </ListItem>
      )}
      {!loading && data?.length <= 0 && <ListItem>No data result</ListItem>}
      {!loading &&
        data?.length > 0 &&
        data.map((s) => (
          <motion.div
            key={s.id}
            style={{ position: "relative" }}
            variants={CONSERVATION_ITEM_VARIANT}
          >
            <ListItemButton
              key={s.id}
              onClick={() =>
                onSuggestionItemClick && onSuggestionItemClick(s.id)
              }
            >
              {s.value}
            </ListItemButton>
          </motion.div>
        ))}
    </List>
  );
};

export default SearchSuggestion;
