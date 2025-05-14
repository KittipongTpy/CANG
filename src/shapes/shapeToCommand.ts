import type { Shape } from "../pages/canvas";

export function shapeToCommand(shape: Shape): string {
  const round = (n: number) => Math.round(n);

  switch (shape.shape) {
    case "circle": {
      const [center, edge] = shape.controlPoints;
      const r = Math.round(Math.hypot(edge.x - center.x, edge.y - center.y));
      return `CIR ${round(center.x)} ${round(center.y)} ${r}`;
    }
    case "ellipse": {
      const [center, edge] = shape.controlPoints;
      const rx = round(Math.abs(edge.x - center.x));
      const ry = round(Math.abs(edge.y - center.y));
      return `ELI ${round(center.x)} ${round(center.y)} ${rx} ${ry}`;
    }
    case "line": {
      const [p1, p2] = shape.controlPoints;
      return `LIN ${round(p1.x)} ${round(p1.y)} ${round(p2.x)} ${round(p2.y)}`;
    }
    case "bezier":
    case "hermite": {
      const pts = shape.controlPoints.map(p => `${round(p.x)} ${round(p.y)}`);
      return `${shape.shape === "bezier" ? "BEZ" : "HER"} ${pts.join(" ")}`;
    }
    case "rectangle": {
      const [p1, p2] = shape.controlPoints;
      return `REC ${round(p1.x)} ${round(p1.y)} ${round(p2.x)} ${round(p2.y)}`;
    }
    default:
      return "// Unsupported shape";
  }
}