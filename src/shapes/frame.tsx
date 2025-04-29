import { useEffect, useRef } from "react";
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

        // ctx.fillStyle = "#FF0000";
        // ctx.fillRect(0, 0, 3, 3);

        // Draw the frame
        // ctx.clearRect(x, y, width, height);
        // ctx.strokeStyle = "black";
        // ctx.strokeRect(x, y, width, height);


        // Clear the canvas
        // ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw the frame
        // ctx.strokeRect(x, y, width, height);
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