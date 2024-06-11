import React, { CSSProperties, useCallback, useRef, useState } from "react";
import { IGif } from "@giphy/js-types";
import { InfiniteScroll } from "../../InfiniteScroll";
import { Box, CircularProgress, Skeleton, Typography } from "@mui/material";
import { GifsResult } from "@giphy/js-fetch-api";
import Gif from "../Gif";

type GridGifsPropsType = {
  columns: number;
  fetchGifs: (offset: number, limit: number) => Promise<GifsResult>;
  onGifClick?: (gif: IGif) => void;
  style?: CSSProperties;
  shouldContinue?: (gifsResult: GifsResult) => boolean;
  limit: number;
};

const GridGifs: React.FC<GridGifsPropsType> = ({
  columns,
  style,
  fetchGifs,
  shouldContinue,
  onGifClick,
  limit,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [gifs, setGifs] = useState<IGif[][]>(() =>
    [...Array(columns)].map<IGif[]>(() => [])
  );
  const columnHeights = useRef<number[]>(new Array(columns).fill(0));

  const getNextGifs = useCallback(async () => {
    const offset = (currentPage - 1) * limit;

    try {
      const gifs = await fetchGifs(offset, limit);

      if (gifs.meta.status === 200) {
        setGifs((prev) => {
          const prevClone = [...prev];

          for (const item of gifs.data) {
            if (!item.images?.fixed_width_small.webp) continue;

            const smallestHeight = Math.min(...columnHeights.current);
            const indexOfSmallestHeight =
              columnHeights.current.indexOf(smallestHeight);
            const smallestColumns = prevClone[indexOfSmallestHeight];

            smallestColumns.push(item);

            const newHeight =
              smallestHeight + item.images?.fixed_width_small?.height;
            columnHeights.current[indexOfSmallestHeight] = newHeight;
          }

          return prevClone;
        });

        setCurrentPage((prev) => prev + 1);

        if (shouldContinue) {
          setHasMore(shouldContinue(gifs));
        } else {
          setHasMore(
            gifs.pagination.count + gifs.pagination.offset <
              gifs.pagination.total_count
          );
        }
      } else {
        setHasMore(false);
      }
    } catch (err: any) {
      throw new Error(
        "Something went wrong while fetching gifs, please try again later."
      );
    }
  }, [currentPage, shouldContinue, fetchGifs, limit]);

  return (
    <InfiniteScroll
      debounceTimeout={500}
      errorEl={(err) => (
        <Typography color="error" sx={{ width: "100%", textAlign: "center" }}>
          {err.message}
        </Typography>
      )}
      loadingEl={
        <Box style={{ textAlign: "center", width: "100%" }}>
          <CircularProgress />
        </Box>
      }
      style={{
        alignItems: "start",
        flexWrap: "wrap",
        columnGap: "5px",
        flexDirection: "row",
        ...style,
      }}
      data={gifs}
      fetchNext={getNextGifs}
      hasMore={hasMore}
      render={(data: IGif[], i: number) => (
        <Box
          key={i}
          sx={{
            display: "flex",
            rowGap: "5px",
            flexDirection: "column",
            width: `calc(100% / ${columns} - 5px)`,
          }}
        >
          {data.map((g, index) => (
            <Gif
              gif={g}
              key={`${i}-${index}`}
              onClick={() => onGifClick && onGifClick(g)}
            />
          ))}
        </Box>
      )}
    />
  );
};

export default GridGifs;
