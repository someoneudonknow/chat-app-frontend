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

export interface Conservation {
  _id: string;
  slug?: string;
  theme?: string;
  members: [{ user: User; nickname: string; role: ConservationRole }];
  creator: string;
  specialMessages?: [string];
  isStarred: boolean;
  lastMessage?: string;
  conservationAttributes?: any;
  type: ConservationType;
}
