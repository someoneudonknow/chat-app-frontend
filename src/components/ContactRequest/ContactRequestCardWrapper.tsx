import { Paper, PaperProps } from "@mui/material";
import React, { ReactNode } from "react";

type ContactRequestCardWrapperPropsType = {
  children: ReactNode;
  gap?: string;
} & PaperProps;

const ContactRequestCardWrapper: React.FC<
  ContactRequestCardWrapperPropsType
> = ({ children, gap = 0, ...rest }) => {
  return (
    <Paper
      component="div"
      sx={{
        p: 2,
        display: "flex",
        flexDirection: "column",
        borderRadius: 3,
        overflow: "hidden",
        width: {
          md: `calc(25% - ${gap})`,
          lg: `calc(20% - ${gap})`,
          sm: `calc(33.3333% - ${gap})`,
          xs: `calc(100% - ${gap})`,
        },
        gap: 1,
        "&:hover": {
          cursor: "pointer",
        },
      }}
      {...rest}
    >
      {children}
    </Paper>
  );
};

export default ContactRequestCardWrapper;
