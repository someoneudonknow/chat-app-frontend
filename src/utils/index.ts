"use strict";

import moment from "moment";
import { Crop } from "react-image-crop";
import { ConservationItemType, Gender } from "../constants/types";
import {
  Conservation,
  ConservationRole,
  ConservationType,
} from "../models/conservation.model";
import {
  MessageType,
  MessagesUnion,
  TextMessage,
} from "../models/message.model";

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

const getLastMessage = (
  conservation: Conservation,
  currentUserId: string
): string => {
  let lastMessage = "Haven't had any messages yet.";

  switch (conservation.lastMessage?.type) {
    case MessageType.TEXT:
      lastMessage = (conservation.lastMessage as TextMessage).content.text;
      break;
    case MessageType.AUDIO:
      lastMessage = "Sent an audio";
      break;
    case MessageType.IMAGE:
      lastMessage = "Sent an image";
      break;
    case MessageType.GIF:
      lastMessage = "Sent an Gif";
      break;
    case MessageType.FILE:
      lastMessage = "Sent a file";
      break;
    case MessageType.VIDEO:
      lastMessage = "Sent a video";
      break;
    default:
      lastMessage = "Haven't had any messages yet.";
      break;
  }

  if (
    conservation.lastMessage &&
    conservation.lastMessage.sender === currentUserId
  ) {
    lastMessage = "You: " + lastMessage;
  }

  return lastMessage;
};

export const getConservationItemInfo = (
  conservation: Conservation,
  currentUserId: string
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
      lastMessage: getLastMessage(conservation, currentUserId),
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
      lastMessage: getLastMessage(conservation, currentUserId),
    };
  }

  return null;
};

export const splitArrayData = <T>(arr: T[], columns: number): T[][] => {
  const total = arr.length;
  const nummberOfItemsEachColumn = Math.ceil(total / columns);
  let i = 1;
  const result: T[][] = new Array(columns).fill(undefined).map(() => []);

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

export const getImageMeta = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = url;
  });
};

export const mapPercentage = (
  fromValue: number,
  fromMin: number,
  fromMax: number,
  toMin: number,
  toMax: number
): number => {
  // Calculate the percentage of the from value
  const fromPercentage = (fromValue - fromMin) / (fromMax - fromMin);

  // Calculate the new value based on the percentage and the to min/max
  const toValue = toMin + (toMax - toMin) * fromPercentage;

  return toValue;
};

export const getUserStream = async (
  options: MediaStreamConstraints
): Promise<MediaStream> => {
  if (navigator.mediaDevices && "getUserMedia" in navigator.mediaDevices) {
    return await navigator.mediaDevices.getUserMedia(options);
  } else {
    throw new Error("Media stream not supported");
  }
};

export const closeStream = (stream: MediaStream) => {
  stream.getTracks().forEach((track) => track.stop());
};

export const createAudioBlobUrl = (chunks: Blob[]): string => {
  const blob: Blob = new Blob(chunks, {
    type: "audio/ogg; codecs=opus",
  });

  const srcUrl: string = window.URL.createObjectURL(blob);

  return srcUrl;
};

export const getFrequencyDataFromBlob = (src: string) => {
  const audioContext = new AudioContext();
  const mediaSrc = audioContext.createMediaElementSource(new Audio(src));

  const analyzer = audioContext.createAnalyser();
  analyzer.fftSize = 2048;
  mediaSrc.connect(analyzer);
  analyzer.connect(audioContext.destination);

  const frequencyData = new Uint8Array(analyzer.frequencyBinCount);
  analyzer.getByteFrequencyData(frequencyData);

  return frequencyData;
};

export const formatSeconds = (second: number): string => {
  const min: number = Math.floor(second / 60);
  const remainingSecond = Math.floor(second % 60);

  const formatedSecond =
    remainingSecond <= 9 ? `0${remainingSecond}` : `${remainingSecond}`;

  return `${min}:${formatedSecond}`;
};

export const formatFileSize = (fileSize: number): string => {
  const kb = 1024;
  const mb = kb * 1024;
  const gb = mb * 1024;
  const tb = gb * 1024;

  if (fileSize < kb) return `${fileSize} b`;
  if (fileSize > kb && fileSize < mb) return `${(fileSize / kb).toFixed(2)} Kb`;
  if (fileSize > mb && fileSize < gb) return `${(fileSize / mb).toFixed(2)} MB`;
  if (fileSize > gb && fileSize < tb) return `${(fileSize / gb).toFixed(2)} GB`;
  if (fileSize > tb) return `${(fileSize / tb).toFixed(2)} TB`;

  return `${0}`;
};

