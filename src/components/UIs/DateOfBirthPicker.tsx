import { SlotProps } from "@mui/material/utils/types";
import { DatePicker } from "@mui/x-date-pickers";
import moment from "moment";
import React from "react";
import {
  Control,
  Controller,
  FieldValues,
  RegisterOptions,
} from "react-hook-form";

type DateOfBirthPickerPropsType = {
  name?: string;
  customRules?:
    | Omit<
        RegisterOptions<FieldValues, any>,
        "valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled"
      >
    | undefined;
  control: Control<any>;
  slotProps?: any;
  rest?: any;
  defaultValue?: string | Date;
  label?: string;
};

const DateOfBirthPicker: React.FC<DateOfBirthPickerPropsType> = ({
  name = "userDob",
  customRules,
  control,
  defaultValue,
  slotProps,
  label,
  ...rest
}) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={{
        ...customRules,
        validate: {
          isValidDate: (value) => value?.isBefore(moment()) || "Invalid date",
        },
      }}
      defaultValue={moment(defaultValue)}
      render={({ field }) => {
        return (
          <DatePicker
            {...rest}
            label={label ?? "Date Of Birth"}
            value={field.value}
            inputRef={field.ref}
            onChange={(date) => {
              field.onChange(date);
            }}
            slotProps={{
              ...slotProps,
            }}
          />
        );
      }}
    />
  );
};

export default DateOfBirthPicker;
