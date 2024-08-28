import { RefObject, useEffect } from "react";

const useHorizontalScroll = <E extends HTMLElement>(ref: RefObject<E>) => {
  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();

      if (ref.current) {
        ref.current.scrollLeft += e.deltaX;
      }
    };

    const currRef = ref.current;

    currRef?.addEventListener("wheel", handler);

    return () => {
      currRef?.removeEventListener("wheel", handler);
    };
  }, [ref]);
};

export default useHorizontalScroll;
