import { UserRole, UserStatus } from "../constants/types";
import Industry from "./industry.model";
import Interest from "./interest.model";

export type UserContact = Pick<
  User,
  | "_id"
  | "background"
  | "photo"
  | "country"
  | "interests"
  | "isOnline"
  | "email"
  | "birthday"
  | "gender"
  | "userName"
  | "industry"
>;

export default interface User {
  _id: string;
  userName?: string;
  birthday?: Date;
  photo?: string;
  email: string;
  status: UserStatus;
  contactList: [string];
  blockedList: [string];
  joinedConservations: [string];
  isOnline: boolean;
  role: UserRole;
  lastOnlineAt?: Date;
  interests?: [Interest];
  country?: {
    countryName: string;
    countryCode: string;
  };
  gender?: string;
  lastCompletedUserProfileStep: number;
  industry?: Industry | string;
  description?: string;
  background?: string;
  isCalling?: boolean;
}
