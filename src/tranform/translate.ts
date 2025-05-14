export function translateShape(
  shape: {
    controlPoints: { x: number; y: number }[];
  },
  offsetX: number,
  offsetY: number
): { controlPoints: { x: number; y: number }[] } {
  return {
    controlPoints: shape.controlPoints.map((point) => ({
      x: point.x + offsetX,
      y: point.y + offsetY,
    })),
  };
}