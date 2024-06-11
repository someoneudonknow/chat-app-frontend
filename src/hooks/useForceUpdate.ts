import { useReducer } from "react";

const useForceUpdate = () => {
  //eslint-disable-next-line
  const [_, forceUpdate] = useReducer((x) => x + 1, 0);

  return forceUpdate;
};

export default useForceUpdate;
