import { ConservationItem } from "../../components/Conservation";
import ConservationSearchHeader from "./ConservationSearchHeader";
import ListWrapper from "../../components/UIs/ListWrapper";
import { useEffect, useMemo } from "react";
import { Conservation } from "../../models/conservation.model";
import { InfiniteScroll } from "../../components/InfiniteScroll";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { getConservationItemInfo } from "../../utils";
import { Outlet, useNavigate } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import { getUserConservations } from "../../store/userConservation/asyncThunk";
import {
  setCurrentConservation,
  updateConservation,
} from "../../store/userConservation";
import {
  addNewOnlineMember,
  ConservationEventInfo,
  removeOnlineMember,
} from "../../store/userConservation/userConservationSlice";
import { useSocket } from "../../hooks";

const LIMIT = 10;

enum ConservationEvent {
  CONSERVATION_UPDATE = "conservation/update",
  ONLINE_USER = "users/online-user",
  OFFLINE_USER = "users/offline-user",
}

const AllConservation: React.FC = () => {
  const userConservations = useSelector(
    (state: RootState) => state.conservation.conservations
  );
  const currentUserId = useSelector(
    (state: RootState) => state.user.currentUser?._id
  );
  const currentPage = useSelector(
    (state: RootState) => state.conservation.currentPage
  );
  const totalPage = useSelector(
    (state: RootState) => state.conservation.totalPages
  );
  const currentConservation = useSelector(
    (state: RootState) => state.conservation.currentConservation
  );
  const { socket } = useSocket();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const hasMore = useMemo<boolean>(() => {
    return currentPage <= totalPage;
  }, [currentPage, totalPage]);

  useEffect(() => {
    if (currentConservation === null) {
      if (userConservations.length > 0) {
        dispatch(setCurrentConservation(userConservations[0]._id));
      }
    } else {
      navigate(`/user/chat/all-conservations/${currentConservation}`);
    }
  }, [currentConservation, navigate, userConservations, dispatch]);

  useEffect(() => {
    socket?.on(ConservationEvent.ONLINE_USER, (payload) => {
      dispatch(addNewOnlineMember(payload));
    });

    socket?.on(ConservationEvent.OFFLINE_USER, (payload) => {
      dispatch(removeOnlineMember(payload));
    });

    return () => {
      socket?.off(ConservationEvent.ONLINE_USER);
      socket?.off(ConservationEvent.OFFLINE_USER);
    };
  }, [socket, dispatch]);

  useEffect(() => {
    socket?.on(ConservationEvent.CONSERVATION_UPDATE, (payload) => {
      payload.forEach((p: { _id: string; updated: Partial<Conservation> }) => {
        dispatch(updateConservation(p));
      });
    });

    return () => {
      socket?.off(ConservationEvent.CONSERVATION_UPDATE);
    };
  }, [dispatch, socket]);

  const getNext = async () => {
    dispatch(getUserConservations({ limit: LIMIT, page: currentPage }));
  };

  const handleConservationItemClick = (id: string) => {
    dispatch(setCurrentConservation(id));
  };

  return (
    <>
      <ListWrapper>
        <ConservationSearchHeader sx={{ mb: 1 }} />
        <InfiniteScroll
          style={{ height: "auto" }}
          loadingEl={
            <Box component="div" sx={{ textAlign: "center" }}>
              <CircularProgress />
            </Box>
          }
          debounceTimeout={500}
          data={userConservations}
          fetchNext={getNext}
          hasMore={hasMore}
          render={(data: ConservationEventInfo) => {
            if (!currentUserId) return <></>;

            const conservationItem = getConservationItemInfo(
              data as Conservation,
              currentUserId
            );

            return (
              <>
                {conservationItem && (
                  <ConservationItem
                    active={conservationItem._id === currentConservation}
                    conservationType={conservationItem.type}
                    key={conservationItem._id}
                    conservationId={conservationItem._id}
                    name={conservationItem.name}
                    avatar={conservationItem.cover}
                    lastMessage={conservationItem.lastMessage}
                    isOnline={conservationItem.isOnline}
                    onClick={handleConservationItemClick}
                    hasUnreadMessage={data.hasUnreadMessage}
                  />
                )}
              </>
            );
          }}
        />
      </ListWrapper>
      <Outlet />
    </>
  );
};

export default AllConservation;
