import type { Shape } from "../pages/canvas";

export function shapeToCommand(shape: Shape): string {
  const round = (n: number) => Math.round(n);

  const appendStyle = () => {
    let result = "";
    if (shape.color && (shape.isFilled || shape.shape === "hermite" || shape.shape === "bezier")) {
      result += ` FIL ${shape.color}`;
    }
    if (shape.strokeWidth) {
      result += ` BOR ${shape.strokeWidth}`;
    }
    return result;
  };

  switch (shape.shape) {
    case "circle": {
      const [center, edge] = shape.controlPoints;
      const r = Math.round(Math.hypot(edge.x - center.x, edge.y - center.y));
      return `CIR ${round(center.x)} ${round(center.y)} ${r}${appendStyle()}`;
    }
    case "ellipse": {
      const [center, edge] = shape.controlPoints;
      const rx = round(Math.abs(edge.x - center.x));
      const ry = round(Math.abs(edge.y - center.y));
      return `ELI ${round(center.x)} ${round(center.y)} ${rx} ${ry}${appendStyle()}`;
    }
    case "line": {
      const [p1, p2] = shape.controlPoints;
      return `LIN ${round(p1.x)} ${round(p1.y)} ${round(p2.x)} ${round(p2.y)}${appendStyle()}`;
    }
    case "bezier":
    case "hermite": {
      const pts = shape.controlPoints.map(p => `${round(p.x)} ${round(p.y)}`);
      return `${shape.shape === "bezier" ? "BEZ" : "HER"} ${pts.join(" ")}${appendStyle()}`;
    }
    case "rectangle": {
      const [p1, p2] = shape.controlPoints;
      return `REC ${round(p1.x)} ${round(p1.y)} ${round(p2.x)} ${round(p2.y)}${appendStyle()}`;
    }
    default:
      return "// Unsupported shape";
  }
}