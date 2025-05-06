import { drawPixel } from "./colorHelper";

export function drawLineShape(
  ctx: CanvasRenderingContext2D,
  points: [number, number][],
  shapeColor: string,
  strokeWidth: number
) {
  points.forEach(([px, py]) => {
    drawPixel(ctx, px, py, shapeColor, strokeWidth);
  });
}

export function drawPolygonShape(
  ctx: CanvasRenderingContext2D,
  points: [number, number][],
  shapeColor: string,
  strokeWidth: number
) {
  const pts = points.slice();
  const center = pts
    .reduce(
      (acc, [px, py]) => [acc[0] + px, acc[1] + py],
      [0, 0]
    )
    .map((val) => val / pts.length);

  pts.sort(
    (a, b) =>
      Math.atan2(a[1] - center[1], a[0] - center[0]) -
      Math.atan2(b[1] - center[1], b[0] - center[0])
  );

  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  pts.slice(1).forEach(([px, py]) => {
    ctx.lineTo(px, py);
  });
  ctx.closePath();
  ctx.fillStyle = shapeColor;
  ctx.fill();

  if (strokeWidth > 1) {
    ctx.strokeStyle = "black";
    ctx.lineWidth = strokeWidth;
    ctx.stroke();
  }
}