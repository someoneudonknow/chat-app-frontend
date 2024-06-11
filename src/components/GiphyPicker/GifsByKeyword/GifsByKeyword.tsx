import React, { CSSProperties, useCallback } from "react";
import { giphySearch } from "../../../utils/api";
import GridGifs from "../GridGifs";
import { IGif } from "@giphy/js-types";

type GifsByKeywordPropsType = {
  keyword: string;
  style?: CSSProperties;
  columns: number;
  onGifClick?: (gif: IGif) => void;
};

const GifsByKeyword: React.FC<GifsByKeywordPropsType> = ({
  keyword,
  columns,
  style,
  onGifClick,
}) => {
  const fetchGifs = useCallback(
    (offset: number, limit: number) =>
      giphySearch({
        keyword: keyword,
        options: {
          sort: "relevant",
          lang: "es",
          limit: limit,
          offset: offset,
        },
      }),
    [keyword]
  );

  return (
    <GridGifs
      limit={12}
      onGifClick={onGifClick}
      style={{ ...style }}
      fetchGifs={fetchGifs}
      columns={columns}
    />
  );
};

export default GifsByKeyword;
