import { ICategory } from "@giphy/js-fetch-api";
import React, { CSSProperties, useState } from "react";
import { getGiphyCategories } from "../../../utils/api";
import { InfiniteScroll } from "../../InfiniteScroll";
import { Box, CircularProgress } from "@mui/material";
import GifCategoryCard from "./GifCategoryCard";

type GifCategoriesListPropsType = {
  onCategoryChoose?: (category: ICategory) => void;
  style?: CSSProperties;
};

const GifCategoriesList: React.FC<GifCategoriesListPropsType> = ({
  onCategoryChoose,
  style,
}) => {
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [categories, setCategories] = useState<ICategory[]>([]);

  const getNextCategory = async () => {
    const limit = 10;
    const offset = (currentPage - 1) * limit;

    try {
      const response = await getGiphyCategories({ offset, limit });

      if (response.meta.status === 200) {
        setCategories((prev) => [...prev, ...response.data]);
        setCurrentPage((prev) => prev + 1);
        setHasMore(response.pagination.count < response.pagination.total_count);
      }
    } catch (e: any) {
      console.error(e);
    }
  };
  return (
    <InfiniteScroll
      loadingEl={
        <Box component="div" sx={{ textAlign: "center" }}>
          <CircularProgress size="small" />
        </Box>
      }
      style={style}
      fetchNext={getNextCategory}
      hasMore={hasMore}
      data={categories}
      render={(data: ICategory, i) => (
        <GifCategoryCard
          onClick={() => onCategoryChoose && onCategoryChoose(data)}
          key={i}
          sx={{ width: "calc(50% - 10px)" }}
          data={data}
        />
      )}
    />
  );
};

export default GifCategoriesList;
