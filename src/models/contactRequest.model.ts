import User from "./user.model";

export enum ContactRequestStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
}

export default interface ContactRequest {
  _id: string;
  sender: Partial<User> | string;
  receiver: Partial<User> | string;
  status: ContactRequestStatus;
  requestMessage: string;
}
