import { useState, useEffect, useRef } from "react";

import { executeCommand } from "../command/render";
interface FrameProps {
  x: number;
  y: number;
  bgColor: string;
  drawData: string;
  grid: boolean;
  setMousePos?: (pos: { x: number; y: number }) => void;
  mousePos?: { x: number; y: number };
  shape?: "mouse" | "line" | "rectangle" | "circle" | "ellipse" | "bezier" | "hermite";
}

export default function FrameComponent({
  x,
  y,
  bgColor,
  drawData,
  grid,
  setMousePos,
  mousePos,
  shape
}: FrameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [mouseList, setMouseList] = useState<{ x: number; y: number }[]>([]);
  const [clickedPos, setClickedPos] = useState<{ x: number; y: number }[]>([]);

  const shapeRequiredLengths: Record<string, number> = {
    mouse: 1,
    line: 2,
    rectangle: 2,
    circle: 2,
    ellipse: 2,
    hermite: 4,
    bezier: 4,
  };

  useEffect(() => {
    if (!shape) return;
    setMouseList([]);

    const requiredLength = shapeRequiredLengths[shape] || 0;
    console.log("requiredLength", requiredLength);

  }, [shape]);
  const handleMouseClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * x;
    const mouseY = ((e.clientY - rect.top) / rect.height) * y;

    setClickedPos((prev) => [...prev, { x: mouseX, y: mouseY }]);
  };

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
  useEffect(() => {
    if (mousePos) {
      setMousePos?.(mousePos);
    }
  }, [mousePos]);

  return (
    <div>
      <ul>
        {mouseList.map((pos, index) => (
          <li key={index}>
            ({pos.x.toFixed(2)}, {pos.y.toFixed(2)})
          </li>
        ))}
      </ul>
      <div
        style={{
          aspectRatio: `${x} / ${y}`,
          position: "relative",
        }}
        onMouseMove={(e) => {
          const canvas = canvasRef.current;
          if (!canvas) return;

          const rect = canvas.getBoundingClientRect();
          const mouseX = ((e.clientX - rect.left) / rect.width) * x;
          const mouseY = ((e.clientY - rect.top) / rect.height) * y;

          setMousePos?.({ x: mouseX, y: mouseY });
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: bgColor,
          }}
        />
        {grid && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none",
              backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 0, 0, 0.1) 1px, transparent 1px)`,
              backgroundSize: `${Math.min(x, y) / 5}px ${Math.min(x, y) / 5}px`,
            }}
          />
        )}
      </div>
    </div>
  );
}
