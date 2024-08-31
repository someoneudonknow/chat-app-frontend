import { BASE_URL } from "../../../constants/api-endpoints";
import { RecognizableFile } from "../../../constants/types";
import {
  Conservation,
  ConservationMember,
} from "../../../models/conservation.model";
import { MessagesUnion, MessageType } from "../../../models/message.model";
import { MessagesService, UploadService } from "../../../services";
import { SubmitedMessageType } from "../types";
import { IGif } from "@giphy/js-types";

export const getTypingStateText = (
  typingMembers: string[],
  members: ConservationMember[]
): string => {
  if (typingMembers.length > 0) {
    const firstMember = members.find((m) => m.user._id === typingMembers[0]);
    const firstMemberName =
      firstMember?.nickname ??
      firstMember?.user.userName ??
      firstMember?.user.email;

    if (typingMembers.length > 1) {
      return `${firstMemberName} and ${
        typingMembers.length - 1
      } others is tying`;
    } else {
      return `${firstMemberName} is tying`;
    }
  }

  return "";
};

export const sendMessage = async (
  data: SubmitedMessageType,
  conservationId: Conservation["_id"]
) => {
  const messageService = new MessagesService(BASE_URL);

  switch (data.type) {
    case MessageType.TEXT:
      await messageService.sendTextMessage(
        conservationId,
        data.content as string
      );

      break;
    case MessageType.GIF: {
      await messageService.sendGifMessage(conservationId, data.content as IGif);
      break;
    }
    case MessageType.AUDIO: {
      const uploadService = new UploadService(BASE_URL);
      const uploadedAudio = await uploadService.uploadOneWithFileData(
        data.content as Blob
      );

      await messageService.sendAudioMessage(
        conservationId,
        data.content as Blob,
        uploadedAudio.metadata.content
      );
      break;
    }
    case MessageType.FILE: {
      const selectedFiles = data.content as (RecognizableFile & {
        upload: any;
      })[];

      if (selectedFiles && selectedFiles.length > 0) {
        await Promise.all(
          selectedFiles.map(async (file) => {
            const uploaded = file.upload.content;

            if (file.type.startsWith("image")) {
              await messageService.sendImageMessage(
                file,
                uploaded,
                conservationId
              );
            } else if (file.type.startsWith("video")) {
              await messageService.sendVideoMessage(
                file,
                uploaded,
                conservationId
              );
            } else if (file.type.startsWith("audio")) {
              await messageService.sendAudioMessage(
                conservationId,
                file,
                uploaded
              );
            } else {
              await messageService.sendFileMessage(
                file,
                uploaded,
                conservationId
              );
            }
          })
        );
      }
      break;
    }
    default:
      return;
  }
};
