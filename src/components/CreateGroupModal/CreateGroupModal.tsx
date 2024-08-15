import React from "react";
import ConfirmDialog from "../ConfirmDialog";
import { DialogResult } from "../../constants/types";
import CreateGroupForm from "./CreateGroupForm";
import { useForm } from "react-hook-form";
import { Group } from "../../models/conservation.model";

type CreateGroupModalPropsType = {
  onCreate: (val: Partial<Group> & { members: string[] }) => Promise<void>;
  open: boolean;
  handleClose: () => void;
};

const CreateGroupModal: React.FC<CreateGroupModalPropsType> = ({
  onCreate,
  open,
  handleClose,
}) => {
  const useFormMethods = useForm();

  const handleDialogConfirm = (result: DialogResult) => {
    if (result === DialogResult.OK) {
      useFormMethods.handleSubmit(async (val) => {
        const newGroup: Partial<Group> & { members: string[] } = {
          groupName: val.groupNameInput,
          isPublished: val.groupAccessibility === "PUBLISH",
          description: val.groupDescriptions,
          members: val.members.map((m) => m._id),
        };

        await onCreate(newGroup);

        handleClose();
      })();
    } else if (result === DialogResult.CANCEL) {
      handleClose();
    }
  };

  return (
    <ConfirmDialog
      onConfirm={handleDialogConfirm}
      open={open}
      keepMounted={false}
      actions={[
        { label: "Cancel", resultType: DialogResult.CANCEL },
        {
          label: "Create",
          resultType: DialogResult.OK,
          ownProps: { variant: "contained" },
        },
      ]}
      bodyContent={<CreateGroupForm {...useFormMethods} />}
    />
  );
};

export default CreateGroupModal;
