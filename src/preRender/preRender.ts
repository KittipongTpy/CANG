import { circle } from "../shapes/circle";
import { ellipse } from "../shapes/ellipse";
import { line } from "../shapes/line";
import { hermite } from "../shapes/hermite";
import { bezier } from "../shapes/bezier"; // Update the path if necessary

interface Point {
    x: number;
    y: number;
}

export function getPreRenderPoint(shape: string, pointList: Point[]): Point[] {
    const shapeRequiredLengths: Record<string, number> = {
        line: 2,
        rectangle: 2,
        circle: 2,
        ellipse: 2,
    };

    const requiredLength = shapeRequiredLengths[shape] || 0;

    if (shape !== "bezier") {
        if (shape === "line") {
            const result = line(`LIN ${pointList[0].x} ${pointList[0].y} ${pointList[1].x} ${pointList[1].y}`);


            return typeof result === "object" && result?.type === "line"
                ? result.points.map((point) => ({ x: point[0], y: point[1] }))
                : [];
        }
        if (shape === "circle") {
            const radius = Math.sqrt(
                Math.pow(pointList[1].x - pointList[0].x, 2) +
                Math.pow(pointList[1].y - pointList[0].y, 2)
            );
            const result = circle(`CIR ${pointList[0].x} ${pointList[0].y} ${radius}`);
            return typeof result === "object" && result?.type === "circle"
                ? result.points.map((point) => ({ x: point[0], y: point[1] }))
                : [];
        }
        if (shape === "ellipse") {
            const a = Math.abs(pointList[1].x - pointList[0].x);
            const b = Math.abs(pointList[1].y - pointList[0].y);
            const result = ellipse(`ELI ${pointList[0].x} ${pointList[0].y} ${a} ${b}`);
            return typeof result === "object" && result?.type === "ellipse"
                ? result.points.map((point) => ({ x: point[0], y: point[1] }))
                : [];
        }
        if (shape === "rectangle") {

            const result1 = line(`LIN ${pointList[0].x} ${pointList[0].y} ${pointList[1].x} ${pointList[0].y}`);
            const result2 = line(`LIN ${pointList[0].x} ${pointList[0].y} ${pointList[0].x} ${pointList[1].y}`);
            const result3 = line(`LIN ${pointList[1].x} ${pointList[0].y} ${pointList[1].x} ${pointList[1].y}`);
            const result4 = line(`LIN ${pointList[0].x} ${pointList[1].y} ${pointList[1].x} ${pointList[1].y}`);
            const points = [result1, result2, result3, result4]
                .filter((res): res is { type: "line"; points: [number, number][] } => typeof res === "object" && res?.type === "line")
                .flatMap((res) =>
                    res.points.map((point: [number, number]) => ({ x: point[0], y: point[1] }))
                );
            return points;
        }

        if (shape === "hermite") {
            const [p1, p2, r1, r2] = pointList;

            // Ensure the tangent vectors are relative to their respective points
            const r1Vec = { x: r1.x - p1.x, y: r1.y - p1.y };
            const r2Vec = { x: r2.x - p2.x, y: r2.y - p2.y };

            const result = hermite(
                `HER ${p1.x} ${p1.y} ${p2.x} ${p2.y} ${r1Vec.x} ${r1Vec.y} ${r2Vec.x} ${r2Vec.y}`
            );

            return typeof result === "object" && result?.type === "hermite"
                ? result.points.map((point) => ({
                    x: Math.round(point[0]), // Use Math.round for better precision
                    y: Math.round(point[1]),
                }))
                : [];
        }
    } else if (shape === "bezier") {
        const result = bezier(`BEZ ${pointList[0].x} ${pointList[0].y} ${pointList[1].x} ${pointList[1].y} ${pointList[2].x} ${pointList[2].y} ${pointList[3].x} ${pointList[3].y}`);
        return typeof result === "object" && result?.type === "bezier"
            ? result.points.map((point) => ({ x: Math.ceil(point[0]), y: Math.ceil(point[1]) }))
            : [];
    }

    return pointList.slice(0, requiredLength);
}