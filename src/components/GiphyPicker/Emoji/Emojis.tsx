import React, { CSSProperties } from "react";
import { getGiphyEmojis } from "../../../utils/api";
import GridGifs from "../GridGifs";
import { GifsResult } from "@giphy/js-fetch-api";
import { IGif } from "@giphy/js-types";

type EmojiPropsType = {
  columns: number;
  style?: CSSProperties;
  onGifClick?: (gif: IGif) => void;
};

const Emojis: React.FC<EmojiPropsType> = ({ columns, style, onGifClick }) => {
  const fetchGifs = (offset: number, limit: number) =>
    getGiphyEmojis({ offset, limit });

  const shouldContinue = (gifs: GifsResult) => {
    return gifs.data.length > 0;
  };

  return (
    <GridGifs
      limit={36}
      onGifClick={onGifClick}
      shouldContinue={shouldContinue}
      style={{ ...style }}
      fetchGifs={fetchGifs}
      columns={columns}
    />
  );
};

export default Emojis;
