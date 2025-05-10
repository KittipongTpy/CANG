import { Card, CardBody, Button, CardFooter, Input, Switch, Slider } from "@heroui/react";
import { MdEdit, MdDelete } from "react-icons/md";

// ...existing code...
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

export default function CustomShape({ renderData, id, setRenderData }: FrameProps) {
    return (
        <div className="w-full">
            <Card className="bg-background/60 dark:bg-[#3F3F46] w-full">
                <CardBody className="">
                    <h3 className="text-lg font-bold">{renderData[id].shape}</h3>
                    <div className="mt-2 flex flex-col space-y-2">
                        <p className="font-semibold">Control Points:</p>
                        <ul className="list-disc list-inside">
                            {renderData[id].controlPoints.map((point, index) => (
                                <div key={index} className="flex space-x-2">
                                    <div className="flex items-center">
                                        <label htmlFor={`x-coord-${index}`}>X :</label>
                                        <Input
                                            id={`x-coord-${index}`}
                                            placeholder="xxxxx"
                                            className="w-[6ch] text-center"
                                            value={String(Math.floor(point.x))}
                                            onChange={(e) => {
                                                if (isNaN(parseFloat(e.target.value))) return;
                                                const updatedData = [...renderData];
                                                updatedData[id].controlPoints[index].x = parseFloat(e.target.value);
                                                setRenderData(updatedData);
                                                // setRenderData(updatedData);
                                            }}
                                            aria-label={`X coordinate for point ${index + 1}`}
                                        />
                                    </div>
                                    <div className="flex items-center">
                                        <label htmlFor={`y-coord-${index}`}>Y :</label>
                                        <Input
                                            id={`y-coord-${index}`}
                                            placeholder="xxxxx"
                                            className="w-[6ch] text-center"
                                            value={String(Math.floor(point.y))}
                                            aria-label={`Y coordinate for point ${index + 1}`}
                                        />
                                    </div>
                                </div>
                            ))}
                        </ul>
                    </div>
                    {renderData[id].color && (
                        <div className="flex items-center">
                            <label htmlFor="shape-color" className="font-semibold mr-2">Color:</label>
                            <div className="flex items-center">
                                <Input
                                    id="shape-color"
                                    placeholder="xxxxx"
                                    className="w-[10ch] text-center"
                                    value={renderData[id].color}
                                    onChange={(e) => {
                                        const updatedData = [...renderData];
                                        updatedData[id].color = e.target.value;
                                        // setRenderData(updatedData);
                                    }}
                                    aria-label="Shape color"
                                />
                            </div>
                        </div>
                    )}
                    {renderData[id].isFilled !== undefined && (
                        <div className="flex items-center">
                            <span id="fill-label" className="font-semibold mr-2">Filled:</span>
                            <Switch
                                defaultSelected={renderData[id].isFilled}
                                size="sm"
                                aria-labelledby="fill-label"
                            />
                        </div>
                    )}
                    {renderData[id].strokeWidth && (
                        <div className="flex flex-col space-y-2">
                            <label id="stroke-width-label" className="font-semibold">Stroke Width:</label>
                            <Slider
                                className="max-w-md"
                                defaultValue={renderData[id].strokeWidth}
                                maxValue={20}
                                minValue={1}
                                step={1}
                                aria-labelledby="stroke-width-label"
                            />
                        </div>
                    )}
                </CardBody>
                <CardFooter>
                    <div className="flex justify-between w-full">
                        <Button
                            color="primary"
                            aria-label="Apply changes"
                            onPress={() => {
                                setRenderData([...renderData]); // Trigger re-render by updating state
                            }}
                        >
                            <MdEdit />Apply
                        </Button>
                        <Button color="danger" aria-label="Delete shape">
                            <MdDelete />Delete
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}