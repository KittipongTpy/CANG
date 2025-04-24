import { init } from "../shapes/init";

const commandRegistry: Record<string, (command: string) => void> = {
  INIT: init,
};

export function executeCommand(input: string): void {
  const [commandName, ...args] = input.trim().split(/\s+/);
  const command = commandName.toUpperCase();

  const handler = commandRegistry[command];
  if (!handler) {
    console.error(`Unknown command: ${command}`);
    return;
  }

  handler(input);
}