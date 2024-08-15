import React from "react";

type UserIsTypingAnimationPropsType = {
  text?: string;
};

const UserIsTypingAnimation: React.FC<UserIsTypingAnimationPropsType> = ({
  text,
}) => {
  const textStyle = {
    color: "#8d8c91",
    animation: "loadingFade 1s infinite",
    animationTimingFunction: "linear",
    margin: "0 1px",
  };

  return (
    <div
      style={{
        color: "#8d8c91",
        display: "flex",
        fontSize: "14px",
      }}
    >
      {[0, 1, 2].map((n) => (
        <span
          key={n}
          style={{
            ...textStyle,
            animationDelay: `${0.2 * n}s`,
          }}
        >
          .
        </span>
      ))}
      <span style={{ color: "#8d8c91" }}>{text}</span>
    </div>
  );
};

export default UserIsTypingAnimation;
