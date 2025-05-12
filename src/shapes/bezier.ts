export function bezier(command: string):
    | string
    | {
        type: "bezier";
        points: [number, number][];
        color?: string;
        strokeWidth?: number;
      }
    | null {
    const parts = command.trim().split(/\s+/);
  
    if (parts.length !== 9 && parts.length !== 11 && parts.length !== 13) {
      return "Syntax error: Use BEZ <x0> <y0> <x1> <y1> <x2> <y2> <x3> <y3> [FIL <color>] [BOR <strokeWidth>]";
    }
  
    if (parts[0].toUpperCase() !== "BEZ") {
      return "Syntax error: Command must start with BEZ";
    }
  
    const numValues = parts.slice(1, 9).map(Number);
    if (numValues.some(isNaN)) {
      return "Syntax error: All coordinates must be numbers.";
    }
  
    const [x0, y0, x1, y1, x2, y2, x3, y3] = numValues;
    const points: [number, number][] = [];
  
    const numSteps = 1000;
    for (let i = 0; i <= numSteps; i++) {
      const t = i / numSteps;
      const mt = 1 - t;
  
      const x =
        mt ** 3 * x0 +
        3 * mt ** 2 * t * x1 +
        3 * mt * t ** 2 * x2 +
        t ** 3 * x3;
      const y =
        mt ** 3 * y0 +
        3 * mt ** 2 * t * y1 +
        3 * mt * t ** 2 * y2 +
        t ** 3 * y3;
  
      points.push([x, y]);
    }
  
    let color: string | undefined;
    let strokeWidth: number | undefined;
  
    if (parts.length === 11) {
      const key = parts[9].toUpperCase();
      if (key === "FIL") {
        color = parts[10];
      } else if (key === "BOR") {
        strokeWidth = parseFloat(parts[10]);
        if (isNaN(strokeWidth)) {
          return "Syntax error: strokeWidth must be a number.";
        }
      } else {
        return "Syntax error: Expected FIL or BOR.";
      }
    } else if (parts.length === 13) {
      if (parts[9].toUpperCase() !== "FIL" || parts[11].toUpperCase() !== "BOR") {
        return "Syntax error: Expected 'FIL <color> BOR <width>' in that order.";
      }
      color = parts[10];
      strokeWidth = parseFloat(parts[12]);
      if (isNaN(strokeWidth)) {
        return "Syntax error: strokeWidth must be a number.";
      }
    }
  
    return {
      type: "bezier",
      points,
      color,
      strokeWidth,
    };
  }
  