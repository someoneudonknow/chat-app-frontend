import {
  FormControl,
  FormControlLabel,
  FormControlProps,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import React, { ChangeEvent, useEffect, useState } from "react";

type RadioButtonGroupPropsType = {
  id: string;
  name: string;
  formLabel: string;
  data: Array<{ label: string; value: any }>;
  onCheckChange?: (selected: any) => void;
  defaultValue?: any;
  rest?: FormControlProps;
};

const RadioButtonGroup: React.FC<RadioButtonGroupPropsType> = ({
  id,
  name,
  formLabel,
  defaultValue,
  onCheckChange,
  data,
  ...rest
}) => {
  const [selected, setSelected] = useState<any>(defaultValue);

  useEffect(() => {
    onCheckChange && onCheckChange(selected);

    //eslint-disable-next-line
  }, [selected]);

  return (
    <FormControl fullWidth {...rest}>
      <FormLabel id={id}>{formLabel}</FormLabel>
      <RadioGroup
        row
        aria-labelledby={id}
        name={name}
        defaultValue={defaultValue}
        value={selected}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          setSelected(e.target.value);
        }}
      >
        {data?.map((obj: { label: string; value: any }, i: number) => {
          const isFocus = selected === defaultValue;
          return (
            <FormControlLabel
              key={i}
              autoFocus={isFocus}
              value={obj.value}
              control={<Radio />}
              label={obj.label}
            />
          );
        })}
      </RadioGroup>
    </FormControl>
  );
};

export default RadioButtonGroup;
