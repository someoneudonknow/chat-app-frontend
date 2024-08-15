import { useEffect, useRef } from "react";

type KeyPressPropsItem = {
  keys: string[] | string;
  mode?: "all" | "oneOf" | "single";
  cb: (e: KeyboardEvent) => void;
};

type UseKeyPressOptions = { exact: boolean };

type UseKeyPressProps = {
  registerKeys: KeyPressPropsItem[];
  options?: UseKeyPressOptions;
};

const useKeyPress = <E extends HTMLElement>({
  registerKeys,
  options,
}: UseKeyPressProps) => {
  const pressedKeyRef = useRef<{ [keyName: string]: boolean }>({});
  const containerRef = useRef<E>();

  useEffect(() => {
    if (registerKeys.length === 0) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const pressedKey = pressedKeyRef.current;
      pressedKey[e.key] = true;

      registerKeys.forEach(({ keys, mode = "single", cb }) => {
        switch (mode) {
          case "all": {
            if (!Array.isArray(keys))
              throw new Error("keys must be an array when using 'all' mode");
            const isPressedAllRequiredKeys = keys.every(
              (key) => !!pressedKey[key]
            );

            if (isPressedAllRequiredKeys) {
              cb(e);
            }
            break;
          }
          case "oneOf": {
            if (!Array.isArray(keys))
              throw new Error("keys must be an array when using 'oneOf' mode");

            const isPressedOneOfRequiredKeys = keys.some(
              (key) => !!pressedKey[key]
            );

            if (isPressedOneOfRequiredKeys) {
              cb(e);
            }
            break;
          }
          case "single": {
            let keyName = "";

            if (Array.isArray(keys) && keys.length > 0) {
              keyName = keys[0];
            } else if (typeof keys === "string") {
              keyName = keys;
            } else {
              throw new Error("key name is invalid");
            }
            const isPressedRequiredKey = pressedKey[keyName];
            const shouldExecuteCb = options?.exact
              ? Object.keys(pressedKey).length === 1 && isPressedRequiredKey
              : isPressedRequiredKey;

            shouldExecuteCb && cb(e);
            break;
          }
          default:
            throw new Error("Not supported mode: " + mode);
        }
      });
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (!e.repeat) {
        delete pressedKeyRef.current[e.key];
      }
    };

    const cloneRef = containerRef.current;

    cloneRef?.addEventListener("keydown", handleKeyDown);
    cloneRef?.addEventListener("keyup", handleKeyUp);

    return () => {
      cloneRef?.removeEventListener("keydown", handleKeyDown);
      cloneRef?.removeEventListener("keyup", handleKeyUp);
    };
  }, [registerKeys, options]);

  return { containerRef };
};

export default useKeyPress;
