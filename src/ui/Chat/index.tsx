import { Box, Text } from "ink";
import { UI_COLORS } from "../constants";
import { useTerminalSize } from "../hooks/useTerminalSize";
import { Input } from "./Input";
import { useInputHandlers } from "../hooks/useInputHandlers";
import { useCallback, useMemo } from "react";

const borderColor = UI_COLORS.CHAT_BORDER;
const promptSymbol = ">";

export function Chat() {
  const { inputState, handlers } = useInputHandlers();
  const { columns } = useTerminalSize();

  const displayValue = useMemo(() => {
    return inputState.state.value;
  }, [inputState.state.value]);

  const handleDisplayChange = useCallback(
    (val: string) => {
      handlers.handleChange(val);
    },
    [handlers]
  );

  const handleDisplayCursorChange = useCallback(
    (pos: number) => {
      inputState.setInputCursorPosition(pos);
    },
    [inputState]
  );

  const displayCursorOffset = useMemo(() => {
    const offset = inputState.state.cursorPosition ?? 0;
    return offset;
  }, [inputState.state.cursorPosition]);

  return (
    <Box flexDirection="column">
      <Text color={borderColor}>{"─".repeat(Math.max(0, columns))}</Text>
      <Box flexDirection="row" gap={1}>
        <Text color={UI_COLORS.CHAT_ARROW_ACTIVE}>{promptSymbol}</Text>
        <Input
          value={displayValue}
          columns={columns}
          offset={displayCursorOffset}
          onChange={handleDisplayChange}
          onChangeCursorOffset={handleDisplayCursorChange}
          placeHolder="Press up to edit queued messages"
        />
      </Box>
      <Text color={borderColor}>{"─".repeat(Math.max(0, columns))}</Text>
    </Box>
  );
}
