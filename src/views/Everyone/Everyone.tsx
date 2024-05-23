import React, { useMemo, useState } from "react";
import EveryoneSearchHeader from "./EveryoneSearchHeader";
import { InfiniteScroll } from "../../components/InfiniteScroll";
import UserService from "../../services/UserService";
import { BASE_URL } from "../../constants/api-endpoints";
import { Box, CircularProgress } from "@mui/material";
import { PersonItem } from "../../components/Person";
import ListWrapper from "../../components/UIs/ListWrapper";
import User from "../../models/user.model";

const LIMIT = 10;

const Everyone = () => {
  const [people, setPeople] = useState<User[]>([]);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const hasNext = useMemo(() => {
    if (totalPage) {
      return currentPage <= totalPage;
    }
    return false;
  }, [currentPage, totalPage]);

  const getNextRecommendation = async () => {
    try {
      const userService = new UserService(BASE_URL);
      const result = await userService.getContactRecomendations({
        page: currentPage,
        limit: LIMIT,
      });

      setPeople((prev) => [...prev, ...(result.metadata.list as User[])]);
      setTotalPage(result.metadata.totalPages as number);
      setCurrentPage((prev) => prev + 1);
    } catch (err: any) {
      console.error(err);
    }
  };

  return (
    <ListWrapper>
      <EveryoneSearchHeader />
      <InfiniteScroll
        loadingEl={
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <CircularProgress />
          </Box>
        }
        render={(data: User) => {
          return <PersonItem person={data} key={data._id} />;
        }}
        data={people}
        fetchNext={getNextRecommendation}
        hasMore={hasNext}
      />
    </ListWrapper>
  );
};

export default Everyone;
