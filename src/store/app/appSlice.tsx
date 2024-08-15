import { createSlice } from "@reduxjs/toolkit";
import { ReactNode } from "react";
import { LeftSideBarItemName } from "../../constants/types";
import { Chat, PeopleAlt, RecentActors } from "@mui/icons-material";
import { NavigateOptions } from "react-router-dom";

type SideBarItemType = {
  name: LeftSideBarItemName;
  title: string;
  icon: ReactNode;
  haveNoti: boolean;
  path: string;
  navigateOptions?: NavigateOptions;
};

type AppSliceType = {
  sideBarItems: SideBarItemType[];
  currentSidebarItem: SideBarItemType | null;
};

const sideBarItems: SideBarItemType[] = [
  {
    name: LeftSideBarItemName.ALL_CONSERVATIONS,
    title: "All Conservations",
    icon: <Chat />,
    haveNoti: false,
    path: "/user/chat/all-conservations",
  },
  {
    name: LeftSideBarItemName.EVERYONE,
    title: "Everyone",
    icon: <PeopleAlt />,
    haveNoti: false,
    path: "/user/chat/everyone",
  },
  {
    name: LeftSideBarItemName.MY_CONTACTS,
    title: "My Contacts",
    icon: <RecentActors />,
    haveNoti: false,
    path: `/user/chat/my-contacts?q=${
      sessionStorage.getItem("active-tab") || "all"
    }`,
  },
];

const initState: AppSliceType = {
  sideBarItems: sideBarItems,
  currentSidebarItem: sideBarItems[0],
};

const appSlice = createSlice({
  name: "app_slice",
  initialState: initState,
  reducers: {
    setCurrentSidebarItem: (state, { payload }) => {
      const foundSideBarItem = state.sideBarItems.find(
        (sit) => sit.name === payload
      );

      if (foundSideBarItem) {
        state.currentSidebarItem = foundSideBarItem;
      }
    },
  },
});

export const { setCurrentSidebarItem } = appSlice.actions;

export default appSlice.reducer;
