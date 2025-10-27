import type { Key } from "ink";
import Cursor from "../utils/Cursor";
import { useState } from "react";

interface UseTextInputProps {
  value: string;
  columns: number;
  offset: number;
  onChange: (value: string) => void;
  onOffsetChange: (offset: number) => void;
}

export function useTextInput(props: UseTextInputProps) {
  const { value: originalValue, columns, offset, onChange, onOffsetChange } = props;
  const cursor = Cursor.fromText(originalValue, columns, offset);

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
      if (newCursor) {
        if (!cursor.equals(newCursor)) {
          onOffsetChange(newCursor.offset);
          if (cursor.text != newCursor.text) {
            onChange(newCursor.text || '');
          }
        }
      }
    },
    renderedValue: cursor.render(),
  };
}
