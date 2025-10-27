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

  const handleSubmit = useCallback(
    (val: string) => {
      const value = inputState.state.value.trim();
      if (value === '') return;

      inputState.setValue('');
      console.log('发送')
    },
    [inputState]
  );

  return {
    inputState,
    handlers: {
      handleChange,
      handleSubmit,
    },
  };
}
