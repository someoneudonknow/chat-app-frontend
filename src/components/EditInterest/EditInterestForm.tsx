import { useDispatch, useSelector } from "react-redux";
import InterestModel from "../../models/interest.model";
import React, { useEffect, useState } from "react";
import { AppDispatch, RootState } from "../../store";
import InterestService from "../../services/InterestService";
import { BASE_URL } from "../../constants/api-endpoints";
import {
  Box,
  CircularProgress,
  Grid,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import SearchBoxDebounce from "../SearchBoxDebounce";
import InterestSuggestion from "../UserProfileFormModal/InterestForm/InterestSuggestion";
import InterestChip from "../UserProfileFormModal/InterestForm/InterestChip";
import { toast } from "react-toastify";
import { Close } from "@mui/icons-material";
import { motion } from "framer-motion";
import { addInterests, removeInterest } from "../../store/user/asyncThunks";

type EditInterestFormPropsType = {
  handleClose?: () => void;
};

const EditInterestForm: React.FC<EditInterestFormPropsType> = ({
  handleClose,
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
      setSelectedInterests(userInterests);
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

  const handleRemoveInterest = async (id: string) => {
    try {
      setSubmitLoading(true);
      await dispatch(removeInterest(id));
    } catch (e: any) {
      console.error(e);
    } finally {
      setSubmitLoading(false);
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

  const handleAddInterest = async (id: string) => {
    const foundInterest = interests?.find((interest) => interest._id === id);

    if (foundInterest) {
      try {
        setSubmitLoading(true);
        await dispatch(addInterests([foundInterest._id]));
      } catch (e: any) {
        console.error(e);
      } finally {
        setSubmitLoading(false);
      }
    }
  };

  return (
    <Paper
      sx={{
        width: "70%",
        pt: 2,
        px: 4,
        pb: 4,
        borderRadius: 5,
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      {submitLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            borderRadius: `calc(${5}px* 4)`,
            zIndex: 10000,
            display: "grid",
            placeItems: "center",
          }}
        >
          <CircularProgress />
        </motion.div>
      )}
      <Box sx={{ display: "flex", pb: 2, justifyContent: "space-between" }}>
        <Typography sx={{ fontSize: "27px" }}>Edit your interests</Typography>
        <IconButton
          onClick={() => handleClose && handleClose()}
          sx={{ border: "1px solid white" }}
        >
          <Close />
        </IconButton>
      </Box>
      <Grid container spacing={3} sx={{ height: "55vh" }}>
        <Grid item xs={6}>
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
        <Grid sx={{ height: "100%" }} item xs={6}>
          <Box
            sx={{
              p: 3,
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              width: "100%",
              overflowY: "auto",
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
    </Paper>
  );
};

export default EditInterestForm;
