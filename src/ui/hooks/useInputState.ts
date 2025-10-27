import { useCallback } from "react";
import { useAppStore } from "../store/app";

export interface InputState {
  value: string;
  cursorPosition?: number;
}

export function useInputState() {
  const { inputValue, cursorPosition, setCursorPosition, setInputValue } =
    useAppStore();

  const state: InputState = {
    value: inputValue,
    cursorPosition: cursorPosition,
  };

  const setValue = useCallback(
    (value: string) => {
      setInputValue(value);
    },
    [setInputValue]
  );

  const setInputCursorPosition = useCallback(
    (position: number | undefined) => {
      setCursorPosition(position);
    },
    [setCursorPosition]
  );

  return {
    state,
    setValue,
    setInputCursorPosition,
  };
}
