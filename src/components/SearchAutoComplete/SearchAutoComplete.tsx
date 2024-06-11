import { Box, BoxProps, TextFieldProps } from "@mui/material";
import { ReactNode, useState } from "react";
import SearchSuggestion, { SearchSuggestionDataType } from "./SearchSuggestion";

import SearchBoxDebounce from "../SearchBoxDebounce";

interface SearchAutoCompletePropsType extends BoxProps {
  onSearchChange: (value: string) => void;
  suggestions?: SearchSuggestionDataType | ReactNode;
  loading?: boolean;
  inputProps?: Omit<
    TextFieldProps,
    "onChange" | "ref" | "helperText" | "onBlur"
  >;
  onSuggestionItemClick?: (id: any) => void;
}

const SearchAutoComplete: React.FC<SearchAutoCompletePropsType> = ({
  onSearchChange,
  loading,
  suggestions,
  inputProps,
  onSuggestionItemClick,
}) => {
  const [showSuggestion, setShowSuggestion] = useState<boolean>(false);

  const handleCancelSearch = () => {
    setShowSuggestion(false);
  };

  const handleSearchChange = (keySearch: string) => {
    if (keySearch.trim() !== "") {
      setShowSuggestion(true);
    } else {
      setShowSuggestion(false);
    }

    onSearchChange(keySearch.trim());
  };

  return (
    <Box sx={{ width: "100%", display: "flex", position: "relative" }}>
      <SearchBoxDebounce
        inputProps={inputProps}
        onSearchCancel={handleCancelSearch}
        onSearchChange={handleSearchChange}
      />
      {showSuggestion && suggestions && Array.isArray(suggestions) && (
        <SearchSuggestion
          sx={{
            position: "absolute",
            top: "calc(100% + 0.3rem)",
            left: 0,
            width: "100%",
          }}
          loading={loading}
          data={suggestions as SearchSuggestionDataType}
          onSuggestionItemClick={(id) => {
            if (onSuggestionItemClick) {
              onSuggestionItemClick(id);
              setShowSuggestion(false);
            }
          }}
        />
      )}

      {showSuggestion && suggestions && !Array.isArray(suggestions) && (
        <Box
          sx={{
            position: "absolute",
            top: "calc(100% + 0.3rem)",
            left: 0,
            width: "100%",
            flex: 1,
            overflowY: "auto",
          }}
        >
          {suggestions as ReactNode}
        </Box>
      )}
    </Box>
  );
};

export default SearchAutoComplete;
