import React, { CSSProperties, useState } from "react";
import { IGif } from "@giphy/js-types";
import { getTrendingGifs } from "../../../utils/api";
import { InfiniteScroll } from "../../InfiniteScroll";
import { Box, SxProps } from "@mui/material";
import { splitArrayData } from "../../../utils";

type TrendingGifsPropsType = {
  columns: number;
  style?: CSSProperties;
};

const TrendingGifs: React.FC<TrendingGifsPropsType> = ({ columns, style }) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [trendingGifs, setTrendingGifs] = useState<IGif[][]>(() =>
    new Array(columns).fill(undefined).map((_) => [])
  );

  const getNextGifs = async () => {
    const limit = 10;
    const offset = (currentPage - 1) * limit;

    try {
      const trendingGifs = await getTrendingGifs({ offset: offset, limit: 10 });
      if (trendingGifs.meta.status === 200) {
        const spiltedData = splitArrayData(trendingGifs.data, columns);

        setTrendingGifs((prev) => {
          return prev.map((arr, i) => [...arr, ...spiltedData[i]]);
        });
        setCurrentPage((prev) => prev + 1);
        setHasMore(
          trendingGifs.pagination.count + trendingGifs.pagination.offset <
            trendingGifs.pagination.total_count
        );
      } else {
        setHasMore(false);
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  return (
    <InfiniteScroll
      loadingEl={<p style={{ textAlign: "center" }}>Loading...</p>}
      style={{
        alignItems: "start",
        flexWrap: "wrap",
        columnGap: "5px",
        justifyContent: "space-between",
        flexDirection: "row",
        ...style,
      }}
      data={trendingGifs}
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
          {data.map((g) => (
            <Box
              sx={{
                overflow: "hidden",
                width: "100%",
                borderRadius: "5px",
                "&:hover > img": {
                  transform: "scale(1.3)",
                  cursor: "pointer",
                },
              }}
            >
              <img
                style={{
                  transition: "all ease 0.3s",
                  width: "100%",
                  objectFit: "cover",
                  objectPosition: "center",
                  borderRadius: "5px",
                }}
                alt={g.alt_text}
                src={g.images.fixed_width_small.webp}
              />
            </Box>
          ))}
        </Box>
      )}
    />
  );
};

export default TrendingGifs;
