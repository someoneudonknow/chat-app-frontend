import { Message, MessagesUnion } from "./message.model";
import User from "./user.model";

export enum ConservationRole {
  MEMBER = "MEMBER",
  HOST = "HOST",
}

export enum ConservationType {
  GROUP = "GROUP",
  INBOX = "INBOX",
  DIRECT_MESSAGE = "DIRECT_MESSAGE",
}

export type LastMessage = Pick<
  MessagesUnion,
  "_id" | "content" | "type" | "sender"
>;

export type Group = {
  groupName: string;
  groupAvatar?: string;
  description?: string;
  memberLimit: number;
  isPublished: boolean;
  joinConditions?: any[];
};

export type Inbox = object;

export type ConservationMember = {
  user: User;
  nickname: string;
  role: ConservationRole;
};

export interface Conservation {
  _id: string;
  slug?: string;
  theme?: string;
  members: ConservationMember[] | string[];
  creator: string;
  specialMessages?: [string];
  isStarred: boolean;
  lastMessage?: LastMessage;
  conservationAttributes?: Group | Inbox;
  type: ConservationType;
  isCalling?: boolean;
}
