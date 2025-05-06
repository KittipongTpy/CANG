export function drawPixel(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    color: string,
    strokeWidth: number
) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.fillRect(x, y, strokeWidth, strokeWidth);
    ctx.fill();
    if (strokeWidth > 1) {
        ctx.strokeStyle = color;
        ctx.lineWidth = strokeWidth;
        ctx.strokeRect(x, y, strokeWidth, strokeWidth);
    }
}