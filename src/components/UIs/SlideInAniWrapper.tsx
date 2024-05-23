import React, { ReactNode } from "react";
import { motion } from "framer-motion";

type CardFlipAnimationWrapperType = {
  children: ReactNode;
};

const SlideInAniWrapper: React.FC<CardFlipAnimationWrapperType> = ({
  children,
}) => {
  return (
    <motion.div layout transition={{ duration: 0.5 }}>
      {children}
    </motion.div>
  );
};

export default SlideInAniWrapper;
