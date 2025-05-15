import { line } from "./line";

export function rectangle(
  command: string
): string | {
  type: "rectangle";
  points: [number, number][];
  controlPoints?: [number, number][];
  color?: string;
  strokeWidth?: number;
  isFilled?: boolean;
} | null {
  const parts = command.trim().split(/\s+/);

  if (parts.length !== 5 && parts.length !== 7 && parts.length !== 9) {
    return "Syntax error: Use REC <x1> <y1> <x2> <y2>";
  }

  if (parts[0].toUpperCase() !== "REC") {
    return "Syntax error: Use REC <x1> <y1> <x2> <y2> [FIL <color>] [BOR <width>]";
  }

  const [, x1Str, y1Str, x2Str, y2Str] = parts;
  const x1 = parseInt(x1Str, 10);
  const y1 = parseInt(y1Str, 10);
  const x2 = parseInt(x2Str, 10);
  const y2 = parseInt(y2Str, 10);

  if ([x1, y1, x2, y2].some((v) => isNaN(v))) {
    return "Syntax error: x1, y1, x2, y2 must be numbers.";
  }

  let color: string | undefined;
  let strokeWidth: number | undefined;
  let isFilled: boolean | undefined;

  if (parts.length === 7) {
    if (parts[5].toUpperCase() === "FIL") {
      color = parts[6];
      isFilled = true;
    } else if (parts[5].toUpperCase() === "BOR") {
      const width = parseFloat(parts[6]);
      if (isNaN(width)) {
        return "Syntax error: strokeWidth must be a number.";
      }
      strokeWidth = width;
    } else {
      return "Syntax error: Expected FIL or BOR at position 6.";
    }
  } else if (parts.length === 9) {
    if (parts[5].toUpperCase() !== "FIL" || parts[7].toUpperCase() !== "BOR") {
      return "Syntax error: Expected 'FIL <color> BOR <width>' in that exact order.";
    }
    color = parts[6];
    isFilled = true;
    const width = parseFloat(parts[8]);
    if (isNaN(width)) {
      return "Syntax error: strokeWidth must be a number.";
    }
    strokeWidth = width;
  }

  const result1 = line(`LIN ${x1} ${y1} ${x2} ${y1}`);
  const result2 = line(`LIN ${x1} ${y1} ${x1} ${y2}`);
  const result3 = line(`LIN ${x2} ${y1} ${x2} ${y2}`);
  const result4 = line(`LIN ${x1} ${y2} ${x2} ${y2}`);

  const points = [result1, result2, result3, result4]
    .filter((res): res is { type: "line"; points: [number, number][] } =>
      typeof res === "object" && res?.type === "line"
    )
    .flatMap((res) => res.points);

  const controlPoints: [number, number][] = [
    [x1, y1],
    [x2, y2],
  ];

  return {
    type: "rectangle",
    points,
    controlPoints,
    color,
    strokeWidth,
    isFilled,
  };
}