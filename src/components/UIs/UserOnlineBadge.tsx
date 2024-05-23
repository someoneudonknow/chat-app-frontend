import { Badge, styled } from "@mui/material";
import React, { ReactNode } from "react";

interface UserOnlineBadgeStyleProps {
  isOnline: boolean;
}

const UserOnlineBadgeStyle = styled(Badge)<UserOnlineBadgeStyleProps>(
  (props) => {
    const { theme, isOnline } = props;

    return {
      "& .MuiBadge-badge": {
        backgroundColor: isOnline ? "#44b700" : "#9CAFAA",
        color: isOnline ? "#44b700" : "#9CAFAA",
        borderRadius: "100%",
        boxShadow: `0 0 0 1px ${theme.palette.background.paper}`,

        "&::after": {
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          ...(isOnline && { animation: "ripple 1.2s infinite ease-in-out" }),
          border: "1px solid currentColor",
          content: '""',
        },
      },
      "@keyframes ripple": {
        "0%": {
          transform: "scale(.8)",
          opacity: 1,
        },
        "100%": {
          transform: "scale(2.4)",
          opacity: 0,
        },
      },
    };
  }
);

type UserOnlineBadgePropsType = {
  isOnline: boolean;
  children: ReactNode;
  avtSize?: number;
};

const UserOnlineBadge: React.FC<UserOnlineBadgePropsType> = ({
  isOnline,
  children,
  avtSize,
}) => {
  return (
    <UserOnlineBadgeStyle
      isOnline={isOnline}
      sx={avtSize ? { width: `${avtSize}px`, height: `${avtSize}px` } : {}}
      overlap="circular"
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      variant="dot"
    >
      {children}
    </UserOnlineBadgeStyle>
  );
};

export default UserOnlineBadge;
