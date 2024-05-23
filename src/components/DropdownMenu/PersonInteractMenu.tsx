import { ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material";
import React, { useId, useState } from "react";
import { DropDownMenuPropsType } from "../../constants/interfaces";
import { PersonAdd, RemoveRedEye } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import AddContactDialog from "../AddContactDialog";

type PersonInteractMenuPropsType = {
  userId: string;
} & DropDownMenuPropsType;

const PersonInteractMenu: React.FC<PersonInteractMenuPropsType> = ({
  anchor,
  onClose,
  userId,
}) => {
  const menuId = useId();
  const navigate = useNavigate();
  const [addContactDialogOpen, setAddContactDialogOpen] =
    useState<boolean>(false);

  const handleViewProfileClick = (e) => {
    e.stopPropagation();
    navigate(`/user/discover/${userId}`);
    onClose();
  };

  const handleAddContact = (e) => {
    e.stopPropagation();
    setAddContactDialogOpen(true);
    onClose();
  };

  return (
    <>
      <AddContactDialog
        userId={userId}
        handleClose={() => setAddContactDialogOpen(false)}
        open={addContactDialogOpen}
      />
      <Menu
        anchorEl={anchor}
        open={!!anchor}
        onClose={onClose}
        id={`menu-${menuId}`}
      >
        <MenuItem onClick={handleViewProfileClick}>
          <ListItemIcon>
            <RemoveRedEye />
          </ListItemIcon>
          <ListItemText>View Profile</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleAddContact}>
          <ListItemIcon>
            <PersonAdd />
          </ListItemIcon>
          <ListItemText>Add contact</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export default PersonInteractMenu;
