import { Text, useInput, type Key } from "ink";
import chalk from "chalk";
import { darkTheme } from "./constants";
import { useTextInput } from "../hooks/useTexInput";

interface InputProps {
  multiline?: boolean;
  value: string;
  columns: number;
  offset: number;
  placeHolder?: string;
  isDimmed?: boolean;
  onChange: (value: string) => void;
  onChangeCursorOffset: (offset: number) => void;
  onSubmit: (value: string) => void;
}

export function Input(props: InputProps) {
  const {
    multiline = false,
    value: originalValue,
    columns,
    offset,
    isDimmed = false,
    placeHolder = "",
    onChange,
    onChangeCursorOffset,
    onSubmit,
  } = props;

  const { onInput, renderedValue } = useTextInput({
    onSubmit,
    multiline,
    value: originalValue,
    columns: columns,
    offset: offset,
    onChange,
    onOffsetChange: onChangeCursorOffset,
  });

  const showPlaceholder = originalValue.length === 0 && placeHolder;
  let renderedPlaceholder = placeHolder
    ? chalk.hex(darkTheme.secondaryText)(placeHolder)
    : undefined;

  
  const wrappedOnInput = (input: string, key: Key) => {
    onInput(input, key);
  }

  useInput(wrappedOnInput, { isActive: true });

  return (
    <Text wrap="truncate-end" dimColor={isDimmed}>
      {showPlaceholder ? renderedPlaceholder : renderedValue}
    </Text>
  );
}
