import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  FileMessage,
  ImageMessage,
  MessagesUnion,
  MessageType,
  VideoMessage,
} from "../../../models/message.model";
import { AttachmentsSidebarTabNamesKey } from "../types";
import ImagesGallery from "../../ImagesGallery";
import { useChatRoom } from "./ChatRoomProvider";

type ChatRoomAttachmentsProviderProps = {
  children: ReactNode;
};

type ChatRoomAttachments = {
  [k in AttachmentsSidebarTabNamesKey]: {
    list: k extends "IMAGES"
      ? ImageMessage[]
      : k extends "VIDEOS"
      ? VideoMessage[]
      : FileMessage[];
    nextCursor: string | null;
    hasMore: boolean;
  };
};

type UpdateAttachmentsCb<T extends AttachmentsSidebarTabNamesKey> = (
  prevVal: ChatRoomAttachments[T]
) => ChatRoomAttachments[T];

type ChatRoomAttachmentsContextType = {
  attachments: ChatRoomAttachments;
  imagesGalleryShow: boolean;
  setImages: (
    params: UpdateAttachmentsCb<"IMAGES"> | ChatRoomAttachments["IMAGES"]
  ) => void;
  setVideos: (
    params: UpdateAttachmentsCb<"VIDEOS"> | ChatRoomAttachments["VIDEOS"]
  ) => void;
  setFiles: (
    params: UpdateAttachmentsCb<"FILES"> | ChatRoomAttachments["FILES"]
  ) => void;
  openImagesGallery: (imageIdIndex: MessagesUnion["_id"]) => void;
};

const initAttachments: ChatRoomAttachments = {
  IMAGES: {
    list: [],
    nextCursor: null,
    hasMore: true,
  },
  VIDEOS: {
    list: [],
    nextCursor: null,
    hasMore: true,
  },
  FILES: {
    list: [],
    nextCursor: null,
    hasMore: true,
  },
};

const initVal: ChatRoomAttachmentsContextType = {
  attachments: initAttachments,
  imagesGalleryShow: false,
  setImages: () => {},
  setVideos: () => {},
  setFiles: () => {},
  openImagesGallery: () => {},
};

const ChatRoomAttachmentsContext =
  createContext<ChatRoomAttachmentsContextType>(initVal);

const ChatRoomAttachmentsProvider: React.FC<
  ChatRoomAttachmentsProviderProps
> = ({ children }) => {
  const [attachments, setAttachments] =
    useState<ChatRoomAttachments>(initAttachments);
  const [imageIndex, setImageIndex] = useState<number>(0);
  const [imagesGalleryShow, setImagesGalleryShow] = useState<boolean>(false);
  const { messagesList } = useChatRoom();

  const setImages = useCallback(
    (params: UpdateAttachmentsCb<"IMAGES"> | ChatRoomAttachments["IMAGES"]) => {
      setAttachments((prev) => {
        let result = null;

        if (typeof params === "function") {
          result = params(prev.IMAGES);
        } else {
          result = params;
        }

        return { ...prev, IMAGES: result };
      });
    },
    []
  );

  const setVideos = useCallback(
    (params: UpdateAttachmentsCb<"VIDEOS"> | ChatRoomAttachments["VIDEOS"]) => {
      setAttachments((prev) => {
        let result = null;

        if (typeof params === "function") {
          result = params(prev.VIDEOS);
        } else {
          result = params;
        }

        return { ...prev, VIDEOS: result };
      });
    },
    []
  );

  const setFiles = useCallback(
    (params: UpdateAttachmentsCb<"FILES"> | ChatRoomAttachments["FILES"]) => {
      setAttachments((prev) => {
        let result = null;

        if (typeof params === "function") {
          result = params(prev.FILES);
        } else {
          result = params;
        }

        return { ...prev, FILES: result };
      });
    },
    []
  );

  const openImagesGallery = useCallback(
    (imageIdIndex: MessagesUnion["_id"]) => {
      setImageIndex(
        attachments["IMAGES"].list.findIndex((m) => m._id === imageIdIndex)
      );
      setImagesGalleryShow(true);
    },
    [attachments]
  );

  const filterAndSetAttachments = useCallback(
    <T extends keyof ChatRoomAttachments>(type: T) => {
      const messageTypeMapper: {
        [k in keyof ChatRoomAttachments]: MessageType;
      } = {
        IMAGES: MessageType.IMAGE,
        FILES: MessageType.FILE,
        VIDEOS: MessageType.VIDEO,
      } as const;

      return (prev: ChatRoomAttachments[typeof type]) => {
        const attachments = messagesList.filter(
          (message) =>
            message.type === messageTypeMapper[type] &&
            !prev.list.find((m) => m._id === message._id)
        );

        return {
          ...prev,
          list: [...prev.list, ...(attachments as typeof prev.list)].sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          ),
        };
      };
    },
    [messagesList]
  );

  useEffect(() => {
    if (messagesList.length > 0) {
      setImages(filterAndSetAttachments("IMAGES"));
      setFiles(filterAndSetAttachments("FILES"));
      setVideos(filterAndSetAttachments("VIDEOS"));
    }
  }, [filterAndSetAttachments, setImages, setFiles, setVideos, messagesList]);

  const _state = useMemo<ChatRoomAttachmentsContextType>(
    () => ({
      attachments,
      imagesGalleryShow,
      setVideos,
      setImages,
      setFiles,
      openImagesGallery,
    }),
    [
      attachments,
      setVideos,
      setImages,
      setFiles,
      openImagesGallery,
      imagesGalleryShow,
    ]
  );

  return (
    <ChatRoomAttachmentsContext.Provider value={_state}>
      <ImagesGallery
        onClose={() => setImagesGalleryShow(false)}
        index={imageIndex || 0}
        open={imagesGalleryShow}
        images={attachments["IMAGES"].list.map(
          (m) => (m as ImageMessage).content
        )}
      />
      {children}
    </ChatRoomAttachmentsContext.Provider>
  );
};

export const useChatRoomAttachments = () =>
  useContext(ChatRoomAttachmentsContext);

export default ChatRoomAttachmentsProvider;
