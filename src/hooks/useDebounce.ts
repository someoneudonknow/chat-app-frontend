import { useCallback } from "react";
import { debounce } from "../utils";

const useDebounce = (fn: Function, delay: number) =>
  useCallback(debounce(fn, delay), [fn, delay]);

export default useDebounce;
