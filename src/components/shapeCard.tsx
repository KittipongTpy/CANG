import { Card, CardBody, Button } from "@heroui/react";
import { MdEdit, MdDelete } from "react-icons/md";
interface Shape {
  shape: "line" | "rectangle" | "circle" | "ellipse" | "bezier" | "hermite";
  controlPoints: { x: number; y: number }[];
  color?: string;
  isFilled?: boolean;
  strokeWidth?: number;
}
interface FrameProps {
  renderData: Shape[];
  setRenderData: React.Dispatch<React.SetStateAction<Shape[]>>;
  shape: Shape;
  setShapeId: React.Dispatch<React.SetStateAction<number | null>>;
  shapeId: number | null;
}
export default function ShapeCard({
  renderData,
  setRenderData,
  shape,
  shapeId,
  setShapeId,
}: FrameProps) {
  return (
    <div className="">
      <Card className="border-none bg-background/60 dark:bg-[#3F3F46] max-w-[610px] flex flex-row items-center padding-2">
        <Button
          className="w-8"
          onPress={() => setShapeId(renderData.indexOf(shape))}
        >
          <MdEdit />
        </Button>
        <CardBody>
          <p>{shape.shape}</p>
        </CardBody>
        <Button
          onPress={() => {
            const updatedData = renderData.filter((item) => item !== shape);

            setRenderData(updatedData);
            const currentIndex = renderData.indexOf(shape);

            if (currentIndex === shapeId) {
              setShapeId(null);
            } else if (shapeId !== null && currentIndex < shapeId) {
              setShapeId(shapeId - 1);
            }
          }}
        >
          <MdDelete />
        </Button>
      </Card>
    </div>
  );
}
