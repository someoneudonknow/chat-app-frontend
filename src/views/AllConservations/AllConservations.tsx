import { ConservationItem } from "../../components/Conservation";
import ConservationSearchHeader from "./ConservationSearchHeader";
import ListWrapper from "../../components/UIs/ListWrapper";
import { useEffect, useMemo, useState } from "react";
import { Conservation } from "../../models/conservation.model";
import { BASE_URL } from "../../constants/api-endpoints";
import ConservationService from "../../services/ConservationService";
import { InfiniteScroll } from "../../components/InfiniteScroll";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { getConservationItemInfo } from "../../utils";
import { Outlet, useNavigate } from "react-router-dom";
import { SELECTED_CONSERVATION_ID } from "../../constants";

let firstMount = true;

const AllConservation = () => {
  const [userConservations, setUserConservations] = useState<Conservation[]>(
    []
  );
  const navigate = useNavigate();
  const currentUserId = useSelector(
    (state: RootState) => state.user.currentUser?._id
  );
  const [totalPage, setTotalPage] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedConservation, setSelectedConservation] = useState<
    string | null
  >(sessionStorage.getItem(SELECTED_CONSERVATION_ID));

  const hasMore = useMemo<boolean>(() => {
    return currentPage <= totalPage;
  }, [currentPage, totalPage]);

  useEffect(() => {
    if (!selectedConservation && firstMount && userConservations?.length > 0) {
      setSelectedConservation(userConservations[0]._id);
      firstMount = false;
      return navigate(
        `/user/chat/all-conservations/${userConservations[0]._id}`
      );
    }

    if (selectedConservation) {
      navigate(`/user/chat/all-conservations/${selectedConservation}`);
    }
  }, [selectedConservation, navigate, userConservations]);

  const getNext = async () => {
    const conservationService = new ConservationService(BASE_URL);

    try {
      const conservations = await conservationService.getJoinedConservations({
        page: currentPage,
        limit: 10,
      });

      setTotalPage(conservations.metadata.totalPages);
      setUserConservations((prev) => [
        ...prev,
        ...(conservations.metadata.list as Conservation[]),
      ]);
      setCurrentPage((prev) => prev + 1);
    } catch (err) {
      console.error(err);
    }
  };

  const handleConservationItemClick = (id: string) => {
    setSelectedConservation(id);
    sessionStorage.setItem(SELECTED_CONSERVATION_ID, id);
  };

  return (
    <>
      <ListWrapper>
        <ConservationSearchHeader sx={{ mb: 1 }} />
        <InfiniteScroll
          style={{ height: "auto" }}
          loadingEl={<p>Loading...</p>}
          data={userConservations}
          fetchNext={getNext}
          hasMore={hasMore}
          render={(data: Conservation) => {
            const conservationItem = getConservationItemInfo(
              data,
              currentUserId
            );

            if (conservationItem === null) return <></>;

            return (
              <ConservationItem
                active={conservationItem._id === selectedConservation}
                conservationType={conservationItem.type}
                key={conservationItem._id}
                conservationId={conservationItem._id}
                name={conservationItem.name}
                avatar={conservationItem.cover}
                lastMessage={conservationItem.lastMessage}
                onClick={handleConservationItemClick}
              />
            );
          }}
        />
      </ListWrapper>
      <Outlet />
    </>
  );
};

export default AllConservation;
