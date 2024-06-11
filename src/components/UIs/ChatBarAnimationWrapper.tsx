import React, { ReactNode } from "react";
import { HTMLMotionProps, motion } from "framer-motion";

type ChatBarAnimationWrapperPropsType = {
  children: ReactNode;
} & HTMLMotionProps<"div">;

const ChatBarAnimationWrapper: React.FC<ChatBarAnimationWrapperPropsType> = ({
  children,
  ...rest
}) => {
  return (
    <motion.div initial={{ y: 40 }} animate={{ y: 0 }} {...rest}>
      {children}
    </motion.div>
  );
};

export default ChatBarAnimationWrapper;
