import { circle } from "../shapes/circle";
import { ellipse } from "../shapes/ellipse";
import { line } from "../shapes/line";
import { hermite } from "../shapes/hermite"; // ...existing code...
import { rectangle } from "@/shapes/rectangle";

export type DrawData =
  | { type: "circle"; points: [number, number][]; color?: string ; strokeWidth?: number }
  | { type: "ellipse"; points: [number, number][]; color?: string ; strokeWidth?: number }
  | { type: "line"; points: [number, number][]; color?: string ; strokeWidth?: number }
  | { type: "hermite"; points: [number, number][]; color?: string; strokeWidth?: number }
  | { type: "rectangle"; points: [number, number][]; color?: string; strokeWidth?: number }

const commandRegistry: Record<
  string,
  (command: string) => string | null | DrawData
> = {
  CIR: circle,
  ELI: ellipse,
  LIN: line,
  HER: hermite,
  REC: rectangle,
};

export function executeCommand(input: string): {
  errors: string[];
  drawData: DrawData[];
} {
  const errors: string[] = [];
  const drawData: DrawData[] = [];
  const commands = input.trim().split(/\r?\n/).filter(line => line.trim().length > 0);

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