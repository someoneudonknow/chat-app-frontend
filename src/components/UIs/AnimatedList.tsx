import { List, ListProps } from "@mui/material";
import React, { Children, ReactNode, isValidElement } from "react";
import {
  AnimatePresence,
  MotionProps,
  MotionStyle,
  motion,
} from "framer-motion";
import {
  CONSERVATION_ITEM_VARIANT,
  CONSERVATION_LIST_VARIANT,
} from "../../constants/framer-motions/variants";
import { v4 as uuidv4 } from "uuid";

type AnimatedListPropsType = {
  children?: ReactNode;
  style?: MotionStyle;
} & MotionProps;

const AnimatedList: React.FC<AnimatedListPropsType> = ({
  children,
  style,
  ...rest
}) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 1 },
        visible: {
          opacity: 1,
          transition: {
            delayChildren: 0.1,
            staggerChildren: 0.1,
          },
        },
      }}
      initial="hidden"
      animate="visible"
      style={{
        overflowX: "hidden",
        ...style,
      }}
      {...rest}
    >
      {Children.map(children, (child, i) => {
        if (isValidElement(child)) {
          const { noAnimate } = child.props;

          if (noAnimate) return child;

          return (
            <motion.div
              key={i}
              variants={{
                hidden: { x: -10, opacity: 0 },
                visible: {
                  x: 0,
                  opacity: 1,
                  transition: {
                    duration: 0.1,
                  },
                },
              }}
            >
              {child}
            </motion.div>
          );
        }
      })}
    </motion.div>
  );
};

export default AnimatedList;
