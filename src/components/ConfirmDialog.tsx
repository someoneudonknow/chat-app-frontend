import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  SxProps,
} from "@mui/material";
import PortalWrapper from "./PortalWrapper";
import React, { ReactNode } from "react";
import { DialogAction, DialogResult } from "../constants/types";
import { SlideIn } from "./Transitions";

type ConfirmDialogPropsType = {
  transitionComponent?: typeof SlideIn;
  onConfirm: (result: DialogResult) => void;
  title?: string | ReactNode;
  bodyContent?: string | ReactNode;
  actions: DialogAction[];
  open: boolean;
  sx?: SxProps;
};

const ConfirmDialog: React.FC<ConfirmDialogPropsType> = ({
  transitionComponent,
  onConfirm,
  title,
  bodyContent,
  actions,
  open,
  sx,
}) => {
  const handleActionItemClick = (resultType: DialogResult) => {
    onConfirm(resultType);
  };

  return (
    <PortalWrapper>
      <Dialog
        sx={sx}
        open={open}
        TransitionComponent={transitionComponent || SlideIn}
      >
        <DialogTitle>{title || ""}</DialogTitle>
        {bodyContent && (
          <DialogContent>
            {typeof bodyContent === "string" ? (
              <DialogContentText>{bodyContent}</DialogContentText>
            ) : (
              bodyContent
            )}
          </DialogContent>
        )}
        <DialogActions>
          {actions.map((act, i) => (
            <Button
              key={i}
              onClick={(e) => {
                e.stopPropagation();
                handleActionItemClick(act.resultType);
              }}
              sx={{ ...act?.sx }}
              {...act.ownProps}
            >
              {act.label}
            </Button>
          ))}
        </DialogActions>
      </Dialog>
    </PortalWrapper>
  );
};

export default ConfirmDialog;
