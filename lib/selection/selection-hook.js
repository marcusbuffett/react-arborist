import { useEffect } from "react";
export function useSelectionKeys(ref, api) {
  useEffect(() => {
    const el = ref.current;

    const cb = e => {
      if (e.code === "ArrowDown") {
        e.preventDefault();
        api.selectDownwards(e.shiftKey);
      } else if (e.code === "ArrowUp") {
        e.preventDefault();
        api.selectUpwards(e.shiftKey);
      }
    };

    el?.addEventListener("keydown", cb);
    return () => {
      el?.removeEventListener("keydown", cb);
    };
  }, [ref, api]);
}