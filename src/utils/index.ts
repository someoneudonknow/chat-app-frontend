"use strict";

import moment from "moment";
import { Crop } from "react-image-crop";
import {
  ConservationItem,
  ConservationItemType,
  Gender,
} from "../constants/types";
import {
  Conservation,
  ConservationRole,
  ConservationType,
} from "../models/conservation.model";

export const parseJWT = (jwt: string) => {
  return JSON.parse(window.atob(jwt.split(".")[1]));
};

export const throttle = <Type extends any[]>(fn: Function, delay: number) => {
  let timerId: number | null = null;

  return (...args: Type) => {
    if (!timerId) {
      fn(...args);

      timerId = setTimeout(() => {
        timerId = null;
      }, delay);
    }
  };
};

export const debounce = <Type extends any[]>(fn: Function, delay: number) => {
  let timerId: number | null = null;

  return (...args: Type) => {
    if (timerId) {
      clearTimeout(timerId);
    }

    timerId = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};

export const convertImageToCanvas = (
  image: HTMLImageElement,
  crop: Crop
): string | null => {
  if (image) {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = Math.ceil(crop.width * scaleX);
    canvas.height = Math.ceil(crop.height * scaleY);
    const ctx = canvas.getContext("2d");

    if (ctx) {
      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width * scaleX,
        crop.height * scaleY
      );
      const croppedImage = canvas.toDataURL("image/*", 1);

      return croppedImage;
    }
  }

  return null;
};

export const removeDuplicatedWith = <D>(
  array: Array<D>,
  comparator: (a: D, b: D) => boolean
) => {
  return array.filter(
    (val, i, self) => i === self.findIndex((t) => comparator(t, val))
  );
};

export const formatNumber = (number: number): string => {
  const bil = 1e9;
  const mil = 1e6;
  const thou = 1e3;

  if (number >= bil) return number / bil + "B";
  else if (number >= mil) return number / mil + "M";
  else if (number >= thou) return number / thou + "K";
  else return number.toString();
};

export const calculateAge = (birthday: Date) => {
  return moment().diff(birthday, "years");
};

export const convertBase64ToBlob = (base64: string) => {
  const splitDataURI = base64.split(",");
  const byteString =
    splitDataURI[0].indexOf("base64") >= 0
      ? atob(splitDataURI[1])
      : decodeURI(splitDataURI[1]);
  const mimeString = splitDataURI[0].split(":")[1].split(";")[0];

  const ia = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);

  return new Blob([ia], { type: mimeString });
};

export const removeDublicatedKeys = (
  destination: { [k: string]: any },
  comparer: { [k: string]: any }
) => {
  for (const key in destination) {
    if (typeof destination[key] === "object" && comparer[key]) {
      removeDublicatedKeys(destination[key], comparer[key]);

      if (
        Object.keys(destination[key]).length === 0 &&
        destination[key].constructor === Object
      ) {
        delete destination[key];
      }
    }

    if (comparer[key] && comparer[key] === destination[key]) {
      delete destination[key];
    }
  }
};

export const getGender = (gender?: Gender) => {
  switch (gender) {
    case Gender.MALE:
      return "Male";
    case Gender.FEMALE:
      return "Female";
    case Gender.NON_BINARY:
      return "Non binary";
    case Gender.GENDERQUEER:
      return "Genderqueer";
    case Gender.UNKNOWN:
      return "Unknown";
    default:
      return "Unknown";
  }
};

export const getConservationItemInfo = (
  conservation: Conservation,
  currentUserId?: string
): ConservationItemType | null => {
  if (conservation.type === ConservationType.INBOX) {
    const member = conservation.members.find(
      (member) => member.user._id !== currentUserId
    );
    const memberUserInfo = member?.user;

    if (!member)
      throw new Error("It's seem like a conservation has only one member");

    return {
      _id: conservation._id,
      type: conservation.type,
      creator: conservation.creator,
      cover: memberUserInfo?.photo || null,
      name:
        memberUserInfo?.userName ||
        memberUserInfo?.email ||
        "Haven't provided any name",
      lastMessage: conservation.lastMessage || "Haven't had any messages yet.",
    };
  } else if (conservation.type === ConservationType.GROUP) {
    const covers = conservation.members.map((m) => m.user?.photo || null);
    const creator = conservation.members.find(
      (m) => m.role === ConservationRole.HOST
    );
    const name =
      conservation?.conservationAttributes?.groupName ||
      creator?.user?.userName ||
      creator?.user?.email;

    return {
      _id: conservation._id,
      type: conservation.type,
      creator: conservation.creator,
      cover: covers,
      name: `${name}'s group`,
      lastMessage: conservation.lastMessage || "Haven't had any messages yet.",
    };
  }

  return null;
};

export const splitArrayData = <T>(arr: T[], columns: number): T[][] => {
  const total = arr.length;
  const nummberOfItemsEachColumn = Math.ceil(total / columns);
  let i = 1;
  const result: T[][] = new Array(columns).fill(undefined).map((_) => []);

  while (i <= columns) {
    const startPos = (i - 1) * nummberOfItemsEachColumn;
    const endPos =
      nummberOfItemsEachColumn + nummberOfItemsEachColumn * (i - 1);

    for (let j = startPos; j < endPos; j++) {
      if (j >= total) break;
      result[i - 1].push(arr[j]);
    }
    i++;
  }

  return result;
};
