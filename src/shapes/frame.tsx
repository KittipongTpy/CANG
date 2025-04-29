import { exec } from "child_process";
import { useEffect, useRef } from "react";
import { executeCommand } from "../command/render";
interface FrameProps {
    x: number;
    y: number;
    bgColor: string;
    drawData: string;
}

export default function FrameComponent({ x, y, bgColor, drawData }: FrameProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.width = x;
        canvas.height = y;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        // Set the background color
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const result = executeCommand(drawData);
        console.log(result);
        result.drawData.forEach((item) => {
            const shapeColor = item.color || "black";
            item.points?.forEach(([px, py]) => {
                ctx.fillStyle = shapeColor;
                ctx.beginPath();
                ctx.fillRect(px, py, 1, 1);
                ctx.fill();
            });
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