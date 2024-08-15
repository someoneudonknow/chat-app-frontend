import { createSlice } from "@reduxjs/toolkit";
import {
  Conservation,
  ConservationMember,
} from "../../models/conservation.model";
import { getUserConservations } from "./asyncThunk";
import { toast } from "react-toastify";
import { moveElement, removeDuplicatedWith } from "../../utils";
import User from "../../models/user.model";

// conservationsMessages: {
//   [key: Conservation["_id"]]: {
//     messages: Message[];
//     lastReadMessageTimestamp: Date;
//   };
// };

export type ConservationEventInfo = {
  online: boolean;
  hasUnreadMessage: boolean;
} & Conservation;

type UserConservationSliceType = {
  conservations: ConservationEventInfo[];
  currentConservation: string | null;
  loading: boolean;
  totalPages: number;
  currentPage: number;
};

const initVal: UserConservationSliceType = {
  conservations: [],
  currentConservation: null,
  loading: false,
  totalPages: 1,
  currentPage: 1,
};

const userConservationSlice = createSlice({
  name: "user-conservations",
  initialState: initVal,
  reducers: {
    addConservation: (state, { payload }) => {
      state.conservations.unshift(payload);
    },
    addNewOnlineMember: (state, { payload }) => {
      for (const c of state.conservations) {
        for (const member of c.members) {
          const currentMember = member as ConservationMember;
          if (currentMember.user._id === payload) {
            currentMember.user.isOnline = true;

            return;
          }
        }
      }
    },
    removeOnlineMember: (state, { payload }) => {
      for (const c of state.conservations) {
        for (const member of c.members) {
          const currentMember = member as ConservationMember;
          if (currentMember.user._id === payload) {
            currentMember.user.isOnline = false;

            return;
          }
        }
      }
    },
    setConservations: (state, { payload }) => {
      state.conservations = payload;
    },
    setCurrentConservation: (state, { payload }) => {
      state.currentConservation = payload;

      const currentConservation = state.conservations.find(
        (c) => c._id === payload
      );

      if (currentConservation) {
        currentConservation.hasUnreadMessage = false;
      }
    },
    updateConservation: (state, { payload: { _id, updated } }) => {
      const foundConservation = state.conservations.find((c) => c._id === _id);

      if (foundConservation) {
        const keys = Object.keys(updated as ConservationEventInfo);

        keys.forEach((k) => {
          const currentValue = updated[k];
          if (currentValue) {
            foundConservation[k] = currentValue;
          }
        });

        if (foundConservation._id !== state.currentConservation) {
          foundConservation.hasUnreadMessage = true;
        }

        const clonedConservations = [...state.conservations];
        const updatedConservationIndex = clonedConservations.findIndex(
          (c) => c._id === _id
        );

        if (updatedConservationIndex) {
          moveElement(clonedConservations, updatedConservationIndex, 0);

          state.conservations = clonedConservations;
        }
      }
    },
    clearState: (state) => {
      state.currentConservation = null;
      state.conservations = [];
      state.loading = false;
      state.currentPage = 1;
      state.totalPages = 1;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getUserConservations.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserConservations.fulfilled, (state, { payload }) => {
        const conservations: ConservationEventInfo[] = payload?.metadata?.list;
        const totalPages = payload?.metadata?.totalPages;

        if (conservations && totalPages) {
          state.totalPages = totalPages;
          state.currentPage += 1;
          state.conservations = removeDuplicatedWith(
            [
              ...state.conservations,
              ...conservations.map((c) => ({
                ...c,
                online: false,
                hasUnreadMessage: false,
              })),
            ],
            (c1, c2) => c1._id == c2._id
          );
        }

        state.loading = false;
      })
      .addCase(getUserConservations.rejected, (state, { payload }) => {
        toast.error(payload as string);
        state.loading = false;
      });
  },
});

export const {
  setConservations,
  setCurrentConservation,
  clearState,
  updateConservation,
  addNewOnlineMember,
  removeOnlineMember,
  addConservation,
} = userConservationSlice.actions;

export default userConservationSlice.reducer;
