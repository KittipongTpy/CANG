import { Card, CardBody, Button, CardFooter, Input, Switch, Slider } from "@heroui/react";
import { MdEdit, MdDelete } from "react-icons/md";
import InputColor from 'react-input-color';
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
    id: number;
}
export default function CustomShape({ renderData, setRenderData, id }: FrameProps) {


    return (
        <div className="w-full">
            <Card className="bg-background/60 dark:bg-[#3F3F46] w-full">
                <CardBody className="">
                    <h3 className="text-lg font-bold">{renderData[id].shape}</h3>
                    <div className="mt-2 flex flex-col space-y-2">
                        <p className="font-semibold">Control Points:</p>
                        <ul className="list-disc list-inside">
                            {renderData[id].controlPoints.map((point, index) => (
                                <div className="flex space-x-2">
                                    <div className="flex items-center">
                                        X :
                                        <Input
                                            placeholder="xxxxx"
                                            className="w-[6ch] text-center"
                                            value={String(Math.floor(point.x))}
                                        // onChange={(e) => setFx(Number(e.target.value))}
                                        />

                                    </div>
                                    <div className="flex items-center">
                                        Y :
                                        <Input
                                            placeholder="xxxxx"
                                            className="w-[6ch] text-center"
                                            value={String(Math.floor(point.y))}
                                        // onChange={(e) => setFx(Number(e.target.value))}
                                        />

                                    </div>
                                </div>


                            ))}
                        </ul>
                    </div>
                    {
                        renderData[id].color && (
                            <div className="flex items-center">
                                <span className="font-semibold mr-2">Color:</span>
                                <div className="flex items-center">
                                    <Input
                                        placeholder="xxxxx"
                                        className="w-[10ch] text-center"
                                        value={renderData[id].color}
                                    // onChange={(e) => setFx(Number(e.target.value))}
                                    />

                                </div>
                                {/* <InputColor
                                    initialValue={renderData[id].color}

                                /> */}
                            </div>


                        )
                    }
                    {
                        renderData[id].isFilled !== undefined && (
                            <div className="flex items-center ">
                                <span className="font-semibold mr-2">Filled:</span>
                                <Switch
                                    defaultSelected={renderData[id].isFilled}
                                    size="sm"

                                />
                            </div>
                        )
                    }
                    {
                        renderData[id].strokeWidth && (
                            <div className="flex items-center space-y-2">
                                <span className="font-semibold mr-2">Stroke Width:</span>
                                <Slider
                                    className="max-w-md"
                                    defaultValue={renderData[id].strokeWidth}

                                    maxValue={20}
                                    minValue={1}
                                    step={1}
                                />
                            </div>


                        )
                    }
                </CardBody>
                <CardFooter>
                    <div className="flex justify-between w-full">
                        <Button
                            color="primary"
                        >
                            <MdEdit />Apply
                        </Button>
                        <Button color="danger"><MdDelete />Delete</Button>
                    </div>
                </CardFooter>
            </Card>
        </div >
    );
}