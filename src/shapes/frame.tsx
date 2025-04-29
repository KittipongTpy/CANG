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

        console.log(executeCommand(drawData));
        const pixelList = executeCommand(drawData);
        pixelList.drawData.forEach((item) => {

            item.points?.forEach(([x, y]) => {
                ctx.fillStyle = "black";
                ctx.beginPath();
                ctx.fillRect(x, y, 1, 1);
                ctx.fill();
            })

        });

    }, [x, y]);
    const width = x;
    const height = y;

    return (
        <div
            style={{
                aspectRatio: `${width} / ${height}`, // maintain ratio only
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