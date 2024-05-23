import React, { useState } from "react";
import PrimaryHeader from "../../components/PrimaryHeader";
import { SearchAutoComplete } from "../../components/SearchAutoComplete";
import UserService from "../../services/UserService";
import { BASE_URL } from "../../constants/api-endpoints";
import EveryoneSuggestions, {
  EveryoneSuggestionsItem,
} from "./EveryoneSuggestions";
import { useNavigate } from "react-router-dom";
import { SxProps } from "@mui/material";

type EveryoneSearchHeaderPropsType = {
  sx?: SxProps;
};

const EveryoneSearchHeader: React.FC<EveryoneSearchHeaderPropsType> = ({
  sx,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [suggestions, setSuggestions] = useState<EveryoneSuggestionsItem[]>([]);
  const navigate = useNavigate();

  const handleSearchChange = async (value: string) => {
    if (value.trim() === "") return;

    const userService = new UserService(BASE_URL);

    try {
      setLoading(true);
      const foundUsers = await userService.searchUsers(value);

      const mappedUsers: EveryoneSuggestionsItem[] = foundUsers?.metadata.map(
        (u: {
          _id: string;
          birthday?: string;
          userName?: string;
          photo?: string;
          email: string;
        }) => ({
          id: u._id,
          name: u.userName,
          email: u.email,
          photo: u.photo,
        })
      );

      setSuggestions(mappedUsers);
    } catch (err: any) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionItemClick = (id: string) => {
    navigate(`/user/discover/${id}`);
  };

  return (
    <PrimaryHeader sx={sx} title="Everyone">
      <SearchAutoComplete
        loading={loading}
        suggestions={
          <EveryoneSuggestions
            onSuggestionItemClick={handleSuggestionItemClick}
            data={suggestions}
            loading={loading}
          />
        }
        onSearchChange={handleSearchChange}
      />
    </PrimaryHeader>
  );
};

export default EveryoneSearchHeader;
