import React, { useState } from "react";
import { Chip, Paper, Stack } from "@mui/material";
import { EmojiEmotions, TrendingUp } from "@mui/icons-material";
import { SearchAutoComplete } from "../SearchAutoComplete";
import { SearchSuggestionDataType } from "../SearchAutoComplete/SearchSuggestion";
import { getGiphySearchAutoComplete, getTrendingGifs } from "../../utils/api";
import { ICategory } from "@giphy/js-fetch-api";
import { IGif } from "@giphy/js-fetch-api";

import GifCategoriesList from "./GifCategoryCard/GifCategoriesList";
import GifsMansory from "./GifsMansory";
import { Grid } from "@giphy/react-components";
import TrendingGifs from "./TrendingGifs";

const GiphyPicker: React.FC = () => {
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const [giphySuggestions, setGiphySuggestions] =
    useState<SearchSuggestionDataType>([]);
  const [gifsFilter, setGifsFilter] = useState<
    "categories" | "trendings" | "sticker" | "searchResults"
  >("categories");

  const handleSearchChange = async (value: string) => {
    if (!value) return;

    setSearchLoading(true);
    try {
      const response = await getGiphySearchAutoComplete({
        keyword: value,
        limit: 10,
        offset: 0,
      });

      const result = await response.json();

      if (result.meta.status === 200) {
        setGiphySuggestions(
          result.data.map((d) => ({ id: d.name, value: d.name }))
        );
      }
    } catch (e: any) {
      console.error(e);
    }
    setSearchLoading(false);
  };

  const handleSearchResultClick = (id: any) => {
    console.log({ id });
  };

  const handleCategoryChoose = (category: ICategory) => {
    console.log({ category });
  };

  const handleTrendingGifsClick = async () => {
    setGifsFilter("trendings");
  };

  const handleEmojisClick = () => {};

  return (
    <Paper
      sx={{
        p: 1,
        width: "350px",
        height: "500px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <SearchAutoComplete
        inputProps={{ placeholder: "Search giphy..." }}
        onSearchChange={handleSearchChange}
        suggestions={giphySuggestions}
        loading={searchLoading}
        onSuggestionItemClick={handleSearchResultClick}
      />
      <Stack direction="row" sx={{ mt: 2 }} spacing={1}>
        <Chip
          onClick={handleTrendingGifsClick}
          label="Trendings"
          icon={<TrendingUp />}
        />
        <Chip
          onClick={handleEmojisClick}
          label="Emojis"
          icon={<EmojiEmotions />}
        />
      </Stack>
      <GifCategoriesList
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: "10px",
          flex: 1,
          marginTop: "15px",
          display: gifsFilter === "categories" ? "flex" : "none",
        }}
        onCategoryChoose={handleCategoryChoose}
      />
      <TrendingGifs
        columns={2}
        style={{
          marginTop: "15px",
          display: gifsFilter === "trendings" ? "flex" : "none",
          flex: 1,
        }}
      />
    </Paper>
  );
};

export default GiphyPicker;
