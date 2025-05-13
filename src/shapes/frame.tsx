import { useState, useEffect, useRef } from "react";
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
  shape?:
    | "mouse"
    | "line"
    | "rectangle"
    | "circle"
    | "ellipse"
    | "bezier"
    | "hermite";
  renderData: {
    shape: "line" | "rectangle" | "circle" | "ellipse" | "bezier" | "hermite";
    controlPoints: { x: number; y: number }[];
    color?: string;
    isFilled?: boolean;
    strokeWidth?: number;
    points?: { x: number; y: number }[];
  }[];
  setRenderData: React.Dispatch<
    React.SetStateAction<
      {
        shape:
          | "line"
          | "rectangle"
          | "circle"
          | "ellipse"
          | "bezier"
          | "hermite";
        controlPoints: { x: number; y: number }[];
        color?: string;
        isFilled?: boolean;
        strokeWidth?: number;
        points?: { x: number; y: number }[];
      }[]
    >
  >;
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
  setId,
}: FrameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mouseList, setMouseList] = useState<{ x: number; y: number }[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [rendering, setRendering] = useState<{ x: number; y: number }[]>([]);
  const [mousePosHere, setMousePosHere] = useState<{
    x: number;
    y: number;
  } | null>(null);

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
    let calculatedControlPoints = mouseList;
    // [p1, r1_abs, p2_abs, r2_abs]
    if (shape === "hermite" && mouseList.length === 4) {
      const [p1_abs, r1_abs, r2_abs, p2_abs] = mouseList; // seq of points
      const r1Vec = { x: r1_abs.x - p1_abs.x, y: r1_abs.y - p1_abs.y };
      const r2Vec = { x: r2_abs.x - p2_abs.x, y: r2_abs.y - p2_abs.y };
      calculatedControlPoints = [p1_abs, r1Vec, r2Vec, p2_abs];
    }
    setRenderData((prevRenderData) => [
      ...prevRenderData,
      {
        shape: shape as
          | "line"
          | "rectangle"
          | "circle"
          | "ellipse"
          | "bezier"
          | "hermite",
        controlPoints: calculatedControlPoints,
        color: "#808080",
        isFilled: false,
        strokeWidth: 1,
      },
    ]);
    if (setId) {
      setId(renderData.length);
    }
    setRendering([]);
  };

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

    let shapeClicked = false;

    for (let i = renderData.length - 1; i >= 0; i--) {
      const item = renderData[i];
      if (!item.points) continue;
      for (const point of item.points) {
        const distance = Math.sqrt(
          (clickX - point.x) ** 2 + (clickY - point.y) ** 2
        );
        if (distance <= 5) {
          setId(i);
          shapeClicked = true;
          break;
        }
      }
    }

    if (!shapeClicked && shape !== "mouse") {
      if (mouseList.length >= shapeRequiredLengths[shape || ""]) {
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
    if (
      mouseList.length === shapeRequiredLengths[shape || ""] - 1 &&
      shape !== "mouse"
    ) {
      setRendering(
        getPreRenderPoint(shape || "", [...mouseList, mousePosHere!])
      );
    }
  }, [mousePosHere]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = x;
    canvas.height = y;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
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
      let points: { x: number; y: number }[] = [];

      if (item.shape === "line") {
        points = item.controlPoints;
      } else {
        points = getPreRenderPoint(item.shape, item.controlPoints);
      }

      if (!points.length) return;

      if (item.shape !== "line") {
        setRenderData((prevRenderData) =>
          prevRenderData.map((it, idx) =>
            idx === index ? { ...it, points } : it
          )
        );
      }

      ctx.lineWidth = item.strokeWidth || 1;
      ctx.strokeStyle = item.color || "#000000";
      ctx.fillStyle = item.color || "#000000";

      if (item.shape === "line") {
        const [start, end] = item.controlPoints;
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
      } else if (item.shape === "rectangle") {
        const minX = Math.min(...points.map((p) => p.x));
        const maxX = Math.max(...points.map((p) => p.x));
        const minY = Math.min(...points.map((p) => p.y));
        const maxY = Math.max(...points.map((p) => p.y));
        const w = maxX - minX;
        const h = maxY - minY;

        if (item.isFilled) {
          ctx.fillRect(minX, minY, w, h);
        } else {
          ctx.strokeRect(minX, minY, w, h);
        }
      } else if (item.shape === "circle" || item.shape === "ellipse") {
        const center = item.controlPoints[0];
        const edge = item.controlPoints[1];
        const radiusX = Math.abs(edge.x - center.x);
        const radiusY = Math.abs(edge.y - center.y);

        ctx.beginPath();
        if (item.shape === "circle") {
          const dx = edge.x - center.x;
          const dy = edge.y - center.y;
          const r = Math.sqrt(dx * dx + dy * dy);
          ctx.arc(center.x, center.y, r, 0, 2 * Math.PI);
        } else {
          ctx.ellipse(center.x, center.y, radiusX, radiusY, 0, 0, 2 * Math.PI);
        }
        item.isFilled ? ctx.fill() : ctx.stroke();
      } else {
        points.forEach((point) => {
          ctx.fillRect(point.x, point.y, 1, 1);
        });
      }

      if (index === id) {
        const minX = Math.min(...points.map((p) => p.x));
        const maxX = Math.max(...points.map((p) => p.x));
        const minY = Math.min(...points.map((p) => p.y));
        const maxY = Math.max(...points.map((p) => p.y));
        ctx.strokeStyle = "rgb(0, 119, 255)";
        ctx.strokeRect(minX, minY, maxX - minX, maxY - minY);

        ctx.fillStyle = "rgb(0, 119, 255)";
        item.controlPoints.forEach((point) => {
          ctx.beginPath();
          ctx.arc(
            point.x - 2,
            point.y - 2,
            0.01 * Math.min(x, y),
            0,
            2 * Math.PI
          );
          ctx.fill();
          ctx.lineWidth = 4;
          ctx.strokeStyle = "rgb(129, 188, 255)";
          ctx.stroke();
        });
      }
    });

    rendering.forEach((item) => {
      ctx.fillStyle = "#808080";
      ctx.fillRect(
        item.x,
        item.y,
        Math.ceil(0.003 * Math.min(x, y)),
        Math.ceil(0.003 * Math.min(x, y))
      );
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
        }}
      />
    </div>
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
    case "bezier": {
      const pts = shape.controlPoints.map(p => `${round(p.x)} ${round(p.y)}`);
      return `BEZ ${pts.join(" ")}`;
    }
    case "hermite": {
      const pts = shape.controlPoints.map(p => `${round(p.x)} ${round(p.y)}`);
      return `HER ${pts.join(" ")}`;
    }
    case "rectangle": {
      const [p1, p2] = shape.controlPoints;
      return `REC ${round(p1.x)} ${round(p1.y)} ${round(p2.x)} ${round(p2.y)}`;
    }
    default:
      return "// Unsupported shape";
  }
}
