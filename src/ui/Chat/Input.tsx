import { Text, useInput } from "ink";
import chalk from "chalk";
import { darkTheme } from "./constants";
import { useTextInput } from "../hooks/useTexInput";

interface InputProps {
  value: string;
  columns: number;
  offset: number;
  placeHolder?: string;
  isDimmed?: boolean;
  onChange: (value: string) => void;
  onChangeCursorOffset: (offset: number) => void;
}

export function Input(props: InputProps) {
  const {
    value: originalValue,
    columns,
    offset,
    isDimmed = false,
    placeHolder = "",
    onChange,
    onChangeCursorOffset,
  } = props;

  const { onInput, renderedValue } = useTextInput({
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

  useInput(onInput, { isActive: true });

  return (
    <Text wrap="truncate-end" dimColor={isDimmed}>
      {showPlaceholder ? renderedPlaceholder : renderedValue}
    </Text>
  );
}
