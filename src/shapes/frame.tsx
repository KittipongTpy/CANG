import { useEffect, useRef } from "react";
import { executeCommand } from "../command/render";
import { drawPixel } from "./colorHelper"; // still needed if used elsewhere
import { drawLineShape, drawPolygonShape } from "./drawShape";

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

    // Fill background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const result = executeCommand(drawData);
    console.log(result);

    result.drawData.forEach((item) => {
      const shapeColor = item.color || "black";
      const strokeWidth = item.strokeWidth || 1;

      if (item.type === "line" || item.type === "hermite") {
        drawLineShape(ctx, item.points, shapeColor, strokeWidth);
      } else {
        drawPolygonShape(ctx, item.points, shapeColor, strokeWidth);
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