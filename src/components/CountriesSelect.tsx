import { Autocomplete, Box, MenuItem, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getCountries, ipLookup } from "../utils/api";

type CountriesSelectPropsType = {
  onSelectionChange: (country?: Country) => void;
  defaultValue?: Country;
  label?: string;
};

export type Country = {
  name: string;
  Iso2: string;
  Iso3: string;
};

const CountriesSelect: React.FC<CountriesSelectPropsType> = ({
  onSelectionChange,
  defaultValue,
  label,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country>();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);

        const [countries, ipInfo] = await Promise.all([
          getCountries(),
          ipLookup(),
        ]);

        if (!countries?.error) {
          const userCountryBaseOnIp = countries?.data?.find(
            (c: Country) => c.Iso2 === ipInfo.countryCode
          );
          setSelectedCountry(defaultValue || userCountryBaseOnIp);
          setCountries(countries.data);
          onSelectionChange(defaultValue || userCountryBaseOnIp);
        }
      } catch (err: any) {
        toast.error(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <>
      {loading && <p>Loading...</p>}
      {countries.length > 0 && !loading && (
        <Autocomplete
          id="country-select"
          loading={loading}
          value={selectedCountry}
          onChange={(_, newVal: Country) => {
            setSelectedCountry(newVal);
            onSelectionChange(newVal);
          }}
          disableClearable
          options={countries}
          autoHighlight
          getOptionLabel={(option) => option.name}
          isOptionEqualToValue={(option, value) => option?.name === value?.name}
          renderOption={(props, option) => (
            <Box
              component="li"
              sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
              {...props}
            >
              <img
                loading="lazy"
                width="20"
                srcSet={`https://flagcdn.com/w40/${option.Iso2.toLowerCase()}.png 2x`}
                src={`https://flagcdn.com/w20/${option.Iso2.toLowerCase()}.png`}
                alt=""
              />
              {option.name} ({option.Iso2})
            </Box>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth
              label={label ?? "Choose a country"}
              inputProps={{
                ...params.inputProps,
                autoComplete: "new-password", // disable autocomplete and autofill
              }}
            />
          )}
        />
      )}
    </>
  );
};

export default CountriesSelect;
