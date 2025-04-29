import { useEffect, useRef, useState } from "react";

import DefaultLayout from "@/layouts/default";

export default function DocsPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [zoom, setZoom] = useState(100); // % scale

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = 2;
    canvas.height = 2;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Example fill (checkerboard style)
    ctx.fillStyle = "#000000"; // black
    ctx.fillRect(0, 0, 1, 1);

    ctx.fillStyle = "#FFFFFF"; // white
    ctx.fillRect(1, 0, 1, 1);
    ctx.fillRect(0, 1, 1, 1);

    ctx.fillStyle = "#FF0000"; // red
    ctx.fillRect(1, 1, 1, 1);
  }, []);

  return (
    <DefaultLayout>
      <div>
        <div style={{ marginBottom: 10 }}>
          <button onClick={() => setZoom(z => Math.min(z + 50, 1000))}>Zoom In</button>
          <button onClick={() => setZoom(z => Math.max(z - 50, 50))}>Zoom Out</button>
          <span style={{ marginLeft: 10 }}>Zoom: {zoom}%</span>
        </div>

        <canvas
          ref={canvasRef}
          style={{
            border: "1px solid black",
            width: `${2 * zoom}px`,
            height: `${2 * zoom}px`,
            imageRendering: "pixelated",
          }}
        />
      </div>
    </DefaultLayout>
  );

}