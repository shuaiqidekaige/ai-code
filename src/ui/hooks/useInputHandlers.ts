import { useCallback } from "react";
import { useInputState } from "./useInputState";

export function useInputHandlers() {
  const inputState = useInputState();

  const handleChange = useCallback(
    (val: string) => {
      inputState.setValue(val);
    },
    [inputState]
  );

  return {
    inputState,
    handlers: {
      handleChange,
    },
  };
}
