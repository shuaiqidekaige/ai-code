import type { Key } from "ink";
import Cursor from "../utils/Cursor";

interface UseTextInputProps {
  multiline: boolean;
  value: string;
  columns: number;
  offset: number;
  onChange: (value: string) => void;
  onOffsetChange: (offset: number) => void;
  onSubmit: (value: string) => void;
}

export function useTextInput(props: UseTextInputProps) {
  const { multiline, value: originalValue, columns, offset, onChange, onOffsetChange, onSubmit } = props;
  const cursor = Cursor.fromText(originalValue, columns, offset);


  const handleEnter = (key: Key) => {
    if (
      multiline &&
      cursor.offset > 0 &&
      cursor.text[cursor.offset - 1] === '\\'
    ) {
      return
    }
    if (key.meta) {
      return cursor.insert('\n');
    }
    onSubmit(originalValue);

  };

  const matchKeyToAction = (key: Key) => {
    switch (true) {
      case key.return:
        return () => handleEnter(key);
    }

    return (input: string) => {
      return cursor.insert(input.replace(/\r/g, "\n"));
    };
  };

  return {
    onInput: (input: string, key: Key) => {
      console.log(key.return)
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
