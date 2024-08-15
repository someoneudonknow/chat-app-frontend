import { Box, IconButton, SxProps } from "@mui/material";
import React, { useState } from "react";
import { SearchAutoComplete } from "../../components/SearchAutoComplete";
import PrimaryHeader from "../../components/PrimaryHeader";
import { ConservationService, UserService } from "../../services";
import { BASE_URL } from "../../constants/api-endpoints";
import {
  Conservation,
  ConservationType,
  Group,
} from "../../models/conservation.model";
import ConservationSuggestions from "../../components/Conservation/ConservationSuggestions";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { getConservationItemInfo } from "../../utils";
import { ConservationItemType } from "../../constants/types";
import { useNavigate } from "react-router-dom";
import { ModeEdit } from "@mui/icons-material";
import CreateGroupModal from "../../components/CreateGroupModal";
import { addConservation } from "../../store/userConservation";

type ConservationSearchHeaderPropsType = {
  sx?: SxProps;
};

const PAGE = 1;
const LIMIT = 7;
const MEMBER_LIMIT = 100;

const userService = new UserService(BASE_URL);
const conservationService = new ConservationService(BASE_URL);

const ConservationSearchHeader: React.FC<ConservationSearchHeaderPropsType> = ({
  sx,
}) => {
  const [suggestion, setSuggestion] = useState<ConservationItemType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const currentUserId = useSelector(
    (state: RootState) => state.user.currentUser?._id
  );
  const [createGroupModal, setCreateGroupModal] = useState<boolean>(false);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const handleSearchChange = async (value: string) => {
    if (value === "") return;

    try {
      setLoading(true);

      const result = await userService.searchConservations({
        keyword: value,
        page: PAGE,
        limit: LIMIT,
      });

      if (currentUserId) {
        setSuggestion(() => {
          const conservations: ConservationItemType[] = [];

          (result.metadata.list as Conservation[]).forEach((c) => {
            const conserInfo = getConservationItemInfo(c, currentUserId);

            if (conserInfo !== null) {
              conservations.push(conserInfo);
            }
          });

          return conservations;
        });
      }
    } catch (err: any) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleOpenCreateGroupModal = () => {
    setCreateGroupModal(true);
  };

  const handleCreateGroup = async (
    newGroup: Partial<Group> & { members: string[] }
  ) => {
    try {
      const createdGroup = await conservationService.createConservation({
        type: ConservationType.GROUP,
        members: newGroup.members,
        conservationAttributes: {
          groupName: newGroup.groupName,
          isPublished: newGroup.isPublished,
          description: newGroup.description,
          memberLimit: MEMBER_LIMIT,
        },
      });

      dispatch(addConservation(createdGroup.metadata));
    } catch (err) {
      console.log(err);
    }
  };

  const handleConservationItemClick = (id: string) => {
    navigate(`/user/chat/all-conservations/${id}`);
  };

  return (
    <>
      <CreateGroupModal
        onCreate={handleCreateGroup}
        open={createGroupModal}
        handleClose={() => setCreateGroupModal(false)}
      />
      <PrimaryHeader
        sx={{ display: "flex", flexWrap: "wrap", ...sx }}
        title="All Conservations"
      >
        <Box sx={{ flex: 1, textAlign: "right" }}>
          <IconButton onClick={handleOpenCreateGroupModal}>
            <ModeEdit />
          </IconButton>
        </Box>
        <Box sx={{ width: "100%" }}>
          <SearchAutoComplete
            loading={loading}
            suggestions={
              <ConservationSuggestions
                loading={loading}
                data={suggestion}
                onSuggestionItemClick={handleConservationItemClick}
              />
            }
            onSearchChange={handleSearchChange}
          />
        </Box>
      </PrimaryHeader>
    </>
  );
};

export default ConservationSearchHeader;
