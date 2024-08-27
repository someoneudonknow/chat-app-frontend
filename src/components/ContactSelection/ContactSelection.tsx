import {
  Box,
  ClickAwayListener,
  IconButton,
  styled,
  TextFieldProps,
  FormControl,
  InputLabel,
  Input,
  Typography,
  Portal,
  FormHelperText,
} from "@mui/material";
import React, { MouseEventHandler, useEffect, useRef, useState } from "react";
import { UserContact } from "../../models/user.model";
import ContactChip from "./ContactChip";
import ContactSelectionList from "./ContactSelectionList";
import { getUserContactName } from "./utils";
import { Cancel } from "@mui/icons-material";

type ContactSelectionPropsType = {
  onSelectionChange?: (contacts: UserContact[]) => void;
  onFocused?: () => void;
  error?: boolean;
  helperText?: string | boolean;
};

type StyledContainerPropsType = {
  focused?: boolean;
  error?: boolean;
};

const ContactSelection: React.FC<ContactSelectionPropsType> = ({
  onSelectionChange,
  onFocused,
  error,
  helperText,
}) => {
  const [selectedContacts, setSelectedContacts] = useState<UserContact[]>([]);
  const [containerFocused, setContainerFocused] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>();
  const [selectionListOpen, setSelectionListOpen] = useState<boolean>(false);
  const [selectionListPos, setSelectionListPos] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const screenHeight = window.innerHeight;

  useEffect(() => {
    onSelectionChange && onSelectionChange(selectedContacts);

    //eslint-disable-next-line
  }, [selectedContacts]);

  useEffect(() => {
    if (containerFocused) {
      onFocused && onFocused();
    }

    // eslint-disable-next-line
  }, [containerFocused]);

  useEffect(() => {
    const handleResize = () => {
      setSelectionListPos({
        top: containerRef.current?.getBoundingClientRect().bottom || 0,
        left: containerRef.current?.getBoundingClientRect().left || 0,
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleClickAway = () => {
    setContainerFocused(false);
    setSelectionListOpen(false);
  };

  const handleContainerClicked: MouseEventHandler<HTMLDivElement> = (e) => {
    e.stopPropagation();
    setContainerFocused(true);
    setSelectionListOpen(true);
  };

  const handleSelectionChanged = (contact: UserContact) => {
    setSelectedContacts((prev) => {
      const foundContact = prev.find((c) => c._id === contact._id);

      if (foundContact) {
        return prev.filter((c) => c._id !== foundContact._id);
      } else {
        return [...prev, contact];
      }
    });
  };

  const handleContactChipDelete = (id: string) => {
    setSelectedContacts((prev) => prev.filter((c) => c._id !== id));
  };

  const clearAllSelectedContacts = () => {
    setSelectedContacts([]);
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <div>
        <StyledContainer
          error={error}
          component="div"
          focused={containerFocused}
          onClick={handleContainerClicked}
          ref={containerRef}
        >
          {selectedContacts.length <= 0 && (
            <Typography
              sx={{
                width: "100%",
                color: (theme) => {
                  if (error) return theme.palette.error.main;
                  if (containerFocused) return theme.palette.primary.main;
                  return theme.palette.secondary.main;
                },
              }}
            >
              Click here to select group's members*
            </Typography>
          )}
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: "5px",
              maxHeight: "60px",
              flex: 1,
              overflowY: "auto",
            }}
          >
            {selectedContacts.map((c) => (
              <ContactChip
                key={c._id}
                id={c._id}
                name={getUserContactName(c)}
                photo={c.photo}
                onDelete={handleContactChipDelete}
              />
            ))}
          </Box>
          {selectedContacts.length > 0 && (
            <IconButton
              sx={{ height: "100%" }}
              onClick={clearAllSelectedContacts}
            >
              <Cancel />
            </IconButton>
          )}
          <ContactSelectionList
            sx={{
              pt: 1,
              width: `${containerRef.current?.offsetWidth}px`,
              zIndex: 9999,
              position: "fixed",
              maxHeight:
                screenHeight -
                containerRef.current?.getBoundingClientRect().bottom -
                10,
              top:
                selectionListPos?.top ||
                containerRef.current?.getBoundingClientRect().bottom,
              left:
                selectionListPos?.left ||
                containerRef.current?.getBoundingClientRect().left,
              display: selectionListOpen ? "flex" : "none",
            }}
            selectedContacts={selectedContacts}
            onItemClick={handleSelectionChanged}
          />
        </StyledContainer>
        {helperText && (
          <FormHelperText
            sx={{
              ml: 2,
              color: (theme) =>
                error ? theme.palette.error.main : theme.palette.primary.main,
            }}
          >
            {helperText}
          </FormHelperText>
        )}
      </div>
    </ClickAwayListener>
  );
};

export default ContactSelection;

const StyledContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== "focused" || prop !== "error",
})<StyledContainerPropsType>(({ theme, focused, error }) => {
  let borderColor: string = "";
  let boxShadow: string = "";

  if (focused) {
    borderColor = theme.palette.primary.main;
    boxShadow = `${theme.palette.primary.main} 0 0 0 1px`;
  } else if (error) {
    borderColor = theme.palette.error.main;
    boxShadow = `${theme.palette.error.main} 0 0 0 1px`;
  } else {
    borderColor = theme.palette.grey[600];
    boxShadow = "none";
  }

  return {
    padding: "16px 14px",
    border: `1.5px solid ${borderColor}`,
    boxShadow: boxShadow,
    borderRadius: theme.shape.borderRadius,
    position: "relative",
    display: "flex",
    alignItems: "center",
    transition: "all .1s linear",
    "&:hover": {
      ...(!focused && {
        borderColor: theme.palette.grey[400],
      }),
    },
  };
});
