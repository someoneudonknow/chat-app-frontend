import { Paper } from "@mui/material";
import React, { ReactNode } from "react";

type ListWrapperPropsType = {
  children: ReactNode;
};

const ListWrapper: React.FC<ListWrapperPropsType> = ({ children }) => {
  return (
    <Paper
      sx={{
        height: "100%",
        width: "22%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {children}
    </Paper>
  );
};

export default ListWrapper;
