import { useEffect, useRef } from "react";

import { executeCommand } from "../command/render";
interface FrameProps {
  x: number;
  y: number;
  bgColor: string;
  drawData: string;
}

export default function FrameComponent({
  x,
  y,
  bgColor,
  drawData,
}: FrameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;
    canvas.width = x;
    canvas.height = y;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const result = executeCommand(drawData);

    console.log(result);
    result.drawData.forEach((item) => {
      const shapeColor = item.color || "black";
      const strokeWidth = item.strokeWidth || 1;


      if (item.type === "line") {
        item.points.forEach(([px, py]) => {
          ctx.fillStyle = shapeColor;
          ctx.beginPath();
          ctx.fillRect(px, py, strokeWidth, strokeWidth);
          ctx.fill();
          if (strokeWidth > 1) {  
          ctx.strokeStyle = shapeColor; 
          ctx.lineWidth = strokeWidth; 
          ctx.strokeRect(px, py, strokeWidth, strokeWidth);
          }
        });
      } else {
        const pts = item.points.slice();
        const center = pts
          .reduce((acc, [px, py]) => [acc[0] + px, acc[1] + py], [0, 0])
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
    });
  }, [x, y, bgColor, drawData]);

  return (
    <div
      style={{
        aspectRatio: `${x} / ${y}`,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
          imageRendering: "pixelated",
        }}
      />
    </div>
  );
}
