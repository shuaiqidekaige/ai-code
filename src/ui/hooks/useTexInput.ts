import type { Key } from "ink";
import { Cursor } from "../utils/Cursor";
import { useState } from "react";

interface UseTextInputProps {
  value: string;
  columns: number;
  offset: number;
}

export function useTextInput(props: UseTextInputProps) {
  const { value: originalValue, columns, offset } = props;
  const [cursor,  setCursor] = useState(Cursor.fromText(originalValue, columns, offset));

  const handleCtrl = () => {};

  const matchKeyToAction = (key: Key) => {
    switch (true) {
      case key.ctrl:
        return handleCtrl;
    }

    return (input: string) => {
      return cursor.insert(input.replace(/\r/g, "\n"));
    };
  };

  return {
    onInput: (input: string, key: Key) => {
      const newCursor = matchKeyToAction(key)(input);
      if (newCursor !== cursor && newCursor !== undefined) {
        setCursor(newCursor);
      }
    },
    renderedValue: cursor.text,
  };
}