export const isFileEquals = async (
  file1: File,
  file2: File
): Promise<boolean> => {
  if (file1.size !== file2.size) return false;
  if (file1.type !== file2.type) return false;

  const fileOneBuffer = await file1.arrayBuffer();
  const fileSecondBuffer = await file2.arrayBuffer();

  if (fileOneBuffer.byteLength !== fileSecondBuffer.byteLength) return false;

  const unit8ArrFile1 = new Uint8Array(fileOneBuffer);
  const unit8ArrFile2 = new Uint8Array(fileSecondBuffer);

  let isFileEqual = true;

  for (let i = 0, len = unit8ArrFile1.length; i < len; i++) {
    if (unit8ArrFile1[i] !== unit8ArrFile2[i]) {
      isFileEqual = false;
      break;
    }
  }

  return isFileEqual;
};

export const asyncSome = async <T>(
  arr: Array<T>,
  predicate: (e: T, index: number, originalArray: Array<T>) => Promise<boolean>
) => {
  for (let i = 0; i < arr.length; i++) {
    if (await predicate(arr[i], i, arr)) return true;
  }

  return false;
};

export const asyncFilter = async <T>(
  arr: Array<T>,
  predicate: (e: T, index: number, originalArray: Array<T>) => Promise<boolean>
): Promise<Array<T>> => {
  const fail = Symbol();

  const filteredResult = (
    await Promise.all(
      arr.map(async (currEl, i, arr) =>
        (await predicate(currEl, i, arr)) ? currEl : fail
      )
    )
  ).filter((r) => r !== fail) as Array<T>;

  return filteredResult;
};

export const formatMessageDate = (date: Date) => {
  const now = moment(date);
  const time =
    now.hour() +
    ":" +
    (now.minutes() <= 9 ? `0${now.minutes()}` : now.minutes());

  return time + (now.hour() >= 12 ? " PM" : " AM");
};

export const groupBy = <T>(
  files: T[],
  cb: (currentItem: T) => string | number | symbol
): { [k: ReturnType<typeof cb>]: T[] } => {
  const grouped = new Map<ReturnType<typeof cb>, T[]>();

  files.forEach((item) => {
    const key = cb(item);

    if (grouped.has(key)) {
      grouped.get(key)?.push(item);
    } else {
      grouped.set(key, [item]);
    }
  });

  return Object.fromEntries(grouped);
};

export const filesGrouper = (
  files: File[]
): Partial<{ image: File[]; audio: File[]; video: File[]; file: File[] }> => {
  const grouped = new Map<string, File[]>();

  files.forEach((file) => {
    if (file.type.startsWith("image")) {
      if (!grouped.has("image")) {
        grouped.set("image", [file]);
      } else {
        grouped.get("image")?.push(file);
      }
    } else if (file.type.startsWith("audio")) {
      if (!grouped.has("audio")) {
        grouped.set("audio", [file]);
      } else {
        grouped.get("audio")?.push(file);
      }
    } else if (file.type.startsWith("video")) {
      if (!grouped.has("video")) {
        grouped.set("video", [file]);
      } else {
        grouped.get("video")?.push(file);
      }
    } else {
      if (!grouped.has("file")) {
        grouped.set("file", [file]);
      } else {
        grouped.get("file")?.push(file);
      }
    }
  });

  return Object.fromEntries(grouped);
};

export const downloadFile = async (url: string, fileName: string) => {
  const fetchRes = await fetch(url);
  const blob = await fetchRes.blob();

  const downloadUrl = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.style.display = "none";
  a.href = downloadUrl;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
};

export const getWeekdayString = (dayNum: number): string => {
  const weekdays: { [k: number]: string } = {
    1: "Monday",
    2: "Tuesday",
    3: "Wednesday",
    4: "Thursday",
    5: "Friday",
    6: "Saturday",
    0: "Sunday",
  };

  return weekdays[dayNum];
};

export const groupByTimeDuration = <T>(
  data: T[],
  timeKey: keyof T,
  durationInMinutes: number,
  getKeyName: (data: Date) => string
) => {
  if (data.length === 0) return {};

  const result: { [key: string]: T[] } = {};

  for (const item of data) {
    const date = new Date(item[timeKey] as string);
    const roundedDate = new Date(
      Math.floor(date.getTime() / (durationInMinutes * 60 * 1000)) *
        (durationInMinutes * 60 * 1000)
    );
    const key = getKeyName(roundedDate);

    if (!result[key]) {
      result[key] = [];
    }

    result[key].push(item);
  }

  return result;
};
