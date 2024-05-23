import { GiphyFetch } from "@giphy/js-fetch-api";

const GIPHY_API_KEY = import.meta.env.VITE_GIFPHY_API_KEY;
const GIPHY_BASE_URL = import.meta.env.VITE_GIPHY_BASE_URL;

const gf = new GiphyFetch(GIPHY_API_KEY);

export const getCountries = async () => {
  const countriesResponse = await fetch(
    "https://countriesnow.space/api/v0.1/countries/iso"
  );

  return await countriesResponse.json();
};

export const ipLookup = async () => {
  const ipLookupResponse = await fetch("http://ip-api.com/json");

  return await ipLookupResponse.json();
};

export const getTrendingGifs = async ({
  offset,
  limit,
}: {
  offset: number;
  limit: number;
}) => {
  return await gf.trending({ offset, limit });
};

export const giphySearch = async ({
  keyword,
  limit = 10,
  offset,
}: {
  keyword: string;
  limit: number;
  offset: number;
}) => {
  return await gf.search(keyword, { offset, limit });
};

export const getGiphyCategories = async ({
  offset = 0,
  limit = 20,
}: {
  offset: number;
  limit: number;
}) => {
  return await gf.categories({ offset, limit: limit });
};

export const getGiphySearchAutoComplete = async ({
  keyword,
  limit = 5,
  offset = 0,
}: {
  keyword: string;
  limit: number;
  offset: number;
}) => {
  return await fetch(
    `${GIPHY_BASE_URL}/gifs/search/tags?${new URLSearchParams({
      api_key: GIPHY_API_KEY,
      q: keyword,
      limit: String(limit),
      offset: String(offset),
    }).toString()}`
  );
};

export const getGiphyTrendingGifs = async ({
  offset,
  limit,
}: {
  offset: number;
  limit: number;
}) => {
  return await gf.trending({ offset: offset, limit: limit });
};
