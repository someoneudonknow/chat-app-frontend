import React, { useCallback, useState } from "react";
import { UserContact } from "../../models/user.model";
import { ListItem, Paper, SxProps, ListItemText } from "@mui/material";
import ContactSelectionItem from "./ContactSelectionItem";
import SearchBoxDebounce from "../SearchBoxDebounce";
import { UserService } from "../../services";
import { BASE_URL } from "../../constants/api-endpoints";
import { InfiniteScroll } from "../InfiniteScroll";
import { getUserContactName } from "./utils";

type ContactSelectionListPropsType = {
  onItemClick?: (selectedContact: UserContact) => void;
  selectedContacts?: UserContact[];
  sx?: SxProps;
};

const LIMIT = 10;

const userService = new UserService(BASE_URL);

const ContactSelectionList: React.FC<ContactSelectionListPropsType> = ({
  sx,
  onItemClick,
  selectedContacts,
}) => {
  const [userContacts, setUserContacts] = useState<UserContact[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [contactsFilter, setContactsFilter] = useState<{
    keyword: string;
    page: number;
    limit: number;
  }>({ keyword: "", page: 1, limit: LIMIT });

  const fetchNextContacts = useCallback(async () => {
    try {
      const { keyword, page, limit } = contactsFilter;

      let res;

      if (keyword !== "") {
        res = await userService.searchContacts({
          keyword: keyword,
          page: page,
          limit: limit,
        });
      } else {
        res = await userService.getContactsInfo({
          page: page,
          limit: limit,
        });
      }

      const userContacts = res?.metadata?.list;

      setHasMore(userContacts && (userContacts as UserContact[]).length > 0);
      setUserContacts((prev) => [...prev, ...userContacts]);
      setContactsFilter((prev) => ({
        ...prev,
        page: prev.page + 1,
      }));
    } catch (err) {
      console.log(err);
    }
  }, [contactsFilter]);

  const handleSearchChanged = async (keyword: string) => {
    setContactsFilter({ keyword: keyword, limit: LIMIT, page: 1 });
    setUserContacts([]);
    setHasMore(true);
  };

  return (
    <Paper
      component="div"
      sx={{
        flexDirection: "column",
        ...sx,
      }}
    >
      <ListItem>
        <SearchBoxDebounce onSearchChange={handleSearchChanged} />
      </ListItem>
      {userContacts.length <= 0 && (
        <ListItem>
          <ListItemText primary="No contacts found" />
        </ListItem>
      )}
      <InfiniteScroll
        style={{ width: "100%", flex: 1, padding: 0 }}
        fetchNext={fetchNextContacts}
        data={userContacts}
        hasMore={hasMore}
        render={(contact: UserContact) => (
          <ContactSelectionItem
            sx={{ width: "100%" }}
            key={contact._id}
            active={
              selectedContacts &&
              selectedContacts.some((c) => c._id === contact._id)
            }
            name={getUserContactName(contact)}
            photo={contact.photo}
            onClick={() => onItemClick && onItemClick(contact)}
          />
        )}
      />
    </Paper>
  );
};

export default ContactSelectionList;
