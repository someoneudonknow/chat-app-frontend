import { AddCircle, RemoveCircle } from "@mui/icons-material";
import { Chip } from "@mui/material";
import React from "react";
import { DO_NOT_USE_OR_YOU_WILL_BE_FIRED_EXPERIMENTAL_CREATE_ROOT_CONTAINERS } from "react-dom/client";
import { formatNumber } from "../../../utils";

type InterestChipPropsType = {
  id: string;
  name: string;
  usedCount: number;
  onClick?: (id: string, alreadyUsed?: boolean) => void;
  onIconClick?: (id: string, alreadyUsed?: boolean) => void;
  alreadyUsed?: boolean;
};

const InterestChip: React.FC<InterestChipPropsType> = ({
  id,
  name,
  usedCount,
  alreadyUsed,
  onClick,
  onIconClick,
}) => {
  return (
    <Chip
      label={`${name} (${formatNumber(usedCount)})`}
      onClick={() => onClick && onClick(id, alreadyUsed)}
      onDelete={() => onIconClick && onIconClick(id, alreadyUsed)}
      deleteIcon={alreadyUsed ? <RemoveCircle /> : <AddCircle />}
    />
  );
};

export default InterestChip;
