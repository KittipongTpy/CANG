import { init } from "../shapes/init";
import { circle } from "../shapes/circle";
import { ellipse } from "../shapes/ellipse";
import { line } from "../shapes/line";

export type DrawData =
  | { type: "circle"; points: [number, number][] }
  | { type: "ellipse"; points: [number, number][] }
  | { type: "line"; points: [number, number][] };

const commandRegistry: Record<
  string,
  (command: string) => string | null | DrawData
> = {
  INIT: init,
  CIR: circle,
  ELI: ellipse,
  LIN: line,
};

export function executeCommand(input: string): {
  errors: string[];
  drawData: DrawData[];
} {
  const errors: string[] = [];
  const drawData: DrawData[] = [];
  const commands = input.trim().split(/\r?\n/);

  for (const line of commands) {
    const [commandName] = line.trim().split(/\s+/);
    const command = commandName.toUpperCase();

    const handler = commandRegistry[command];

    if (!handler) {
      errors.push(`Unknown command: ${command}`);
    } else {
      const result = handler(line);

      if (typeof result === "string") {
        errors.push(result);
      } else if (result) {
        drawData.push(result);
      }
    }
  }

  return { errors, drawData };
}
