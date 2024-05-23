import React, { CSSProperties } from "react";

import { motion } from "framer-motion";

type TextTypingAnimatePropsType = {
  text: string;
  style?: CSSProperties;
};

const TextTypingAnimate: React.FC<TextTypingAnimatePropsType> = ({
  text,
  style,
}) => {
  const splitedText = text.split(" ");

  return (
    <div style={{ textAlign: "center", marginBottom: "32px" }}>
      {splitedText.map((el, i) => (
        <motion.span
          style={style}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.25,
            delay: i / 10,
          }}
          key={i}
        >
          {el}{" "}
        </motion.span>
      ))}
    </div>
  );
};

export default TextTypingAnimate;
