import {
  Card,
  CardBody,
  Button,
  CardFooter,
  Input,
  Switch,
  Slider,
} from "@heroui/react";
import { MdEdit, MdDelete } from "react-icons/md";

interface FrameProps {
  renderData: {
    shape: "line" | "rectangle" | "circle" | "ellipse" | "bezier" | "hermite";
    controlPoints: { x: number; y: number }[];
    color?: string;
    isFilled?: boolean;
    strokeWidth?: number;
  }[];
  id: number;
  setId: React.Dispatch<React.SetStateAction<number | null>>;
  setRenderData: React.Dispatch<React.SetStateAction<any[]>>;
}

export default function CustomShape({
  renderData,
  id,
  setId,
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
                      id={`x-coord-${index}`}
                      className="w-[6ch] text-center"
                      value={String(Math.floor(point.x))}
                      onChange={(e) => {
                        if (isNaN(parseFloat(e.target.value))) return;
                        const updatedData = [...renderData];
                        updatedData[id].controlPoints[index].x = parseFloat(
                          e.target.value
                        );
                        setRenderData(updatedData);
                      }}
                      aria-label={`X coordinate for point ${index + 1}`}
                    />
                  </div>
                  <div className="flex items-center">
                    <label htmlFor={`y-coord-${index}`}>Y :</label>
                    <Input
                      id={`y-coord-${index}`}
                      className="w-[6ch] text-center"
                      value={String(Math.floor(point.y))}
                      onChange={(e) => {
                        if (isNaN(parseFloat(e.target.value))) return;
                        const updatedData = [...renderData];
                        updatedData[id].controlPoints[index].y = parseFloat(
                          e.target.value
                        );
                        setRenderData(updatedData);
                      }}
                      aria-label={`Y coordinate for point ${index + 1}`}
                    />
                  </div>
                </div>
              ))}
            </ul>
          </div>

          {/* Color Picker */}
          <div className="mt-4 flex items-center space-x-2">
            <label htmlFor="shape-color" className="font-semibold">
              Select Color:
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
                onChange={(e) => {
                  const isSelected = e.target.checked;
                  const updatedData = [...renderData];
                  updatedData[id].isFilled = isSelected;
                  setRenderData(updatedData);
                }}
                size="sm"
              />
            </div>
          )}

          {/* Stroke Width Slider */}
          {renderData[id].strokeWidth !== undefined && (
            <div className="mt-4">
              <p className="font-semibold">Stroke Width:</p>
              <Slider
                className="max-w-md"
                value={renderData[id].strokeWidth}
                maxValue={20}
                minValue={1}
                step={1}
                onChange={(value) => {
                  const updatedData = [...renderData];
                  updatedData[id].strokeWidth = Array.isArray(value)
                    ? value[0]
                    : value;
                  setRenderData(updatedData);
                }}
              />
            </div>
          )}
        </CardBody>

        <CardFooter>
          <div className="flex justify-between w-full">
            <Button
              color="danger"
              aria-label="Delete shape"
              onPress={() => {
                const updatedData = renderData.filter(
                  (_, index) => index !== id
                );
                setRenderData(updatedData);
                if (id !== null) {
                  setRenderData(updatedData);
                  setId(null);
                }
              }}
            >
              <MdDelete />
              Delete
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
