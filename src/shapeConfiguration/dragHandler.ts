export function handleMouseDown(
  e: React.MouseEvent<HTMLDivElement>,
  canvasRef: React.RefObject<HTMLCanvasElement>,
  x: number,
  y: number,
  renderData: any[],
  setDraggingPointIndex: React.Dispatch<React.SetStateAction<number | null>>,
  setStartMousePos: React.Dispatch<React.SetStateAction<{ x: number; y: number } | null>>,
  setDragging: React.Dispatch<React.SetStateAction<boolean>>,
  setId: React.Dispatch<React.SetStateAction<number | null>>,
  id: number | null
) {
  const canvas = canvasRef.current;
  if (!canvas || id === null) return;

  const rect = canvas.getBoundingClientRect();
  const mouseX = ((e.clientX - rect.left) / rect.width) * x;
  const mouseY = ((e.clientY - rect.top) / rect.height) * y;

  const selectedShape = renderData[id];
  let pointIndex = null;

  // Check if clicking on a control point
  selectedShape.controlPoints.forEach((point: { x: number; y: number }, index: number) => {
    const distance = Math.sqrt((mouseX - point.x) ** 2 + (mouseY - point.y) ** 2);
    if (distance <= 5) {
      pointIndex = index;
    }
  });

  if (pointIndex !== null) {
    setDraggingPointIndex(pointIndex);
  } else {
    setDraggingPointIndex(null);
  }

  setStartMousePos({ x: mouseX, y: mouseY });
  setDragging(true);
}

export function handleMouseMove(
  e: React.MouseEvent<HTMLDivElement>,
  canvasRef: React.RefObject<HTMLCanvasElement>,
  x: number,
  y: number,
  dragging: boolean,
  startMousePos: { x: number; y: number } | null,
  renderData: any[],
  setRenderData: React.Dispatch<React.SetStateAction<any[]>>,
  draggingPointIndex: number | null,
  id: number | null,
  setStartMousePos: React.Dispatch<React.SetStateAction<{ x: number; y: number } | null>>
) {
  if (!dragging || id === null || !startMousePos) return;

  const canvas = canvasRef.current;
  if (!canvas) return;

  const rect = canvas.getBoundingClientRect();
  const mouseX = ((e.clientX - rect.left) / rect.width) * x;
  const mouseY = ((e.clientY - rect.top) / rect.height) * y;

  const dx = mouseX - startMousePos.x;
  const dy = mouseY - startMousePos.y;

  setRenderData((prevRenderData) =>
    prevRenderData.map((shape, index) => {
      if (index !== id) return shape;

      if (draggingPointIndex !== null) {
        const updatedControlPoints = [...shape.controlPoints];
        updatedControlPoints[draggingPointIndex] = {
          x: updatedControlPoints[draggingPointIndex].x + dx,
          y: updatedControlPoints[draggingPointIndex].y + dy,
        };
        return { ...shape, controlPoints: updatedControlPoints };
      } else {
        const updatedControlPoints = shape.controlPoints.map((point: { x: number; y: number }) => ({
          x: point.x + dx,
          y: point.y + dy,
        }));
        return { ...shape, controlPoints: updatedControlPoints };
      }
    })
  );

  setStartMousePos({ x: mouseX, y: mouseY });
}

export function handleMouseUp(
  setDragging: React.Dispatch<React.SetStateAction<boolean>>,
  setDraggingPointIndex: React.Dispatch<React.SetStateAction<number | null>>,
  setStartMousePos: React.Dispatch<React.SetStateAction<{ x: number; y: number } | null>>
) {
  setDragging(false);
  setDraggingPointIndex(null);
  setStartMousePos(null);
}