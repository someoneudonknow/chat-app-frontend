import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Conservation } from "../../../models/conservation.model";
import { MessagesUnion } from "../../../models/message.model";
import socket from "../../../services/SocketService";

type ChatRoomContextProviderPropsType = {
  children: ReactNode;
};

type ChatRoomState = {
  searchMessageShow: boolean;
  chatBarType: "regular" | "audio";
  conservation: Conservation | null;
  messagesList: MessagesUnion[];
  loading: boolean;
};

type ChatRoomContext = {
  showSearchMessageBox: () => void;
  hideSearchMessageBox: () => void;
  setChatBar: (chatBarType: "regular" | "audio") => void;
  setConservation: (c: Conservation) => void;
  setMessagesList: (messages: MessagesUnion[]) => void;
  setLoading: (loading: boolean) => void;
} & ChatRoomState;

const initState: ChatRoomContext = {
  searchMessageShow: false,
  conservation: null,
  chatBarType: "regular",
  messagesList: [],
  loading: false,
  showSearchMessageBox: () => {},
  hideSearchMessageBox: () => {},
  /* eslint-disable */
  setChatBar: (_: "regular" | "audio") => {},
  setConservation: (_: Conservation) => {},
  setMessagesList: (_: MessagesUnion[]) => {},
  setLoading: (_: boolean) => {},
  /* eslint-enable */
};

const chatRoomContext = createContext<ChatRoomContext>(initState);

enum EventName {
  NEW_MESSAGE = "messages/new",
  lEAVE_CONSERVATION = "conservation/leave",
  SETUP_CONSERVATION = "conservation/setup",
}

const ChatRoomContextProvider: React.FC<ChatRoomContextProviderPropsType> = ({
  children,
}) => {
  const [chatRoomState, setChatRoomState] = useState<ChatRoomState>({
    searchMessageShow: false,
    chatBarType: "regular",
    conservation: null,
    messagesList: [],
    loading: false,
  });

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
      socket.emit(
        EventName.lEAVE_CONSERVATION,
        chatRoomState.conservation?._id
      );
    };
  }, [chatRoomState.conservation]);

  const _state = useMemo(
    () => ({
      searchMessageShow: chatRoomState.searchMessageShow,
      conservation: chatRoomState.conservation,
      chatBarType: chatRoomState.chatBarType,
      messagesList: chatRoomState.messagesList,
      loading: chatRoomState.loading,
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
    }),
    [
      chatRoomState.chatBarType,
      chatRoomState.conservation,
      chatRoomState.searchMessageShow,
      chatRoomState.messagesList,
      chatRoomState.loading,
    ]
  );

  return (
    <chatRoomContext.Provider value={_state}>
      {children}
    </chatRoomContext.Provider>
  );
};

export const useChatRoom = () => useContext(chatRoomContext);

export default ChatRoomContextProvider;
