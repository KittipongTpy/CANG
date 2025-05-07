import { useState, useEffect, useRef } from "react";

import { executeCommand } from "../command/render";
import { getPreRenderPoint } from "../preRender/preRender";
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
  }[];
  setRenderData: React.Dispatch<React.SetStateAction<{
    shape: "line" | "rectangle" | "circle" | "ellipse" | "bezier" | "hermite";
    controlPoints: { x: number; y: number }[];
    color?: string;
    isFilled?: boolean;
    strokeWidth?: number;
  }[]>>;
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
    if (shape !== "mouse") {
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

    renderData.forEach((item) => {
      const points = getPreRenderPoint(item.shape, item.controlPoints);
      ctx.fillStyle = item.color || "#808080";
      points.forEach((point) => {
        ctx.fillRect(point.x, point.y, 1, 1);
      });
    });

    rendering.forEach((item) => {
      ctx.fillStyle = "#808080";
      ctx.fillRect(item.x, item.y, 1, 1);
    });
  }, [x, y, bgColor, rendering, renderData]);



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
