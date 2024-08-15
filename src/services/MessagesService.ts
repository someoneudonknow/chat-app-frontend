"use strict";

import {
  BASE_URL,
  MESSAGE,
  MESSAGES_IN_CONSERVATION,
} from "../constants/api-endpoints";
import {
  AudioMessage,
  FileMessage,
  GifMessage,
  ImageMessage,
  MessageType,
  MessagesUnion,
  TextMessage,
  VideoMessage,
} from "../models/message.model";
import BaseService from "./BaseService";
import { IGif } from "@giphy/js-types";
import getBlobDuration from "get-blob-duration";
import { getImageMeta } from "../utils";

class MessagesService extends BaseService {
  constructor(baseUrl: string) {
    super(baseUrl);
  }

  async sendFileMessage(
    file: File,
    uploadedFile: any,
    conservationId: string
  ): Promise<void> {
    return await this.sendMessage({
      type: MessageType.FILE,
      conservation: conservationId,
      content: {
        publicId: uploadedFile.publicId,
        mimeType: file.type,
        totalBytes: uploadedFile.bytes,
        originalName: file.name,
        downloadUrl: uploadedFile.secureUrl,
        additionalContents: {
          noSecureUrl: uploadedFile.url,
        },
      },
    } as unknown as FileMessage);
  }

  async sendVideoMessage(
    videoFile: File,
    uploadedVideo: any,
    conservationId: string
  ): Promise<void> {
    const videoBlob = URL.createObjectURL(videoFile);

    return await this.sendMessage({
      type: MessageType.VIDEO,
      conservation: conservationId,
      content: {
        publicId: uploadedVideo.publicId,
        totalBytes: uploadedVideo.bytes,
        url: uploadedVideo.secureUrl,
        originalVideo: {
          duration: await getBlobDuration(videoBlob),
          url: uploadedVideo.secureUrl,
        },
        additionalContents: {
          noSecureUrl: uploadedVideo.url,
        },
      },
    } as unknown as VideoMessage);
  }

  async sendImageMessage(
    imageFile: File,
    uploadedImage: any,
    conservationId: string
  ): Promise<void> {
    const imageMetadata = await getImageMeta(URL.createObjectURL(imageFile));

    return await this.sendMessage({
      type: MessageType.IMAGE,
      conservation: conservationId,
      content: {
        publicId: uploadedImage.publicId,
        totalBytes: uploadedImage.bytes,
        originalName: imageFile.name,
        url: uploadedImage.secureUrl,
        originalImage: {
          width: imageMetadata.width,
          height: imageMetadata.height,
          url: uploadedImage.secureUrl,
        },
        additionalContents: {
          noSecureUrl: uploadedImage.url,
        },
      },
    } as unknown as ImageMessage);
  }

  async sendAudioMessage(
    conservationId: string,
    blob: Blob,
    uploadedAudio: any
  ): Promise<void> {
    return await this.sendMessage({
      type: MessageType.AUDIO,
      conservation: conservationId,
      content: {
        duration: await getBlobDuration(blob),
        publicId: uploadedAudio.publicId,
        totalBytes: uploadedAudio.bytes,
        url: uploadedAudio.secureUrl,
        additionalContents: {
          noSecureUrl: uploadedAudio.url,
        },
      },
    } as AudioMessage);
  }

  async sendGifMessage(conservationId: string, gifData: IGif): Promise<void> {
    return await this.sendMessage({
      type: MessageType.GIF,
      conservation: conservationId,
      content: {
        images: gifData.images,
        type: gifData.type,
        altText: gifData.alt_text,
        giphyId: gifData.id,
        rating: gifData.rating,
      },
    } as GifMessage);
  }

  async sendTextMessage(conservationId: string, text: string): Promise<void> {
    return await this.sendMessage({
      type: MessageType.TEXT,
      conservation: conservationId,
      content: { text: text },
    } as TextMessage);
  }

  async sendMessage(message: MessagesUnion) {
    return await this.post(`${MESSAGE}`, {}, message);
  }

  async getMessagesInConservation(
    conservationId: string,
    limit: number,
    paginateOptions?: {
      nextCursor?: string;
      prevCursor?: string;
    }
  ) {
    if (paginateOptions && paginateOptions?.nextCursor) {
      return await this.get(
        `${MESSAGES_IN_CONSERVATION}/${conservationId}?${new URLSearchParams({
          nextCursor: paginateOptions.nextCursor,
          limit: String(limit),
        }).toString()}`
      );
    }

    if (paginateOptions && paginateOptions?.prevCursor) {
      return await this.get(
        `${MESSAGES_IN_CONSERVATION}/${conservationId}?${new URLSearchParams({
          prevCursor: paginateOptions.prevCursor,
          limit: String(limit),
        }).toString()}`
      );
    }

    return await this.get(
      `${MESSAGES_IN_CONSERVATION}/${conservationId}?limit=${String(limit)}`
    );
  }
}

export default MessagesService;
