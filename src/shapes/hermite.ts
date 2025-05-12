interface Point {
    x: number;
    y: number;
}

export function hermite(
    command: string
):
    | string
    | {
        type: "hermite";
        points: [number, number][];
        color?: string;
        strokeWidth?: number;
    }
    | null {
    const parts = command.trim().split(/\s+/);

    if (parts.length !== 9 && parts.length !== 11 && parts.length !== 13) {
        return "Syntax error:  Use HER <x1> <y1> <x1> <y1> <R1x> <R1y> <R2x> <R2y>";
    }

    if (parts[0].toUpperCase() !== "HER") {
        return "Syntax error: Use HER <x1> <y1> <x2> <y2> <R1x> <R1y> <R2x> <R2y>";
    }

    const numValues = parts.slice(1, 9).map(Number);
    if (numValues.some(isNaN)) {
        return "Syntax error: All coordinate and tangent values must be numbers.";
    }

    const [x0, y0, x1, y1, R1x, R1y, R2x, R2y] = numValues;
    const p0: Point = { x: x0, y: y0 };
    const p1: Point = { x: x1, y: y1 };
    const m0: Point = { x: R1x, y: R1y };
    const m1: Point = { x: R2x, y: R2y };

    const points: [number, number][] = [];
    const numPoints = 1000;
    for (let i = 0; i <= numPoints; i++) {
        const t = i / numPoints;
        const t2 = t * t;
        const t3 = t2 * t;

        const f1 = 2 * t3 - 3 * t2 + 1;
        const f2 = t3 - 2 * t2 + t;
        const f3 = -2 * t3 + 3 * t2;
        const f4 = t3 - t2;

        const x = f1 * p0.x + f2 * m0.x + f3 * p1.x + f4 * m1.x;
        const y = f1 * p0.y + f2 * m0.y + f3 * p1.y + f4 * m1.y;
        points.push([x, y]);
    }

    let color: string | undefined;
    let strokeWidth: number | undefined;

    if (parts.length === 11) {
        const key = parts[9].toUpperCase();
        if (key === "FIL") {
            color = parts[10];
        } else if (key === "BOR") {
            const width = parseFloat(parts[10]);
            if (isNaN(width)) {
                return "Syntax error: strokeWidth must be a number.";
            }
            strokeWidth = width;
        } else {
            return "Syntax error: Expected FIL or BOR at position 10.";
        }
    } else if (parts.length === 13) {
        if (parts[9].toUpperCase() !== "FIL" || parts[11].toUpperCase() !== "BOR") {
            return "Syntax error: Expected 'FIL <color> BOR <width>' in that order.";
        }
        color = parts[10];
        const width = parseFloat(parts[12]);
        if (isNaN(width)) {
            return "Syntax error: strokeWidth must be a number.";
        }
        strokeWidth = width;
    }

    return { type: "hermite", points, color, strokeWidth };
}
