import { MoreVert } from "@mui/icons-material";
import {
  Avatar,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
  SxProps,
  Typography,
  styled,
} from "@mui/material";
import React, { useState } from "react";
import { PersonInteractMenu } from "../DropdownMenu";
import { useNavigate } from "react-router-dom";
import User from "../../models/user.model";
import Industry from "../../models/industry.model";

export const TextOverflowEllipsis = styled(Typography)({
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
}) as typeof Typography;

type PersonItemPropsType = {
  person: User;
  sx?: SxProps;
};

const PersonItem: React.FC<PersonItemPropsType> = ({ person, sx }) => {
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const navigate = useNavigate();

  const handleItemClick = () => {
    navigate(`/user/discover/${person._id}`);
  };

  return (
    <>
      <PersonInteractMenu
        userId={person._id}
        anchor={menuAnchor}
        onClose={() => setMenuAnchor(null)}
      />
      <ListItem
        onClick={handleItemClick}
        sx={{
          py: "10px",
          transition: "all linear 0.1s",
          height: "100%",
          "&:hover": {
            cursor: "pointer",
            bgcolor: (theme) =>
              theme.palette.mode === "dark"
                ? "rgba(255, 255, 255,0.1)"
                : "rgba(0,0,0,0.05)",
          },
          ...sx,
        }}
        secondaryAction={
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              setMenuAnchor(e.currentTarget);
            }}
          >
            <MoreVert />
          </IconButton>
        }
      >
        <ListItemAvatar>
          <Avatar src={person?.photo} />
        </ListItemAvatar>
        <ListItemText
          primary={
            <TextOverflowEllipsis
              component="div"
              variant="body2"
              fontSize="1.1rem"
            >
              {person?.userName || person.email}
            </TextOverflowEllipsis>
          }
          secondary={
            <TextOverflowEllipsis
              component="span"
              sx={{ letterSpacing: 0.3 }}
              fontSize="0.8rem"
            >
              {(person.industry as Industry)?.name}
            </TextOverflowEllipsis>
          }
        />
      </ListItem>
    </>
  );
};

export default PersonItem;
