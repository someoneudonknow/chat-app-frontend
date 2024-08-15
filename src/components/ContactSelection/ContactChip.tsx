import { Avatar, Chip, ChipProps } from "@mui/material";
import React from "react";
import { UserContact } from "../../models/user.model";

type ContactChipPropsType = {
  name: string;
  photo?: UserContact["photo"];
  onDelete?: (id: string) => void;
  id: UserContact["_id"];
} & ChipProps;

const ContactChip: React.FC<ContactChipPropsType> = ({
  name,
  photo,
  onDelete,
  id,
  ...rest
}) => {
  return (
    <Chip
      variant="outlined"
      label={name}
      avatar={<Avatar src={photo}>{name.charAt(0).toUpperCase()}</Avatar>}
      onDelete={() => onDelete && onDelete(id)}
      {...rest}
    />
  );
};

export default ContactChip;
