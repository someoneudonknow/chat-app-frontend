import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Conservation,
  ConservationMember,
} from "../../../models/conservation.model";
import {
  ImageMessage,
  MessageType,
  MessagesUnion,
} from "../../../models/message.model";
import ImagesGallery from "../../ImagesGallery/ImagesGallery";
import { useSocket } from "../../../hooks";

type ChatRoomContextProviderPropsType = {
  children: ReactNode;
};

type ChatRoomState = {
  searchMessageShow: boolean;
  chatBarType: "regular" | "audio";
  conservation: Conservation | null;
  messagesList: MessagesUnion[];
  loading: boolean;
  imagesGalleryShow: boolean;
  typingMembers: string[];
};

type ChatRoomContext = {
  showSearchMessageBox: () => void;
  hideSearchMessageBox: () => void;
  setChatBar: (chatBarType: "regular" | "audio") => void;
  setConservation: (c: Conservation) => void;
  setMessagesList: (messages: MessagesUnion[]) => void;
  setLoading: (loading: boolean) => void;
  openImagesGallery: (imageIdIndex: MessagesUnion["_id"]) => void;
} & ChatRoomState;

const initChatRoomState: ChatRoomState = {
  searchMessageShow: false,
  imagesGalleryShow: false,
  conservation: null,
  chatBarType: "regular",
  messagesList: [],
  typingMembers: [],
  loading: false,
};

const initState: ChatRoomContext = {
  ...initChatRoomState,
  showSearchMessageBox: () => {},
  hideSearchMessageBox: () => {},
  setChatBar: () => {},
  setConservation: () => {},
  setMessagesList: () => {},
  setLoading: () => {},
  openImagesGallery: () => {},
};

const chatRoomContext = createContext<ChatRoomContext>(initState);

enum EventName {
  NEW_MESSAGE = "messages/new",
  TYPING = "conservation/typing",
  lEAVE_CONSERVATION = "conservation/leave",
  SETUP_CONSERVATION = "conservation/setup",
  CANCEL_TYPING = "conservation/cancel-typing",
  ONLINE_USER = "users/online-user",
  OFFLINE_USER = "users/offline-user",
}

const ChatRoomContextProvider: React.FC<ChatRoomContextProviderPropsType> = ({
  children,
}) => {
  const [chatRoomState, setChatRoomState] =
    useState<ChatRoomState>(initChatRoomState);
  const [imageMessages, setImageMessages] = useState<ImageMessage[]>([]);
  const [imageIndex, setImageIndex] = useState<number | null>(0);
  const { socket } = useSocket();

  useEffect(() => {
    if (chatRoomState?.messagesList.length > 0) {
      const images = chatRoomState.messagesList.filter(
        (message) =>
          message.type === MessageType.IMAGE &&
          !imageMessages.find((m) => m._id === message._id)
      );

      setImageMessages((prev) => {
        const newImagesList = [...prev, ...(images as ImageMessage[])];

        newImagesList.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        return newImagesList;
      });
    }

    // eslint-disable-next-line
  }, [chatRoomState.messagesList]);

  // use effect for socket event handler
  useEffect(() => {
    if (!chatRoomState.conservation) return;

    socket?.on(EventName.NEW_MESSAGE, (message: MessagesUnion) => {
      setChatRoomState((prev) => ({
        ...prev,
        messagesList: [message, ...prev.messagesList],
      }));
    });

    socket?.on(EventName.ONLINE_USER, (payload) => {
      setChatRoomState((prev) => {
        if (prev.conservation) {
          const clonedConservation: Conservation = { ...prev.conservation };

          for (const m of clonedConservation?.members || []) {
            const currentMember = m as ConservationMember;

            if (currentMember && currentMember.user._id === payload) {
              currentMember.user.isOnline = true;
              break;
            }
          }

          return {
            ...prev,
            conservation: clonedConservation,
          };
        }

        return prev;
      });
    });

    socket?.on(EventName.OFFLINE_USER, (payload) => {
      setChatRoomState((prev) => {
        if (prev.conservation) {
          const clonedConservation: Conservation = { ...prev.conservation };

          for (const m of clonedConservation?.members || []) {
            const currentMember = m as ConservationMember;

            if (currentMember && currentMember.user._id === payload) {
              currentMember.user.isOnline = false;
              break;
            }
          }

          return {
            ...prev,
            conservation: clonedConservation,
          };
        }

        return prev;
      });
    });

    socket?.on(EventName.TYPING, (memberId) => {
      setChatRoomState((prev) => ({
        ...prev,
        typingMembers: [...prev.typingMembers, memberId],
      }));
    });

    socket?.on(EventName.CANCEL_TYPING, (memberId) => {
      setChatRoomState((prev) => ({
        ...prev,
        typingMembers: prev.typingMembers.filter((mid) => mid !== memberId),
      }));
    });

    socket?.emit(EventName.SETUP_CONSERVATION, chatRoomState.conservation);

    return () => {
      socket?.off(EventName.NEW_MESSAGE);
      socket?.off(EventName.TYPING);
      socket?.off(EventName.CANCEL_TYPING);
      socket?.emit(
        EventName.lEAVE_CONSERVATION,
        chatRoomState.conservation?._id
      );
    };
  }, [chatRoomState.conservation, socket]);

  const _state = useMemo(
    () => ({
      ...chatRoomState,
      setMessagesList: (messages: MessagesUnion[]) => {
        setChatRoomState((prev) => ({ ...prev, messagesList: messages }));
      },
      hideSearchMessageBox: () => {
        setChatRoomState((prev) => ({ ...prev, searchMessageShow: false }));
      },
      showSearchMessageBox: () => {
        setChatRoomState((prev) => ({ ...prev, searchMessageShow: true }));
      },
      setConservation: (c: Conservation) => {
        setChatRoomState((prev) => ({ ...prev, conservation: c }));
      },
      setChatBar: (type: "regular" | "audio") => {
        setChatRoomState((prev) => ({ ...prev, chatBarType: type }));
      },
      setLoading: (loading: boolean) => {
        setChatRoomState((prev) => ({ ...prev, loading: loading }));
      },
      openImagesGallery: (imageIdIndex: MessagesUnion["_id"]) => {
        setImageIndex(imageMessages.findIndex((m) => m._id === imageIdIndex));
        setChatRoomState((prev) => ({ ...prev, imagesGalleryShow: true }));
      },
    }),
    //eslint-disable-next-line
    [
      chatRoomState.chatBarType,
      chatRoomState.messagesList,
      chatRoomState.conservation,
      chatRoomState.imagesGalleryShow,
      chatRoomState.loading,
      chatRoomState.searchMessageShow,
      chatRoomState.typingMembers,
      imageMessages,
    ]
  );

  return (
    <chatRoomContext.Provider value={_state}>
      {children}
      <ImagesGallery
        onClose={() =>
          setChatRoomState((prev) => ({ ...prev, imagesGalleryShow: false }))
        }
        index={imageIndex || 0}
        open={chatRoomState.imagesGalleryShow}
        images={imageMessages.map((m) => m.content.originalImage.url)}
      />
    </chatRoomContext.Provider>
  );
};

export const useChatRoom = () => useContext(chatRoomContext);

export default ChatRoomContextProvider;
