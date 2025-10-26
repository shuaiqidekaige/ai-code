import { Box, Text } from "ink";
import { UI_COLORS } from "../constants";
import { useTerminalSize } from "../hooks/useTerminalSize";
import { Input } from "./Input";

const borderColor = UI_COLORS.CHAT_BORDER;
const promptSymbol = ">";

export function Chat() {
  const { columns } = useTerminalSize();
  return (
    <Box flexDirection="column">
      <Text color={borderColor}>{"─".repeat(Math.max(0, columns))}</Text>
      <Box flexDirection="row" gap={1}>
        <Text color={UI_COLORS.CHAT_ARROW_ACTIVE}>{promptSymbol}</Text>
        <Input value="" columns={columns} offset={0} />
      </Box>
      <Text color={borderColor}>{"─".repeat(Math.max(0, columns))}</Text>
    </Box>
  );
}
