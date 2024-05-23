import {
  Chat,
  ConnectWithoutContact,
  Logout,
  Pending,
  PeopleAlt,
  RecentActors,
  Settings,
} from "@mui/icons-material";
import {
  Box,
  Divider,
  IconButton,
  Paper,
  Stack,
  useTheme,
} from "@mui/material";
import { MouseEventHandler, ReactNode, useEffect, useState } from "react";
import ThemeModeSwitchButton from "./ThemeModeSwitchButton";
import SquareTooltipIconButton from "./UIs/SquareTootltipIconButton";
import {
  DialogAction,
  DialogResult,
  LeftSideBarItemName,
} from "../constants/types";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store";
import ConfirmDialog from "./ConfirmDialog";
import { logout } from "../store/user/asyncThunks";
import { SettingMenu } from "./DropdownMenu";

type SideBarItemType = {
  name: LeftSideBarItemName;
  title: string;
  icon: ReactNode;
  index?: boolean;
};

const sideBarItems: SideBarItemType[] = [
  {
    index: true,
    name: LeftSideBarItemName.ALL_CONSERVATIONS,
    title: "All Conservations",
    icon: <Chat />,
  },
  {
    name: LeftSideBarItemName.EVERYONE,
    title: "Everyone",
    icon: <PeopleAlt />,
  },
  {
    name: LeftSideBarItemName.MY_CONTACTS,
    title: "My Contacts",
    icon: <RecentActors />,
  },
];

const logoutDialogActions: DialogAction[] = [
  {
    label: "Cancel",
    resultType: DialogResult.CANCEL,
  },
  {
    label: "Yes",
    resultType: DialogResult.OK,
  },
];

type LeftSideBarProps = {
  onSideBarItemClicked: (name: LeftSideBarItemName) => void;
  defaultItem?: string;
};

const LeftSideBar: React.FC<LeftSideBarProps> = ({
  onSideBarItemClicked,
  defaultItem,
}) => {
  const theme = useTheme();
  const [active, setActive] = useState<LeftSideBarItemName | "">(() => {
    if (defaultItem) {
      return (
        sideBarItems.find((sItem) => sItem.name === defaultItem)?.name ?? ""
      );
    }

    return sideBarItems.find((sItem) => sItem.index)?.name ?? "";
  });
  const [settingMenuAnchor, setSettingMenuAnchor] =
    useState<HTMLElement | null>(null);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (active !== "") {
      handleSideBarItemClicked(active);
    }
  }, []);

  const handleSideBarItemClicked = (name: LeftSideBarItemName) => {
    onSideBarItemClicked(name);
    setActive(name);
  };

  const handleLogoutBtnClick = () => {
    setOpenDialog(true);
  };

  const handleDialogConfirm = async (resultType: DialogResult) => {
    if (resultType === DialogResult.OK) {
      await dispatch(logout());
    }
    setOpenDialog(false);
  };

  const handleSettingButtonClicked: MouseEventHandler<HTMLButtonElement> = (
    e
  ) => {
    setSettingMenuAnchor(e.currentTarget);
  };

  const handleCloseSettingMenu = () => {
    setSettingMenuAnchor(null);
  };

  return (
    <>
      <ConfirmDialog
        open={openDialog}
        title="Are you sure want to logout ?"
        actions={logoutDialogActions}
        onConfirm={handleDialogConfirm}
      />
      <Paper
        sx={{
          width: "70px",
          p: 1,
          minHeight: "100vh",
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <SettingMenu
            anchor={settingMenuAnchor}
            onClose={handleCloseSettingMenu}
          />
          <Box sx={{ width: "100%", textAlign: "center" }}>
            <IconButton
              onClick={handleSettingButtonClicked}
              sx={{
                "&:hover": {
                  transform: "rotate(180deg) scale(1.1)",
                },
                transition: "all ease 0.3s",
              }}
            >
              <Settings />
            </IconButton>
          </Box>

          <Divider sx={{ mt: 2, mb: 1 }} />
          <Stack spacing={2} direction="column">
            {sideBarItems.map((item) => {
              return (
                <SquareTooltipIconButton
                  key={item.name}
                  title={item.title}
                  onClick={() => handleSideBarItemClicked(item.name)}
                  sx={{
                    bgcolor:
                      item.name === active
                        ? theme.palette.containerSecondary?.main
                        : "",
                    "&:hover": {
                      bgcolor:
                        item.name === active
                          ? theme.palette.containerSecondary?.main
                          : "",
                    },
                  }}
                >
                  {item.icon}
                </SquareTooltipIconButton>
              );
            })}
          </Stack>
        </Box>

        <SquareTooltipIconButton
          sx={{
            width: "100%",
            "&:hover": {
              bgcolor: theme.palette.error.main,
              color: theme.palette.error.contrastText,
            },
          }}
          onClick={handleLogoutBtnClick}
          title="Logout"
        >
          <Logout />
        </SquareTooltipIconButton>
      </Paper>
    </>
  );
};

export default LeftSideBar;
