import { StepIconProps, styled, useTheme } from "@mui/material";
import { motion } from "framer-motion";

const QontoStepIconRoot = styled("div")<{ ownerState: { active?: boolean } }>(
  ({ theme, ownerState }) => ({
    color: theme.palette.mode === "dark" ? theme.palette.grey[700] : "#eaeaf0",
    display: "flex",
    height: 22,
    alignItems: "center",
    transition: "all ease 0.4s",
    ...(ownerState.active && {
      color: "#784af4",
    }),
    "& .QontoStepIcon-completedIcon": {
      color: "#784af4",
      zIndex: 1,
      fontSize: 25,
    },
    "& .QontoStepIcon-circle": {
      width: 15,
      height: 15,
      borderRadius: "50%",
      backgroundColor: "currentColor",
    },
  })
);

export default function AnimatedStepIcon(props: StepIconProps) {
  const { active, completed, className } = props;

  return (
    <QontoStepIconRoot ownerState={{ active }} className={className}>
      {completed ? (
        <svg
          width="25px"
          height="25px"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <motion.path
            initial={{ strokeDashoffset: -30 }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ delay: 0.3, duration: 0.3 }}
            stroke="#784af4"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 9 11 15l-3-2"
            style={{ strokeDasharray: 30 }}
          />
          <motion.circle
            initial={{ pathLength: 0, stroke: "none" }}
            animate={{ pathLength: 1, stroke: "#784af4" }}
            transition={{ duration: 0.3, delay: 0.1 }}
            cx={12}
            cy={12}
            r={11}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
          />
          <motion.circle
            initial={{
              pathLength: 1,
              fill: "#784af4",
              opacity: 1,
            }}
            animate={{
              pathLength: 0,
              opacity: 0,
              fill: "none",
              display: "none",
            }}
            transition={{ duration: 0.1 }}
            cx={12}
            cy={12}
            r={7.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
          />
        </svg>
      ) : (
        <div className="QontoStepIcon-circle" />
      )}
    </QontoStepIconRoot>
  );
}
