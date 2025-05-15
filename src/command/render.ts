import { circle } from "../shapes/circle";
import { ellipse } from "../shapes/ellipse";
import { line } from "../shapes/line";
import { bezier } from "@/shapes/bezier";
import { hermite } from "@/shapes/hermite";
import { rectangle } from "../shapes/rectangle";

export type DrawData =
  | { type: "circle"; points: [number, number][]; controlPoints?: [number, number][]; color?: string ; strokeWidth?: number ;isFilled?: boolean}
  | { type: "ellipse"; points: [number, number][]; controlPoints?: [number, number][];color?: string ; strokeWidth?: number ;isFilled?: boolean}
  | { type: "line"; points: [number, number][]; controlPoints?: [number, number][];color?: string ; strokeWidth?: number ;isFilled?: boolean}
  | { type: "rectangle"; points: [number, number][]; controlPoints?: [number, number][]; color?: string; strokeWidth?: number ;isFilled?: boolean}
  | { type: "bezier"; points: [number, number][]; controlPoints?: [number, number][]; color?: string; strokeWidth?: number ;isFilled?: boolean}
  | { type: "hermite"; points: [number, number][]; controlPoints?: [number, number][]; color?: string; strokeWidth?: number ;isFilled?: boolean};
const commandRegistry: Record<
  string,
  (command: string) => string | null | DrawData
> = {
  CIR: circle,
  ELI: ellipse,
  LIN: line,
  REC: rectangle,
  BEZ: bezier,
  HER: hermite,
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