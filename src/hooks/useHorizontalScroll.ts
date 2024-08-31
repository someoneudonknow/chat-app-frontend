import { RefObject, useEffect } from "react";

const useHorizontalScroll = <E extends HTMLElement>(ref: RefObject<E>) => {
  useEffect(() => {
    const handler = (e: WheelEvent) => {
      e.preventDefault();
      const scrollAmount = e.deltaY;

      if (ref.current) {
        ref.current.scrollLeft += e.deltaY;

        ref.current.scrollTo({
          top: 0,
          left: ref.current.scrollLeft + scrollAmount,
          behavior: "auto",
        });
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
