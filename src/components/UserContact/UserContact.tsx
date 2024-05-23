import React, { useCallback, useEffect, useMemo, useState } from "react";
import { InfiniteScroll } from "../InfiniteScroll";
import { Box, Grid, Paper } from "@mui/material";
import UserContactItem from "./UserContactItem";
import SearchBoxDebounce from "../SearchBoxDebounce";
import { FilterList } from "@mui/icons-material";
import SquareTooltipIconButton from "../UIs/SquareTootltipIconButton";
import ContactStats from "./ContactStats";
import User from "../../models/user.model";
import { UserService } from "../../services";
import { BASE_URL } from "../../constants/api-endpoints";
import { removeDuplicatedWith } from "../../utils";

const UserContact: React.FC = () => {
  const [contacts, setContacts] = useState<User[]>([]);
  const [activeContact, setActiveContact] = useState<User>();
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const [query, setQuery] = useState<{
    totalPage: number;
    currentPage: number;
    keyword: string;
  }>({
    totalPage: 1,
    currentPage: 1,
    keyword: "",
  });

  useEffect(() => {
    if (contacts && contacts.length > 0 && !activeContact) {
      setActiveContact(contacts[0]);
    }
  }, [contacts, activeContact]);

  useEffect(() => {
    if (query.keyword !== "") {
      (async () => {
        const userService = new UserService(BASE_URL);

        const userContacts = await userService.searchContacts({
          keyword: query.keyword,
          page: query.currentPage,
          limit: 10,
        });

        setContacts(userContacts.metadata.list);

        setQuery((prev) => ({
          ...prev,
          currentPage: prev.currentPage + 1,
          totalPage: userContacts.metadata.totalPages,
        }));
      })();
    }
  }, [query.keyword]);

  const hasNext = useMemo(() => {
    if (query.currentPage <= query.totalPage) {
      return true;
    }
    return false;
  }, [query]);

  const getNext = useCallback(async () => {
    const userService = new UserService(BASE_URL);
    let contacts = [];
    let totalPage = 1;

    if (query.keyword !== "") {
      const userContacts = await userService.searchContacts({
        keyword: query.keyword,
        page: query.currentPage,
        limit: 10,
      });

      contacts = userContacts.metadata.list;
      totalPage = userContacts.metadata.totalPages;
    } else {
      const userContacts = await userService.getContactsInfo({
        page: query.currentPage,
        limit: 10,
      });

      contacts = userContacts.metadata.list;
      totalPage = userContacts.metadata.totalPages;
    }

    setContacts((prev) =>
      removeDuplicatedWith(
        [...prev, ...contacts] as User[],
        (a, b) => a._id === b._id
      )
    );
    setQuery((prev) => ({
      ...prev,
      currentPage: prev.currentPage + 1,
      totalPage: totalPage,
    }));
  }, [query]);

  const handleContactSearchChanged = (keyword: string) => {
    setQuery((prev) => ({ ...prev, keyword: keyword, currentPage: 1 }));
  };

  const handleItemClick = (user: User) => {
    setActiveContact(user);
  };

  return (
    <Grid
      container
      spacing={2}
      sx={{
        overflow: "hidden",
        justifyContent: "space-between",
        height: "100%",
      }}
    >
      <Grid
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          width: "100%",
        }}
        item
        xs={8}
      >
        <Paper
          sx={{
            p: 2,
            mb: 1,
            borderRadius: 3,
            display: "flex",
            gap: "10px",
          }}
        >
          <SearchBoxDebounce onSearchChange={handleContactSearchChanged} />
          <SquareTooltipIconButton title="filter" placement="top">
            <FilterList />
          </SquareTooltipIconButton>
        </Paper>
        <InfiniteScroll
          loadingEl={<p>Loading...</p>}
          fetchNext={getNext}
          hasMore={hasNext}
          data={contacts}
          render={(u: User) => (
            <UserContactItem
              onItemClick={handleItemClick}
              key={u._id}
              data={u}
              active={u._id === activeContact?._id}
            />
          )}
        />
      </Grid>
      <Grid item xs={4} sx={{ flex: 1 }}>
        {activeContact && <ContactStats data={activeContact} />}
      </Grid>
    </Grid>
  );
};

export default UserContact;
