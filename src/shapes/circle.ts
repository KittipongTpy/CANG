export function circle(
  command: string,
): string | { type: "circle"; points: [number, number][]; controlPoints?: [number, number][]; color?: string ; strokeWidth? : number ; isFilled?: boolean;} | null {
  const parts = command.trim().split(/\s+/);

  if (parts.length !== 4 && parts.length !== 6 && parts.length !== 8) {
    return "Syntax error: Use CIR <cx> <cy> <radius>";
  }
  if (parts[0].toUpperCase() !== "CIR") {
    return "Syntax error: Use CIR <cx> <cy> <radius> [FIL <color>]";
  }

  const [, cxStr, cyStr, rStr] = parts;
  const cx = parseInt(cxStr, 10);
  const cy = parseInt(cyStr, 10);
  const r = parseInt(rStr, 10);

  if (isNaN(cx) || isNaN(cy) || isNaN(r)) {
    return "Syntax error: cx, cy, radius must be numbers.";
  }
  if (r <= 0) {
    return "Syntax error: Radius must be positive.";
  }

  const points: [number, number][] = [];
  let x = 0;
  let y = r;
  let h = 1 - r;
  while (x <= y) {
    points.push([x + cx, y + cy]);
    points.push([y + cx, x + cy]);
    points.push([-x + cx, y + cy]);
    points.push([-y + cx, x + cy]);
    points.push([-x + cx, -y + cy]);
    points.push([-y + cx, -x + cy]);
    points.push([x + cx, -y + cy]);
    points.push([y + cx, -x + cy]);

    x++;
    if (h < 0) {
      h += 2 * x + 1;
    } else {
      y--;
      h += 2 * (x - y) + 1;
    }
  }

  
  // Optional parsing
  let color: string | undefined;
  let strokeWidth: number | undefined;
  let isFilled: boolean | undefined;

  if (parts.length === 6) {
    if (parts[4].toUpperCase() === "FIL") {
      color = parts[5];
      isFilled = true;
    } else if (parts[4].toUpperCase() === "BOR") {
      const width = parseFloat(parts[5]);
      if (isNaN(width)) {
        return "Syntax error: strokeWidth must be a number.";
      }
      strokeWidth = width;
    } else {
      return "Syntax error: Expected FIL or BOR at position 5.";
    }
  } else if (parts.length === 8) {
    if (parts[4].toUpperCase() !== "FIL" || parts[6].toUpperCase() !== "BOR") {
      return "Syntax error: Expected 'FIL <color> BOR <width>' in that order.";
    }
    color = parts[5];
    isFilled = true;
    const width = parseFloat(parts[7]);
    if (isNaN(width)) {
      return "Syntax error: strokeWidth must be a number.";
    }
    strokeWidth = width;
  }

  return { type: "circle", points, controlPoints: [[cx, cy],[cx + r, cy]], color ,strokeWidth, isFilled};
}