import { ButtonProps, SxProps } from "@mui/material";
import { ConservationType } from "../../models/conservation.model";

export enum LeftSideBarItemName {
  ALL_CONSERVATIONS = "all-conservation",
  EVERYONE = "everyone",
  WAITING_CONSERVATIONS = "waiting-conservations",
  MY_CONTACTS = "my-contacts",
  PENDING_CONTACT_REQUESTS = "pending-contact-requests",
}

export enum CropType {
  RECTANGLE,
  CIRCLE,
}

export enum UserStatus {
  BANNED = "BANNED",
  ACTIVE = "ACTIVE",
}

export enum LoginMethod {
  FACEBOOK = "FACEBOOK",
  GOOGLE = "GOOGLE",
  EMAIL_PASSWORD = "EMAIL_PASSWORD",
}

export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
}

export enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH",
  DELETE = "DELETE",
  HEAD = "HEAD",
}

export enum DialogResult {
  OK,
  CANCEL,
  DISAGREE,
}

export type DialogAction = {
  label: string;
  resultType: DialogResult;
  sx?: SxProps;
  ownProps?: ButtonProps;
};

export type SignInType = {
  email: string;
  password: string;
};

export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  NON_BINARY = "NON_BINARY",
  GENDERQUEER = "GENDERQUEER",
  UNKNOWN = "UNKNOWN",
}

export type ConservationItemType = {
  _id: string;
  type: ConservationType;
  creator: string;
  name: string;
  lastMessage?: string;
  cover?: string | (string | null)[] | null;
};

// giphy types

export type GiphyImageMetadata = {
  url: string;
  width: string;
  height: string;
  size?: string;
  mp4?: string;
  mp4_size?: string;
  webp?: string;
  webp_size?: string;
};

export type GiphyImages = {
  fixed_height: GiphyImageMetadata;
  fixed_height_still: GiphyImageMetadata;
  fixed_height_downsampled: GiphyImageMetadata;
  fixed_width: GiphyImageMetadata;
  fixed_width_still: GiphyImageMetadata;
  fixed_width_downsampled: GiphyImageMetadata;
  original: GiphyImageMetadata & {
    frames: string;
  };
  original_still: GiphyImageMetadata;
};

export type GiphySubCategory = {
  name: string;
  name_encoded: string;
};

export type GiphyUser = {
  avatar_url?: string;
  banner_url?: string;
  profile_url?: string;
  username?: string;
  display_name?: string;
};

export type GiphyGif = {
  type: string;
  id: string;
  slug?: string;
  url?: string;
  bitly_url?: string;
  embed_url?: string;
  username?: string;
  source?: string;
  rating?: string;
  content_url?: string;
  user?: GiphyUser;
  source_tld?: string;
  source_post_url?: string;
  update_datetime?: string;
  create_datetime?: string;
  import_datetime?: string;
  trending_datetime?: string;
  images?: GiphyImages;
  title?: string;
  alt_text?: string;
};

export type GiphyCategory = {
  name?: string;
  name_encoded?: string;
  subcategories?: GiphySubCategory[];
  gif: GiphyGif;
};

export type RecognizableFile = {
  id: string;
} & File;
