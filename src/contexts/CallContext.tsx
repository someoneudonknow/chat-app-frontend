import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useSocket } from "../hooks";
import { CallEventName, IncommingCallInfo } from "../constants/types";
import { Call, CallMediaType, CallType } from "../models/call.model";
import { CallService } from "../services";
import { BASE_URL } from "../constants/api-endpoints";
import { IncomingCallSnackBar } from "../components/Calls";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store";

type StartCallFuncParams = {
  rtcToken: string;
  rtmToken: string;
  channel: string;
  rtcUid: string;
  rtmUid: string;
  type: CallType;
  mediaType: CallMediaType;
  callId: Call["_id"];
};

type CallContextType = {
  startCall: (payload: StartCallFuncParams) => void;
  acceptCall: (payload: { callId: Call["_id"] }) => void;
};

type CallContextProviderPropsType = {
  children: ReactNode;
};

const initVal: CallContextType = {
  startCall: () => {},
  acceptCall: () => {},
};

export const CallContext = createContext(initVal);

const callService = new CallService(BASE_URL);

const CallProvider: React.FC<CallContextProviderPropsType> = ({ children }) => {
  const [incommingCall, setIncommingCall] = useState<IncommingCallInfo | null>(
    null
  );
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const { socket } = useSocket();
  const navigate = useNavigate();

  useEffect(() => {
    socket?.on(CallEventName.NEW_CALL_ARRIVED, (payload: IncommingCallInfo) => {
      // setIncommingCall((prev) => [...prev, payload]);
      setIncommingCall(payload);
    });

    socket?.on(CallEventName.CALL_END, (payload: string) => {
      // setIncommingCall((prev) => prev.filter((c) => c.callId !== payload));
      setIncommingCall(null);
    });

    return () => {
      socket?.off(CallEventName.NEW_CALL_ARRIVED);
      socket?.off(CallEventName.CALL_END);
    };
  }, [socket]);

  const startCall = useCallback(
    ({
      rtcToken,
      rtmToken,
      channel,
      rtcUid,
      rtmUid,
      type,
      mediaType,
      callId,
    }: StartCallFuncParams) => {
      const strWindowFeatures = `location=yes,scrollbars=yes,status=yes,width=${screen.width},height=${screen.height}`;
      const URL = `/user/call?call_id=${encodeURIComponent(
        callId
      )}&rtc_token=${encodeURIComponent(
        rtcToken
      )}&rtm_token=${encodeURIComponent(rtmToken)}&channel=${encodeURIComponent(
        channel
      )}&rtc_uid=${encodeURIComponent(
        rtcUid
      )}&rtm_uid=${rtmUid}&media_type=${encodeURIComponent(
        mediaType
      )}&type=${encodeURIComponent(type)}`;
      // window.open(URL, "_blank", strWindowFeatures);
      navigate(URL);
    },
    [navigate]
  );

  const acceptCall = useCallback(
    async ({ callId }: { callId: Call["_id"] }) => {
      try {
        const { status, metadata } = await callService.joinCall({ callId });

        if (status === 200) {
          const { call, rtcToken, rtmToken, channel, rtcUid, rtmUid } =
            metadata;

          startCall({
            callId: call._id,
            rtcToken,
            rtmToken,
            channel,
            rtcUid,
            rtmUid,
            type: call.type,
            mediaType: call.mediaType,
          });
        }
      } catch (err: any) {
        toast.error(err.message);
      }
    },
    [startCall]
  );

  const rejectCall = useCallback(
    async (callId: Call["_id"]) => {
      if (socket && currentUser) {
        socket?.emit(CallEventName.CALL_REJECT, {
          callId,
          user: currentUser,
        });
      }
    },
    [socket, currentUser]
  );

  const _value = useMemo(
    () => ({
      startCall,
      acceptCall,
    }),
    [startCall, acceptCall]
  );

  return (
    <CallContext.Provider value={_value}>
      {incommingCall && (
        <IncomingCallSnackBar
          handleCallReject={async (cid) => {
            await rejectCall(cid);
            setIncommingCall(null);
          }}
          handleCallAccept={async (cid) => {
            cid && (await acceptCall({ callId: cid }));
            setIncommingCall(null);
          }}
          callId={incommingCall?.callId}
          mediaType={incommingCall?.mediaType}
          from={incommingCall?.from}
          open={!!incommingCall}
          avatars={incommingCall?.avatar}
        />
      )}
      {children}
    </CallContext.Provider>
  );
};

export const useCall = () => useContext(CallContext);

export default CallProvider;
