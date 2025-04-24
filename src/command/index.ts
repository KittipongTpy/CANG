import { init } from "../shapes/init";

const commandRegistry: Record<string, (command: string) => string | null> = {
  INIT: init,
};

export function executeCommand(input: string): string[] {
  const results: string[] = [];
  const commands = input.trim().split(/\r?\n/); // Split commands by newline

  for (const line of commands) {
    const [commandName] = line.trim().split(/\s+/);
    const command = commandName.toUpperCase();

    const handler = commandRegistry[command];
    if (!handler) {
      results.push(`Unknown command: ${command}`);
    } else {
      const result = handler(line);
      if (result) {
        results.push(result);
      }
    }
  }

  return results;
}