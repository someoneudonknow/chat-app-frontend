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

export interface Conservation {
  _id: string;
  slug?: string;
  theme?: string;
  members: [{ user: User; nickname: string; role: ConservationRole }];
  creator: string;
  specialMessages?: [string];
  isStarred: boolean;
  lastMessage?: LastMessage;
  conservationAttributes?: any;
  type: ConservationType;
}
