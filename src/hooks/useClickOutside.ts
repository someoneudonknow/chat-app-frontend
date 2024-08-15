import { RefObject, useEffect } from "react";

const useClickOutside = <RT extends HTMLElement>(
  ref: RefObject<RT>,
  cb: () => void
) => {
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        cb();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
    //eslint-disable-next-line
  }, [ref]);
};

export default useClickOutside;
