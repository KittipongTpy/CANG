export function circle(
  command: string,
): string | { type: "circle"; points: [number, number][]; color?: string } | null {
  const parts = command.trim().split(/\s+/);

  if (parts.length !== 4 && parts.length !== 6) {
    return "Syntax error: Use CIR <cx> <cy> <radius> [FIL <color>]";
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

  let color: string | undefined;
  if (parts.length === 6) {
    if (parts[4].toUpperCase() !== "FIL") {
      return "Syntax error: Expected FIL before color value.";
    }
    color = parts[5];
  }

  return { type: "circle", points, color };
}