import { UserContact } from "../../../models/user.model";

export const getUserContactName = (contact: UserContact): string => {
  return contact.userName || contact.email;
};
