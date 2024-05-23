import { Visibility, VisibilityOff } from "@mui/icons-material";
import { IconButton, TextField, TextFieldProps } from "@mui/material";
import React, {
  ForwardRefRenderFunction,
  ForwardedRef,
  forwardRef,
  useState,
} from "react";
import { FieldValues } from "react-hook-form";

type PasswordTextFieldPropsType = TextFieldProps & {
  register?: (
    rules?: Partial<FieldValues>
  ) => (ref: HTMLInputElement | null) => void;
};

const PasswordTextField: ForwardRefRenderFunction<
  HTMLInputElement,
  PasswordTextFieldPropsType
> = ({ register, ...props }, ref: ForwardedRef<HTMLInputElement>) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleTogglePassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <TextField
      {...props}
      inputRef={register ? register() : ref}
      type={showPassword ? "text" : "password"}
      InputProps={{
        endAdornment: (
          <IconButton onClick={handleTogglePassword}>
            {showPassword ? <Visibility /> : <VisibilityOff />}
          </IconButton>
        ),
      }}
    />
  );
};

export default forwardRef(PasswordTextField);
