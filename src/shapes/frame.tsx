import { useState, useEffect, useRef } from "react";

import { executeCommand } from "../command/render";
import { getPreRenderPoint } from "../preRender/preRender";
import { render } from "react-dom";
import { it } from "node:test";
import type { Shape } from "../pages/canvas";

interface FrameProps {
  x: number;
  y: number;
  bgColor: string;
  drawData: string;
  grid: boolean;
  setMousePos?: (pos: { x: number; y: number }) => void;
  mousePos?: { x: number; y: number };
  shape?: "mouse" | "line" | "rectangle" | "circle" | "ellipse" | "bezier" | "hermite";
  renderData: {
    shape: "line" | "rectangle" | "circle" | "ellipse" | "bezier" | "hermite";
    controlPoints: { x: number; y: number }[];
    color?: string;
    isFilled?: boolean;
    strokeWidth?: number;
    points?: { x: number; y: number }[];
  }[];
  setRenderData: React.Dispatch<React.SetStateAction<{
    shape: "line" | "rectangle" | "circle" | "ellipse" | "bezier" | "hermite";
    controlPoints: { x: number; y: number }[];
    color?: string;
    isFilled?: boolean;
    strokeWidth?: number;
    points?: { x: number; y: number }[];
  }[]>>;
  id: number | null;
  setId: React.Dispatch<React.SetStateAction<number | null>>;
}



export default function FrameComponent({
  x,
  y,
  bgColor,
  drawData,
  grid,
  setMousePos,
  shape,
  renderData,
  setRenderData,
  id,
  setId
}: FrameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [mouseList, setMouseList] = useState<{ x: number; y: number }[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [rendering, setRendering] = useState<{ x: number; y: number }[]>([]);
  const [mousePosHere, setMousePosHere] = useState<{ x: number; y: number } | null>(null);

  const shapeRequiredLengths: Record<string, number> = {
    mouse: 1,
    line: 2,
    rectangle: 2,
    circle: 2,
    ellipse: 2,
    hermite: 4,
    bezier: 4,
  };

  const setRenderDataFunc = () => {
    setRenderData((prevRenderData) => [
      ...prevRenderData,
      {
        shape: shape as "line" | "rectangle" | "circle" | "ellipse" | "bezier" | "hermite",
        controlPoints: mouseList,
        color: "#808080",
        isFilled: false,
        strokeWidth: 1,
      },
    ]);
    if (setId) {
      setId(renderData.length);
    }
    setRendering([]);
  }



  useEffect(() => {
    if (!shape) return;
    const requiredLength = shapeRequiredLengths[shape] || 0;
    if (mouseList.length >= requiredLength) {
      setRenderDataFunc();
      setMouseList([]);
    }
  }, [shape, mouseList]);

  const handleMouseClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * x;
    const clickY = ((e.clientY - rect.top) / rect.height) * y;

    const newClickPos = { x: clickX, y: clickY };
    setMousePosHere(newClickPos);

    // Check if we clicked on any existing shape
    let shapeClicked = false;
    console.log(clickX, clickY);
    // Loop through shapes in reverse order (top to bottom)
    for (let i = renderData.length - 1; i >= 0; i--) {
      const item = renderData[i];
      console.log("item", item.shape);
      console.log()
      if (!item.points) continue;

      // Check if click is within any point of the shape
      for (const point of item.points) {
        const distance = Math.sqrt((clickX - point.x) ** 2 + (clickY - point.y) ** 2);
        if (distance <= 5) { // Adjust the threshold as needed
          // Select this shape
          setId(i);
          console.log("Selected shape:", item);
          shapeClicked = true;
          break; // Stop after first hit
        }

      }
    }

    // If we didn't click on any shape and we're in drawing mode
    if (!shapeClicked && shape !== "mouse") {
      if (mouseList.length >= (shapeRequiredLengths[shape || ""])) {
        setRenderDataFunc();
        setMouseList([newClickPos]);
        setIsDrawing(false);
      } else {
        setMouseList((prevMouseList) => [...prevMouseList, newClickPos]);
        setIsDrawing(true);
      }
    }
  };


  useEffect(() => {
    if (mouseList.length === (shapeRequiredLengths[shape || ""]) - 1 && shape !== "mouse") {
      setRendering(getPreRenderPoint(shape || "", [...mouseList, mousePosHere!]));
    }
  }, [mousePosHere]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = x;
    canvas.height = y;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas before rendering
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);



    mouseList.forEach((point) => {

      ctx.beginPath();
      ctx.arc(point.x - 2, point.y - 2, 0.01 * Math.min(x, y), 0, 2 * Math.PI);
      ctx.fillStyle = "rgb(0, 119, 255)";
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = "rgb(129, 188, 255)";
      ctx.stroke();

    });

    renderData.forEach((item, index) => {
      const points = item.points ?? getPreRenderPoint(item.shape, item.controlPoints);
      if (index === id) {
        ctx.fillStyle = "rgb(0, 119, 255)"
        const minX = Math.min(...points.map((point) => point.x));
        const maxX = Math.max(...points.map((point) => point.x));
        const minY = Math.min(...points.map((point) => point.y));
        const maxY = Math.max(...points.map((point) => point.y));
        ctx.strokeStyle = "rgb(0, 119, 255)";
        ctx.strokeRect(minX, minY, maxX - minX, maxY - minY);
      } else {
        ctx.fillStyle = item.color || "#808080";
      }
      points.forEach((point) => {
        ctx.fillRect(point.x, point.y, Math.ceil(0.003 * Math.min(x, y)), Math.ceil(0.003 * Math.min(x, y)));
      });
      if (index === id) {
        const selectedItem = item;
        ctx.fillStyle = "rgb(0, 119, 255)";
        selectedItem.controlPoints.forEach((point) => {
          ctx.beginPath();
          ctx.arc(point.x - 2, point.y - 2, 0.01 * Math.min(x, y), 0, 2 * Math.PI);
          ctx.fill();
          ctx.lineWidth = 4;
          ctx.strokeStyle = "rgb(129, 188, 255)";
          ctx.stroke();
        });

      }

    });


    rendering.forEach((item) => {
      ctx.fillStyle = "#808080";
      ctx.fillRect(item.x, item.y, Math.ceil(0.003 * Math.min(x, y)), Math.ceil(0.003 * Math.min(x, y)));
    });



  }, [x, y, bgColor, mouseList, renderData, rendering, shape, id]);



  return (
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
        setMousePosHere({ x: mouseX, y: mouseY });
      }}
      onClick={handleMouseClick}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: bgColor,
          imageRendering: "pixelated",
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
            backgroundSize: `${Math.min(x, y) / (Math.min(x, y) / 50)}px ${Math.min(x, y) / (Math.min(x, y) / 50)}px`,
          }}
        />
      )}

    </div >
  );
}

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
    default:
      return "// Unsupported shape";
  }
}
