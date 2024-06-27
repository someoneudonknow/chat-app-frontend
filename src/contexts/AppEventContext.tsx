import { ReactNode, createContext, useContext, useMemo, useState } from "react";
import { Conservation } from "../models/conservation.model";

type ConservationItemMetadata = {
  hasUnreadMessage: boolean;
  lastMessage: string;
  id: Conservation["_id"];
  isActive: boolean;
};

type AppEventProviderPropsType = {
  children: ReactNode;
};

type EventInfoType = {
  conservations: ConservationItemMetadata[];
};

type AppEventContextType = {
  setActiveConservation: (id: string) => void;
  setConservations: (conservations: ConservationItemMetadata[]) => void;
  resetState: () => void;
} & EventInfoType;

const initEventInfoState: EventInfoType = {
  conservations: [],
};

const initValue: AppEventContextType = {
  ...initEventInfoState,
  setActiveConservation: () => {},
  setConservations: () => {},
  resetState: () => {},
};

const AppEventContext = createContext<AppEventContextType>(initValue);

const AppEventProvider: React.FC<AppEventProviderPropsType> = ({
  children,
}) => {
  const [eventInfo, setEventInfo] = useState<EventInfoType>(initEventInfoState);

  const _eventInfo = useMemo(() => {
    return {
      ...eventInfo,
      setActiveConservation: (id: string) => {
        setEventInfo((prev) => {
          return {
            ...prev,
            conservations: prev.conservations.map((c) => ({
              ...c,
              isActive: c.id === id,
            })),
          };
        });
      },
      setConservations: (conservations: ConservationItemMetadata[]) => {
        setEventInfo((prev) => {
          return {
            ...prev,
            conservations,
          };
        });
      },
      resetState: () => setEventInfo(initEventInfoState),
    };
  }, [eventInfo]);

  return (
    <AppEventContext.Provider value={_eventInfo}>
      {children}
    </AppEventContext.Provider>
  );
};

export const useAppEvent = () => useContext(AppEventContext);

export default AppEventProvider;
