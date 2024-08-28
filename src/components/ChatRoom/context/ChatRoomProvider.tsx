import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Conservation,
  ConservationMember,
} from "../../../models/conservation.model";
import { MessagesUnion } from "../../../models/message.model";
import { useSocket } from "../../../hooks";
import { MessagesService } from "../../../services";
import { BASE_URL } from "../../../constants/api-endpoints";
import { AttachmentsSidebarTabNamesValues } from "../types";

type ChatRoomProviderPropsType = {
  children: ReactNode;
};

export type SidebarView =
  | {
      viewName: "primary";
      data?: any;
    }
  | {
      viewName: "attachments";
      data?: {
        tab?: AttachmentsSidebarTabNamesValues;
      };
    };

type ChatRoomState = {
  searchMessageShow: boolean;
  chatBarType: "regular" | "audio";
  conservation: Conservation | null;
  messagesList: MessagesUnion[];
  loading: boolean;
  typingMembers: string[];
  nextCursor: string | null;
  hasMoreMessages: boolean;
  sidebarView: SidebarView;
};

type ChatRoomContext = {
  showSearchMessageBox: () => void;
  hideSearchMessageBox: () => void;
  setChatBar: (chatBarType: "regular" | "audio") => void;
  setConservation: (c: Conservation) => void;
  setMessagesList: (messages: MessagesUnion[]) => void;
  setLoading: (loading: boolean) => void;
  fetchNextMessages: () => Promise<void>;
  setSidebarView: (view: SidebarView) => void;
} & ChatRoomState;

const initChatRoomState: ChatRoomState = {
  searchMessageShow: false,
  conservation: null,
  chatBarType: "regular",
  messagesList: [],
  typingMembers: [],
  loading: false,
  nextCursor: null,
  hasMoreMessages: true,
  sidebarView: {
    viewName: "primary",
  },
};

const initState: ChatRoomContext = {
  ...initChatRoomState,
  showSearchMessageBox: () => {},
  hideSearchMessageBox: () => {},
  setChatBar: () => {},
  setConservation: () => {},
  setMessagesList: () => {},
  setLoading: () => {},
  fetchNextMessages: async () => {},
  setSidebarView: () => {},
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

const ChatRoomProvider: React.FC<ChatRoomProviderPropsType> = ({
  children,
}) => {
  const [searchMessageBoxShow, setSearchMessageBoxShow] =
    useState<boolean>(false);
  const [conservation, setConservation] = useState<Conservation | null>(null);
  const [chatBarType, setChatBarType] = useState<"regular" | "audio">(
    "regular"
  );
  const [messagesList, setMessagesList] = useState<MessagesUnion[]>([]);
  const [typingMembers, setTypingMembers] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMoreMessages, setHasMoreMessages] = useState<boolean>(true);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [sidebarView, setSidebarView] = useState<SidebarView>({
    viewName: "primary",
  });
  const { socket } = useSocket();

  // use effect for socket event handler
  useEffect(() => {
    if (!conservation) return;

    socket?.on(EventName.NEW_MESSAGE, (message: MessagesUnion) => {
      setMessagesList((prev) => [message, ...prev]);
    });

    socket?.on(EventName.ONLINE_USER, (payload) => {
      setConservation((prev) => {
        if (prev) {
          const clonedConservation: Conservation = { ...prev };

          for (const m of clonedConservation?.members || []) {
            const currentMember = m as ConservationMember;

            if (currentMember && currentMember.user._id === payload) {
              currentMember.user.isOnline = true;
              break;
            }
          }

          return clonedConservation;
        }

        return prev;
      });
    });

    socket?.on(EventName.OFFLINE_USER, (payload) => {
      setConservation((prev) => {
        if (prev) {
          const clonedConservation: Conservation = { ...prev };

          for (const m of clonedConservation?.members || []) {
            const currentMember = m as ConservationMember;

            if (currentMember && currentMember.user._id === payload) {
              currentMember.user.isOnline = false;
              break;
            }
          }

          return clonedConservation;
        }

        return prev;
      });
    });

    socket?.on(EventName.TYPING, (memberId) => {
      setTypingMembers((prev) => [...prev, memberId]);
    });

    socket?.on(EventName.CANCEL_TYPING, (memberId) => {
      setTypingMembers((prev) => prev.filter((mid) => mid !== memberId));
    });

    socket?.emit(EventName.SETUP_CONSERVATION, conservation);

    return () => {
      socket?.off(EventName.NEW_MESSAGE);
      socket?.off(EventName.TYPING);
      socket?.off(EventName.CANCEL_TYPING);
      socket?.emit(EventName.lEAVE_CONSERVATION, conservation?._id);
    };
  }, [conservation, socket]);

  const fetchNextMessages = useCallback(async () => {
    if (!conservation) {
      setHasMoreMessages(false);
      return;
    }

    try {
      const messageService = new MessagesService(BASE_URL);
      let messagesResponse;

      if (nextCursor) {
        messagesResponse = await messageService.getMessagesInConservation(
          conservation?._id,
          20,
          { nextCursor: nextCursor }
        );
      } else {
        messagesResponse = await messageService.getMessagesInConservation(
          conservation?._id,
          20
        );
      }
      const hasNext = messagesResponse.metadata?.hasNext;

      setMessagesList((prev) => [
        ...prev,
        ...(messagesResponse?.metadata?.list || []),
      ]);
      setHasMoreMessages(hasNext);
      if (hasNext) {
        setNextCursor(messagesResponse.metadata?.next);
      }
    } catch (err) {
      console.error(err);
      setHasMoreMessages(false);
    }
  }, [nextCursor, conservation]);

  const _state = useMemo<ChatRoomContext>(
    () => ({
      chatBarType,
      messagesList,
      conservation,
      loading,
      searchMessageShow: searchMessageBoxShow,
      typingMembers,
      nextCursor,
      hasMoreMessages,
      sidebarView,
      setSidebarView: (view: SidebarView) => setSidebarView(view),
      setMessagesList: (messages: MessagesUnion[]) => setMessagesList(messages),
      hideSearchMessageBox: () => setSearchMessageBoxShow(false),
      showSearchMessageBox: () => setSearchMessageBoxShow(true),
      setConservation: (c: Conservation) => setConservation(c),
      setChatBar: (type: "regular" | "audio") => setChatBarType(type),
      setLoading: (loading: boolean) => setLoading(loading),
      fetchNextMessages,
    }),

    [
      nextCursor,
      hasMoreMessages,
      chatBarType,
      messagesList,
      conservation,
      loading,
      searchMessageBoxShow,
      typingMembers,
      sidebarView,
      fetchNextMessages,
    ]
  );

  return (
    <chatRoomContext.Provider value={_state}>
      {children}
    </chatRoomContext.Provider>
  );
};

export const useChatRoom = () => useContext(chatRoomContext);

export default ChatRoomProvider;
