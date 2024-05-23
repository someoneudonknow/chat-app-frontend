import { SxProps } from "@mui/material";
import React, { useState } from "react";
import { SearchAutoComplete } from "../../components/SearchAutoComplete";
import PrimaryHeader from "../../components/PrimaryHeader";
import { UserService } from "../../services";
import { BASE_URL } from "../../constants/api-endpoints";
import { Conservation } from "../../models/conservation.model";
import ConservationSuggestions from "../../components/Conservation/ConservationSuggestions";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { getConservationItemInfo } from "../../utils";

type ConservationSearchHeaderPropsType = {
  sx?: SxProps;
};

const ConservationSearchHeader: React.FC<ConservationSearchHeaderPropsType> = ({
  sx,
}) => {
  const [suggestion, setSuggestion] = useState<(ConservationItem | null)[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const currentUserId = useSelector(
    (state: RootState) => state.user.currentUser?._id
  );

  const handleSearchChange = async (value: string) => {
    if (value === "") return;

    try {
      setLoading(true);
      const userService = new UserService(BASE_URL);

      const result = await userService.searchConservations({
        keyword: value,
        page: 1,
        limit: 7,
      });

      setSuggestion(
        (result.metadata.list as Conservation[]).map((c) =>
          getConservationItemInfo(c, currentUserId)
        )
      );
    } catch (err: any) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleConservationItemClick = (id: string) => {
    console.log({ id });
  };

  return (
    <PrimaryHeader title="All Conservations">
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
    </PrimaryHeader>
  );
};

export default ConservationSearchHeader;
