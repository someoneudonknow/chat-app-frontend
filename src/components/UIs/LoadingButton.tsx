import { Button, ButtonProps, Typography } from "@mui/material";
import { ReactNode } from "react";

type LoadingButtonProps = {
  loading: boolean;
  children: ReactNode;
  loadingText?: string;
} & ButtonProps;

const LoadingButton: React.FC<LoadingButtonProps> = ({
  loading,
  children,
  loadingText = "Loading...",
  ...rest
}) => {
  return (
    <Button disabled={loading} {...rest}>
      {loading && (
        <Typography variant="body1">{loadingText.toUpperCase()}</Typography>
      )}
      {!loading && children}
    </Button>
  );
};

export default LoadingButton;
