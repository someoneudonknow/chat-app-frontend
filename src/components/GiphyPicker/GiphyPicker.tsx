import React, { useState } from "react";
import { Chip, Paper, Stack, Typography } from "@mui/material";
import { Category, EmojiEmotions, TrendingUp } from "@mui/icons-material";
import { SearchAutoComplete } from "../SearchAutoComplete";
import { SearchSuggestionDataType } from "../SearchAutoComplete/SearchSuggestion";
import { getGiphySearchAutoComplete } from "../../utils/api";
import { ICategory } from "@giphy/js-fetch-api";
import { IGif } from "@giphy/js-types";
import GifCategoriesList from "./GifCategoryCard/GifCategoriesList";
import TrendingGifs from "./TrendingGifs";
import Emojis from "./Emoji";
import GifsByKeyword from "./GifsByKeyword";

type GiphyPickerPropsType = {
  onGifClick?: (gif: IGif) => void;
};

const GiphyPicker: React.FC<GiphyPickerPropsType> = ({ onGifClick }) => {
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const [giphySuggestions, setGiphySuggestions] =
    useState<SearchSuggestionDataType>([]);
  const [gifsFilter, setGifsFilter] = useState<
    "categories" | "trendings" | "searchResults" | "emojis" | "idle"
  >("categories");
  const [searchGif, setSearchGif] = useState<string>();

  const handleSearchChange = async (value: string) => {
    if (!value) {
      if (gifsFilter === "searchResults") {
        setGifsFilter("categories");
      }
      return;
    }
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
    setSearchGif(id);
    setGifsFilter("idle");

    setTimeout(() => {
      setGifsFilter("searchResults");
    }, 0);
  };

  const handleCategoryChoose = (category: ICategory) => {
    setSearchGif(category.name);
    setGifsFilter("idle");

    setTimeout(() => {
      setGifsFilter("searchResults");
    }, 0);
  };

  const handleTrendingGifsClick = async () => {
    setGifsFilter("trendings");
  };

  const handleEmojisClick = () => {
    setGifsFilter("emojis");
  };

  const handleCategoryClick = () => {
    setGifsFilter("categories");
  };

  return (
    <Paper
      sx={{
        p: 1,
        width: {
          xs: "250px",
          md: "450px",
        },
        height: {
          xs: "400px",
          md: "500px",
        },
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
      <Stack direction="row" sx={{ mt: 2, overflowX: "auto" }} spacing={1}>
        <Chip
          onClick={handleCategoryClick}
          label="All Categories"
          icon={<Category />}
          variant={gifsFilter === "categories" ? "filled" : "outlined"}
        />
        <Chip
          onClick={handleTrendingGifsClick}
          label="Trendings"
          icon={<TrendingUp />}
          variant={gifsFilter === "trendings" ? "filled" : "outlined"}
        />
        <Chip
          onClick={handleEmojisClick}
          label="Emojis"
          icon={<EmojiEmotions />}
          variant={gifsFilter === "emojis" ? "filled" : "outlined"}
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
        onGifClick={onGifClick}
        columns={3}
        style={{
          marginTop: "15px",
          display: gifsFilter === "trendings" ? "flex" : "none",
          flex: 1,
        }}
      />
      <Emojis
        onGifClick={onGifClick}
        columns={6}
        style={{
          marginTop: "15px",
          display: gifsFilter === "emojis" ? "flex" : "none",
          flex: 1,
        }}
      />
      {searchGif && gifsFilter === "searchResults" && (
        <>
          <Typography variant="h5" sx={{ mt: 2, textTransform: "capitalize" }}>
            {searchGif}
          </Typography>
          <GifsByKeyword
            onGifClick={onGifClick}
            columns={3}
            keyword={searchGif || ""}
            style={{
              marginTop: "5px",
              display: "flex",
              flex: 1,
            }}
          />
        </>
      )}
    </Paper>
  );
};

export default GiphyPicker;
