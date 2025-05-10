import { useCallback, useState } from "react";

type UseMentionReturnType = {
  onChange: (e: any) => void;
  closeMenu: () => void;
  open: boolean;
  anchorEl: HTMLElement | null;
};

const useMention = ({
  triggerChar = "/",
}: {
  triggerChar: string;
}): UseMentionReturnType => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const onTextChange = useCallback((e: any) => {
    const value = e.target.value.trim();

    if (value === triggerChar) {
      console.log("Trigger character detected:: ", triggerChar);
      setAnchorEl(e.target);
    }
  }, []);

  const closeMenu = useCallback(() => {
    setAnchorEl(null);
  }, []);

  return {
    onChange: onTextChange,
    closeMenu,
    anchorEl,
    open: !!anchorEl,
  };
};

export default useMention;
