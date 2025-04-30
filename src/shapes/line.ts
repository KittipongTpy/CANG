export function line(
  command: string,
): string | { type: "line"; points: [number, number][]; color?: string ; strokeWidth?: number} | null {
  const parts = command.trim().split(/\s+/);

  if (parts.length !== 5 && parts.length !== 7 && parts.length !== 9) {
    return "Syntax error: Use LIN <x1> <y1> <x2> <y2>";
  }

  if (parts[0].toUpperCase() !== "LIN") {
    return "Syntax error: Use LIN <x1> <y1> <x2> <y2> [FIL <color>]";
  }

  const [, x1Str, y1Str, x2Str, y2Str] = parts;
  const x1 = parseInt(x1Str, 10);
  const y1 = parseInt(y1Str, 10);
  const x2 = parseInt(x2Str, 10);
  const y2 = parseInt(y2Str, 10);

  if ([x1, y1, x2, y2].some((v) => isNaN(v))) {
    return "Syntax error: x1, y1, x2, y2 must be numbers.";
  }

  const points: [number, number][] = [];
  let dx = Math.abs(x2 - x1);
  let dy = Math.abs(y2 - y1);
  let sx = x1 < x2 ? 1 : -1;
  let sy = y1 < y2 ? 1 : -1;
  let err = dx - dy;
  let x = x1;
  let y = y1;
  while (true) {
    points.push([x, y]);
    if (x === x2 && y === y2) break;
    const e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      x += sx;
    }
    if (e2 < dx) {
      err += dx;
      y += sy;
    }
  }

let color: string | undefined;
let strokeWidth: number | undefined;

if (parts.length === 5) {
  // ไม่มี FIL หรือ STR (ถูกต้อง)
} else if (parts.length === 7) {
  if (parts[5].toUpperCase() === "FIL") {
    color = parts[6];
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
  const width = parseFloat(parts[8]);
  if (isNaN(width)) {
    return "Syntax error: strokeWidth must be a number.";
  }
  strokeWidth = width;
} else {
  return "Syntax error: Invalid number of arguments.";
}

 
  return { type: "line", points, color , strokeWidth };
}