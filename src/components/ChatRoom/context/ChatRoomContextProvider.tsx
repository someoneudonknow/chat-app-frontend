import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Conservation } from "../../../models/conservation.model";
import {
  ImageMessage,
  MessageType,
  MessagesUnion,
} from "../../../models/message.model";
import socket from "../../../services/SocketService";
import ImagesGallery from "../../ImagesGallery/ImagesGallery";

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
  TYPING = "messages/typing",
  lEAVE_CONSERVATION = "conservation/leave",
  SETUP_CONSERVATION = "conservation/setup",
}

const ChatRoomContextProvider: React.FC<ChatRoomContextProviderPropsType> = ({
  children,
}) => {
  const [chatRoomState, setChatRoomState] =
    useState<ChatRoomState>(initChatRoomState);
  const [imageMessages, setImageMessages] = useState<ImageMessage[]>([]);
  const [imageIndex, setImageIndex] = useState<number | null>(0);

  useEffect(() => {
    if (chatRoomState?.messagesList.length > 0) {
      const images = chatRoomState.messagesList.filter(
        (message) =>
          message.type === MessageType.IMAGE &&
          !imageMessages.find((m) => m._id === message._id)
      );
      setImageMessages(images as ImageMessage[]);
    }

    // eslint-disable-next-line
  }, [chatRoomState.messagesList]);

  useEffect(() => {
    if (!chatRoomState.conservation) return;

    socket.on(EventName.NEW_MESSAGE, (message: MessagesUnion) => {
      setChatRoomState((prev) => ({
        ...prev,
        messagesList: [message, ...prev.messagesList],
      }));
    });

    socket.emit(EventName.SETUP_CONSERVATION, chatRoomState.conservation);

    return () => {
      socket.off(EventName.NEW_MESSAGE);
      socket.off(EventName.TYPING);
      socket.emit(
        EventName.lEAVE_CONSERVATION,
        chatRoomState.conservation?._id
      );
    };
  }, [chatRoomState.conservation]);

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
        setChatRoomState((prev) => ({ ...prev, imagesGalleryShow: true }));
        console.log({
          i: imageMessages.findIndex((m) => m._id === imageIdIndex),
        });
        setImageIndex(imageMessages.findIndex((m) => m._id === imageIdIndex));
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
      imageMessages,
    ]
  );

  console.log("chat room ctx re-render");

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
