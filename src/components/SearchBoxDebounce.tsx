import { Cancel, Search } from "@mui/icons-material";
import {
  InputAdornment,
  SxProps,
  TextField,
  TextFieldProps,
} from "@mui/material";
import React, { useCallback, useEffect, useId, useState } from "react";
import { useDebounce } from "../hooks";
import { AnimatePresence, motion } from "framer-motion";
import { Controller, FieldValues, useForm } from "react-hook-form";

interface SearchBoxDebouncePropsType {
  onSearchChange: (value: string) => void;
  onSearchCancel?: () => void;
  validationRules?: object;
  inputProps?: Omit<
    TextFieldProps,
    "onChange" | "ref" | "helperText" | "onBlur"
  >;
  sx?: SxProps;
  noIcon?: boolean;
}

const SearchBoxDebounce: React.FC<SearchBoxDebouncePropsType> = ({
  onSearchChange,
  onSearchCancel,
  validationRules,
  inputProps,
  sx,
  noIcon,
}) => {
  const { control, setValue, handleSubmit, watch } = useForm({
    mode: "onChange",
  });
  const [showCancelBtn, setShowCancelBtn] = useState<boolean>(false);
  const id = useId();
  const searchInputName = `${id}-searchInput`;

  const handleSearchCancel = () => {
    setShowCancelBtn(false);
    setValue(searchInputName, "");
    onSearchCancel && onSearchCancel();
  };

  const searchData = useDebounce(onSearchChange, 500);

  const handleSearchChange = useCallback(
    (vals: FieldValues) => {
      if (vals[searchInputName] !== "") {
        setShowCancelBtn(true);
      } else {
        setShowCancelBtn(false);
      }

      searchData(vals[searchInputName]);
    },
    [searchInputName, searchData]
  );

  useEffect(() => {
    const subscription = watch(() => handleSubmit(handleSearchChange)());

    return () => subscription.unsubscribe();
  }, [handleSubmit, watch, handleSearchChange]);

  return (
    <Controller
      control={control}
      name={searchInputName}
      defaultValue=""
      rules={validationRules}
      render={({ field, fieldState }) => (
        <TextField
          size="small"
          {...inputProps}
          sx={sx}
          onBlur={field.onBlur}
          ref={field.ref}
          error={!!fieldState?.error}
          helperText={fieldState.error ? fieldState.error.message : null}
          onChange={field.onChange}
          value={field.value}
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment
                sx={{ cursor: "pointer" }}
                onClick={handleSearchCancel}
                position="start"
              >
                <AnimatePresence>
                  {showCancelBtn && (
                    <motion.div
                      key={`${id}-cancelBtn`}
                      whileHover={{ scale: 1.1 }}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 3, opacity: 1 }}
                      exit={{
                        y: 10,
                        opacity: 0,
                        transition: { duration: 0.1 },
                      }}
                    >
                      <Cancel />
                    </motion.div>
                  )}
                </AnimatePresence>
              </InputAdornment>
            ),
            ...(!noIcon && {
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }),
          }}
        />
      )}
    />
  );
};

export default SearchBoxDebounce;
