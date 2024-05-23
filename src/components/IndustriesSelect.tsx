import {
  Autocomplete,
  AutocompleteChangeReason,
  SxProps,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { formatNumber } from "../utils";
import Industry from "../models/industry.model";
import IndustryService from "../services/IndustryService";
import { BASE_URL } from "../constants/api-endpoints";

type IndustriesSelectPropsType = {
  onSelectionChange: (_: any, newVal?: Industry) => void;
  label?: string;
  defaultValue?: Industry;
  sx?: SxProps;
};

const IndustriesSelect: React.FC<IndustriesSelectPropsType> = ({
  onSelectionChange,
  label,
  defaultValue,
  sx,
}) => {
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedIndustry, setSelectedIndustry] = useState<Industry>();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const industryService = new IndustryService(BASE_URL);
        const industriesResponse = await industryService.getListIndustrys();

        setIndustries(industriesResponse.metadata);
        setSelectedIndustry(defaultValue || industriesResponse.metadata?.[0]);
        onSelectionChange(defaultValue || industriesResponse.metadata?.[0]);
      } catch (e: any) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <>
      {loading && <p>Loading...</p>}
      {!loading && industries && selectedIndustry && (
        <Autocomplete
          autoHighlight
          getOptionLabel={(option) => option.name}
          options={industries}
          id="industry select"
          sx={{ width: "70%", ...sx }}
          loading={loading}
          value={selectedIndustry}
          isOptionEqualToValue={(option, value) => option._id === value._id}
          onChange={(_: any, newVal: Industry) => {
            setSelectedIndustry(newVal);
            onSelectionChange(_, newVal);
          }}
          disableClearable
          renderOption={(params, option) => {
            return (
              <Typography {...params}>
                {option.name} ({formatNumber(option.usedCount)})
              </Typography>
            );
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth
              label={label ?? "Choose your field.."}
              inputProps={{
                ...params.inputProps,
                autoComplete: "new-password",
              }}
            />
          )}
        />
      )}
    </>
  );
};

export default IndustriesSelect;
