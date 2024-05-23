import React, { useEffect, useState } from "react";
import { BASE_URL } from "../../../constants/api-endpoints";
import InterestService from "../../../services/InterestService";
import { toast } from "react-toastify";
import { Box, Grid } from "@mui/material";
import InterestSuggestion from "./InterestSuggestion";
import InterestModel from "../../../models/interest.model";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store";
import SearchBoxDebounce from "../../SearchBoxDebounce";
import LoadingButton from "../../UIs/LoadingButton";
import InterestChip from "./InterestChip";
import { removeDuplicatedWith } from "../../../utils";
import { addInterests } from "../../../store/user/asyncThunks";
import TextTypingAnimate from "../../UIs/TextTypingAnimate";

type InterestsFormPropsType = {
  onSubmitSuccess: () => void;
};

const InterestsForm: React.FC<InterestsFormPropsType> = ({
  onSubmitSuccess,
}) => {
  const [interests, setInterests] = useState<InterestModel[] | null>(null);
  const userInterests = useSelector(
    (state: RootState) => state.user.currentUser?.interests
  );
  const [selectedInterests, setSelectedInterests] = useState<InterestModel[]>(
    []
  );
  const dispatch = useDispatch<AppDispatch>();
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);

  useEffect(() => {
    if (userInterests) {
      setSelectedInterests((prev) =>
        removeDuplicatedWith(
          [...prev, ...userInterests],
          (a, b) => a._id === b._id
        )
      );
    }
  }, [userInterests]);

  useEffect(() => {
    if (interests && interests.length > 0) {
      setInterests(
        (prev) =>
          prev?.filter(
            (interest) =>
              !selectedInterests?.some((i) => i._id === interest._id)
          ) ?? []
      );
    }
  }, [userInterests, selectedInterests, interests]);

  const handleSubmit = async () => {
    if (selectedInterests.length > 0) {
      const selectedIds: string[] = selectedInterests.map((i) => i._id);

      try {
        setSubmitLoading(true);
        await dispatch(addInterests(selectedIds));
        onSubmitSuccess();
      } catch (e: any) {
        console.error(e);
      } finally {
        setSubmitLoading(false);
      }
    }
  };

  const handleSearchChange = async (val: string) => {
    if (val === "") {
      setInterests(null);
      return;
    }

    try {
      setSearchLoading(true);
      const interestService = new InterestService(BASE_URL);
      const searchResult = await interestService.searchInterests(val);

      setInterests(searchResult.metadata?.list ?? []);
    } catch (e: any) {
      toast.error(e.message || "Something went wrong");
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSearchCancel = () => {
    setInterests(null);
  };

  const handleAddInterest = (id: string) => {
    const foundInterest = interests?.find((interest) => interest._id === id);

    if (foundInterest) {
      setSelectedInterests((prev) => [...prev, foundInterest]);
    }
  };

  const handleRemoveInterest = (id: string) => {
    setSelectedInterests((prev) =>
      prev.filter((interest) => interest._id !== id)
    );
  };
  return (
    <Box
      sx={{
        width: "100%",
      }}
    >
      <TextTypingAnimate
        style={{ fontSize: "32px" }}
        text="Share your interests with us 😃"
      />
      <Grid container spacing={3} sx={{ height: "55vh" }}>
        <Grid item xs={7}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <SearchBoxDebounce
              onSearchCancel={handleSearchCancel}
              onSearchChange={handleSearchChange}
              inputProps={{
                placeholder: "Start typing to generate options...",
              }}
              validationRules={{
                pattern: {
                  value: /^[a-zA-Z0-9\s]*$/,
                  message: "Please do not enter any special characters",
                },
              }}
            />
            {interests && (
              <InterestSuggestion
                loading={searchLoading}
                data={interests}
                onInterestItemIconClick={handleAddInterest}
              />
            )}
          </Box>
        </Grid>
        <Grid sx={{ height: "100%" }} item xs={5}>
          <Box
            sx={{
              px: 1,
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              width: "100%",
              overflowY: "auto",
              p: 3,
              // height: "100%",
              borderRadius: 5,
              boxShadow:
                "inset 0 0 35px 5px rgba(0,0,0,0.25), inset 0 -2px 1px rgba(0,0,0,0.25)",
            }}
          >
            {selectedInterests.length === 0 && (
              <p>You hasn't choose any interests</p>
            )}
            {selectedInterests.length > 0 &&
              selectedInterests.map((i) => (
                <InterestChip
                  key={i._id}
                  id={i._id}
                  name={i.name}
                  alreadyUsed={true}
                  usedCount={i.usedCount}
                  onIconClick={handleRemoveInterest}
                />
              ))}
          </Box>
        </Grid>
      </Grid>
      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <LoadingButton
          onClick={handleSubmit}
          loading={submitLoading}
          variant="contained"
          sx={{ width: "70%" }}
        >
          Next
        </LoadingButton>
      </Box>
    </Box>
  );
};

export default InterestsForm;
