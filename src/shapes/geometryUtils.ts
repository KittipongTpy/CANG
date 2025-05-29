export function getCenter(
    points: { x: number; y: number }[],
    shape: "line" | "rectangle" | "circle" | "ellipse" | "bezier" | "hermite"
  ): { x: number; y: number } {
    if (shape === "circle" || shape === "ellipse") {
      // For circle and ellipse, return the first point as the center
      return points[0];
    } else if (shape === "hermite") {
      // For hermite, return the center of the first and second points
      const [p1, p2] = points;
      return {
        x: (p1.x + p2.x) / 2,
        y: (p1.y + p2.y) / 2,
      };
    } else {
      // Default case: calculate the average of all points
      const sum = points.reduce(
        (acc, p) => ({
          x: acc.x + p.x,
          y: acc.y + p.y,
        }),
        { x: 0, y: 0 }
      );
  
      return {
        x: sum.x / points.length,
        y: sum.y / points.length,
      };
    }
  }
  
  export function updateControlPointsAfterRotation(
    controlPoints: { x: number; y: number }[],
    rotation: number,
    rotationCenter: { x: number; y: number }
  ): { x: number; y: number }[] {
    const angle = (rotation * Math.PI) / 180; 
  
    return controlPoints.map((point) => {
      const dx = point.x - rotationCenter.x;
      const dy = point.y - rotationCenter.y;
  
      const rotatedX = rotationCenter.x + dx * Math.cos(angle) - dy * Math.sin(angle);
      const rotatedY = rotationCenter.y + dx * Math.sin(angle) + dy * Math.cos(angle);
  
      return { x: rotatedX, y: rotatedY };
    });
  }