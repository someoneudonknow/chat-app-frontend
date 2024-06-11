import React, { CSSProperties } from "react";
import { getTrendingGifs } from "../../../utils/api";
import GridGifs from "../GridGifs";
import { IGif } from "@giphy/js-types";

type TrendingGifsPropsType = {
  columns: number;
  style?: CSSProperties;
  onGifClick?: (gif: IGif) => void;
};

const TrendingGifs: React.FC<TrendingGifsPropsType> = ({
  columns,
  style,
  onGifClick,
}) => {
  const fetchGifs = (offset: number, limit: number) =>
    getTrendingGifs({ offset, limit });

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

export default TrendingGifs;
