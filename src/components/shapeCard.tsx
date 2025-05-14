import { Card, CardBody, Button } from "@heroui/react";
import { MdEdit, MdDelete } from "react-icons/md";
import { shapeToCommand } from "@/shapes/shapeToCommand";

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
  setCode: React.Dispatch<React.SetStateAction<string>>;
}
export default function ShapeCard({
  renderData,
  setRenderData,
  shape,
  shapeId,
  setShapeId,
  setCode,
}: FrameProps) {
  const isSelected = renderData.indexOf(shape) === shapeId;

  return (
    <div className="">
      <Card
        className={`max-w-[610px] flex flex-row items-center ${
          isSelected
            ? "bg-transparent text-white"
            : "bg-background/60 dark:bg-[#3F3F46]"
        }`}
      >
        <Button
          className="w-8"
          onPress={() => setShapeId(renderData.indexOf(shape))}
        >
          <MdEdit />
        </Button>
        <CardBody className="w-full">
          <p className="flex justify-center">{shape.shape}</p>
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
            const shapeCommand = shapeToCommand(shape);
            setCode((prev) => {
              return prev
                .split("\n")
                .filter((line) => line.trim() !== shapeCommand.trim())
                .join("\n");
            });
          }}
        >
          <MdDelete />
        </Button>
      </Card>
    </div>
  );
}
