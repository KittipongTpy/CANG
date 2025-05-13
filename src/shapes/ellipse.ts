export function ellipse(
  command: string,
): string | { type: "ellipse"; points: [number, number][]; controlPoints?: [number, number][]; color?: string ;strokeWidth? : number } | null {
  const parts = command.trim().split(/\s+/);

 if (parts.length !== 5 && parts.length !== 7 && parts.length !== 9) {
    return "Syntax error: Use LIN <x1> <y1> <x2> <y2>";
  }

  if (parts[0].toUpperCase() !== "ELI") {
    return "Syntax error: Use ELI <cx> <cy> <rx> <ry> [FIL <color>]";
  }

  const [, cxStr, cyStr, rxStr, ryStr] = parts;
  const cx = parseInt(cxStr, 10);
  const cy = parseInt(cyStr, 10);
  const rx = parseInt(rxStr, 10);
  const ry = parseInt(ryStr, 10);

  if ([cx, cy, rx, ry].some((v) => isNaN(v))) {
    return "Syntax error: cx, cy, rx, ry must be numbers.";
  }
  if (rx <= 0 || ry <= 0) {
    return "Syntax error: rx and ry must be positive.";
  }

  const points: [number, number][] = [];

  let x = 0;
  let y = ry;
  let rx2 = rx * rx;
  let ry2 = ry * ry;
  let tworx2 = 2 * rx2;
  let twory2 = 2 * ry2;
  let px = 0;
  let py = tworx2 * y;

  // Region 1
  let p = Math.round(ry2 - rx2 * ry + 0.25 * rx2);
  while (px < py) {
    points.push([cx + x, cy + y]);
    points.push([cx - x, cy + y]);
    points.push([cx + x, cy - y]);
    points.push([cx - x, cy - y]);
    x++;
    px += twory2;
    if (p < 0) {
      p += ry2 + px;
    } else {
      y--;
      py -= tworx2;
      p += ry2 + px - py;
    }
  }

  // Region 2
  p = Math.round(
    ry2 * (x + 0.5) * (x + 0.5) + rx2 * (y - 1) * (y - 1) - rx2 * ry2,
  );
  while (y >= 0) {
    points.push([cx + x, cy + y]);
    points.push([cx - x, cy + y]);
    points.push([cx + x, cy - y]);
    points.push([cx - x, cy - y]);
    y--;
    py -= tworx2;
    if (p > 0) {
      p += rx2 - py;
    } else {
      x++;
      px += twory2;
      p += rx2 - py + px;
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
      return "Syntax error: Expected 'FIL <color> BOR <width>' in that order.";
    }
    color = parts[6];
    const width = parseFloat(parts[8]);
    if (isNaN(width)) {
      return "Syntax error: strokeWidth must be a number.";
    }
    strokeWidth = width;
  }

  return { type: "ellipse", points, controlPoints: [[cx, cy], [cx + rx, cy + ry]], color, strokeWidth };
}