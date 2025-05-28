import { useState, useEffect, useRef } from "react";
import { getPreRenderPoint } from "../preRender/preRender";
import {
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
} from "../shapeConfiguration/dragHandler";

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
  setShape?: (
    shape:
      | "mouse"
      | "line"
      | "rectangle"
      | "circle"
      | "ellipse"
      | "bezier"
      | "hermite"
  ) => void;
  renderData: {
    shape: "line" | "rectangle" | "circle" | "ellipse" | "bezier" | "hermite";
    controlPoints: { x: number; y: number }[];
    color?: string;
    isFilled?: boolean;
    strokeWidth?: number;
    points?: { x: number; y: number }[];
    rotation?: number;
    rotationCenter?: { x: number; y: number };
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
        rotation?: number;
        rotationCenter?: { x: number; y: number };
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
  grid,
  setMousePos,
  shape,
  setShape,
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
  const [dragging, setDragging] = useState(false);
  const [draggingPointIndex, setDraggingPointIndex] = useState<number | null>(
    null
  );
  const [startMousePos, setStartMousePos] = useState<{
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
        controlPoints: mouseList,

        color: "#808080",
        isFilled: false,
        strokeWidth: 1,
      },
    ]);
    if (setId) setId(renderData.length);
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
      if (item.shape === "line" && item.controlPoints.length === 2) {
        const [start, end] = item.controlPoints;

        const distance =
          Math.abs(
            (end.y - start.y) * clickX -
            (end.x - start.x) * clickY +
            end.x * start.y -
            end.y * start.x
          ) / Math.sqrt((end.y - start.y) ** 2 + (end.x - start.x) ** 2);

        if (distance <= 5) {
          setId(i);
          if (setShape) setShape("mouse");
          shapeClicked = true;
          break;
        }
      }
      if (item.points) {
        for (const point of item.points) {
          const distance = Math.sqrt(
            (clickX - point.x) ** 2 + (clickY - point.y) ** 2
          );
          if (distance <= 5) {
            setId(i);
            if (setShape) setShape("mouse");
            shapeClicked = true;
            break;
          }
        }
      }
    }

    if (!shapeClicked && shape !== "mouse") {
      if (mouseList.length >= shapeRequiredLengths[shape || ""]) {
        setRenderDataFunc();
        setMouseList([newClickPos]);
        setIsDrawing(false);
      } else {
        setMouseList((prev) => [...prev, newClickPos]);
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

    // ✅ Draw Grid
    if (grid) {
      const spacing = 20;
      ctx.strokeStyle = "#e0e0e0";
      ctx.lineWidth = 0.5;
      for (let i = 0; i <= canvas.width; i += spacing) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let j = 0; j <= canvas.height; j += spacing) {
        ctx.beginPath();
        ctx.moveTo(0, j);
        ctx.lineTo(canvas.width, j);
        ctx.stroke();
      }
    }

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
        setRenderData((prev) =>
          prev.map((it, idx) => (idx === index ? { ...it, points } : it))
        );
      }

      ctx.save();

      const angle = (item.rotation ?? 0) * (Math.PI / 180);
      const center =
        item.rotationCenter ||
        item.controlPoints[Math.floor(item.controlPoints.length / 2)];

      ctx.translate(center.x, center.y);
      ctx.rotate(angle);
      ctx.translate(-center.x, -center.y);

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
        item.isFilled
          ? ctx.fillRect(minX, minY, w, h)
          : ctx.strokeRect(minX, minY, w, h);
      } else if (item.shape === "circle" || item.shape === "ellipse") {
        const center = item.controlPoints[0];
        const edge = item.controlPoints[1];
        const radiusX = Math.abs(edge.x - center.x);
        const radiusY = Math.abs(edge.y - center.y);

        ctx.beginPath();
        if (item.shape === "circle") {
          const r = Math.sqrt(
            (edge.x - center.x) ** 2 + (edge.y - center.y) ** 2
          );
          ctx.arc(center.x, center.y, r, 0, 2 * Math.PI);
        } else {
          ctx.ellipse(center.x, center.y, radiusX, radiusY, 0, 0, 2 * Math.PI);
        }
        item.isFilled ? ctx.fill() : ctx.stroke();
      } else if (item.shape === "bezier" || item.shape === "hermite") {
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i += 2) {
          const cp1 = points[i];
          const cp2 = points[i + 1];
          const end = points[i + 2] || points[points.length - 1];
          ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, end.x, end.y);
        }
        ctx.stroke();
      }
      if (index === id) {
        let minX: number, maxX: number, minY: number, maxY: number;

        if (item.shape === "circle") {
          const [center, edge] = item.controlPoints;
          const r = Math.sqrt(
            (edge.x - center.x) ** 2 + (edge.y - center.y) ** 2
          );
          minX = center.x - r;
          maxX = center.x + r;
          minY = center.y - r;
          maxY = center.y + r;
        } else if (item.shape === "ellipse") {
          const [center, edge] = item.controlPoints;
          const rx = Math.abs(edge.x - center.x);
          const ry = Math.abs(edge.y - center.y);
          minX = center.x - rx;
          maxX = center.x + rx;
          minY = center.y - ry;
          maxY = center.y + ry;
        } else {
          minX = Math.min(...points.map((p) => p.x));
          maxX = Math.max(...points.map((p) => p.x));
          minY = Math.min(...points.map((p) => p.y));
          maxY = Math.max(...points.map((p) => p.y));
        }

        ctx.strokeStyle = "rgb(0, 119, 255)";
        ctx.lineWidth = 1;
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
  }, [x, y, bgColor, mouseList, renderData, rendering, shape, id, grid]);

  return (
    <div
      style={{ aspectRatio: `${x} / ${y}`, position: "relative" }}
      onMouseDown={(e) => {
        if (shape === "mouse") {
          handleMouseDown(
            e,
            canvasRef,
            x,
            y,
            renderData,
            setDraggingPointIndex,
            setStartMousePos,
            setDragging,
            setId,
            id
          );
        }
      }}
      onMouseMove={(e) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Handle dragging
        handleMouseMove(
          e,
          canvasRef,
          x,
          y,
          dragging,
          startMousePos,
          renderData,
          setRenderData,
          draggingPointIndex,
          id,
          setStartMousePos
        );

        // Update mouse position
        const rect = canvas.getBoundingClientRect();
        const mouseX = ((e.clientX - rect.left) / rect.width) * x;
        const mouseY = ((e.clientY - rect.top) / rect.height) * y;
        setMousePos?.({ x: mouseX, y: mouseY });
        setMousePosHere({ x: mouseX, y: mouseY });
      }}
      onMouseUp={() =>
        handleMouseUp(setDragging, setDraggingPointIndex, setStartMousePos)
      }
      onClick={handleMouseClick}
    >
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: "100%", backgroundColor: bgColor }}
      />
    </div>
  );
}
