import {
  Card,
  CardBody,
  Button,
  CardFooter,
  Input,
  Switch,
  Slider,
} from "@heroui/react";
import { MdDelete } from "react-icons/md";

interface FrameProps {
  renderData: {
    shape: "line" | "rectangle" | "circle" | "ellipse" | "bezier" | "hermite";
    controlPoints: { x: number; y: number }[];
    color?: string;
    isFilled?: boolean;
    strokeWidth?: number;
  }[];
  id: number;
  setRenderData: React.Dispatch<React.SetStateAction<any[]>>;
}

export default function CustomShape({
  renderData,
  id,
  setRenderData,
}: FrameProps) {
  return (
    <div className="w-full">
      <Card className="bg-background/60 dark:bg-[#3F3F46] w-full">
        <CardBody>
          <h3 className="text-lg font-bold">{renderData[id].shape}</h3>

          {/* Control Points */}
          <div className="mt-2 flex flex-col space-y-2">
            <p className="font-semibold">Control Points:</p>
            <ul className="list-disc list-inside">
              {renderData[id].controlPoints.map((point, index) => (
                <div key={index} className="flex space-x-2">
                  <div className="flex items-center">
                    <label htmlFor={`x-coord-${index}`}>X :</label>
                    <Input
                      aria-label={`X coordinate for point ${index + 1}`}
                      className="w-[6ch] text-center"
                      id={`x-coord-${index}`}
                      value={String(Math.floor(point.x))}
                      onChange={(e) => {
                        if (isNaN(parseFloat(e.target.value))) return;
                        const updatedData = [...renderData];

                        updatedData[id].controlPoints[index].x = parseFloat(
                          e.target.value,
                        );
                        setRenderData(updatedData);
                      }}
                    />
                  </div>
                  <div className="flex items-center">
                    <label htmlFor={`y-coord-${index}`}>Y :</label>
                    <Input
                      aria-label={`Y coordinate for point ${index + 1}`}
                      className="w-[6ch] text-center"
                      id={`y-coord-${index}`}
                      value={String(Math.floor(point.y))}
                      onChange={(e) => {
                        if (isNaN(parseFloat(e.target.value))) return;
                        const updatedData = [...renderData];

                        updatedData[id].controlPoints[index].y = parseFloat(
                          e.target.value,
                        );
                        setRenderData(updatedData);
                      }}
                    />
                  </div>
                </div>
              ))}
            </ul>
          </div>

          {/* Color Picker */}
          <div className="mt-4 flex items-center space-x-2">
            <label className="font-semibold" htmlFor="shape-color">
              เลือกสี:
            </label>
            <Input
              id="shape-color"
              type="color"
              value={renderData[id].color || "#000000"}
              onChange={(e) => {
                const updatedData = [...renderData];

                updatedData[id].color = e.target.value;
                setRenderData(updatedData);
              }}
            />
          </div>

          {/* Fill Switch */}
          {renderData[id].isFilled !== undefined && (
            <div className="mt-4 flex items-center space-x-2">
              <span className="font-semibold">Filled:</span>
              <Switch
                isSelected={renderData[id].isFilled}
                size="sm"
                onChange={(isSelected) => {
                  const updatedData = [...renderData];

                  updatedData[id].isFilled = isSelected;
                  setRenderData(updatedData);
                }}
              />
            </div>
          )}

          {/* Stroke Width Slider */}
          {renderData[id].strokeWidth !== undefined && (
            <div className="mt-4">
              <label className="font-semibold">Stroke Width:</label>
              <Slider
                className="max-w-md"
                maxValue={20}
                minValue={1}
                step={1}
                value={renderData[id].strokeWidth}
                onChange={(value) => {
                  const updatedData = [...renderData];

                  updatedData[id].strokeWidth = value;
                  setRenderData(updatedData);
                }}
              />
            </div>
          )}
        </CardBody>

        <CardFooter>
          <div className="flex justify-between w-full">
            <Button aria-label="Delete shape" color="danger">
              <MdDelete />
              Delete
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
