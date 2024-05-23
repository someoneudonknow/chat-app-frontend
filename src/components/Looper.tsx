import React, { ReactNode, cloneElement, isValidElement } from "react";

type LooperPropsType = {
  times: number;
  children: ReactNode;
};

const Looper: React.FC<LooperPropsType> = ({ times, children }) => {
  const keys = [...Array(times).keys()];

  return (
    <>
      {keys.map((key) => {
        if (!isValidElement(children)) return <></>;

        return cloneElement(children, { key, ...(children.props as object) });
      })}
    </>
  );
};

export default Looper;
