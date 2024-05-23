import { Stack } from "@mui/material";
import React from "react";
import LabelIconButton from "../../UIs/LabelIconButton";
import { Search, Visibility } from "@mui/icons-material";
import { Conservation } from "../../../models/conservation.model";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { useNavigate } from "react-router-dom";

type InboxActionsPropsType = {
  conservation: Conservation;
};

const InboxActions: React.FC<InboxActionsPropsType> = ({ conservation }) => {
  const currentUserId = useSelector(
    (state: RootState) => state.user.currentUser?._id
  );
  const navigate = useNavigate();
  const userInfo = conservation.members.find(
    (u) => u.user._id !== currentUserId
  );

  const handleViewProfile = () => {
    navigate(`/user/discover/${userInfo?.user._id}`);
  };

  return (
    <Stack direction="row" justifyContent="space-around">
      <LabelIconButton
        onClick={handleViewProfile}
        label="View Profile"
        icon={<Visibility />}
      />
      <LabelIconButton label="Search" icon={<Search />} />
    </Stack>
  );
};

export default InboxActions;