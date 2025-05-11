import Splitter, { SplitDirection } from "@devbookhq/splitter";
import {
  ScrollShadow,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Tabs,
  Tab,
  ButtonGroup,
  Input,
  Switch,
  Kbd
} from "@heroui/react";
import { useEffect, useState } from "react";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import CodeMirror from "@uiw/react-codemirror";
import { FaRegCircle } from "react-icons/fa";
import { TfiLayoutLineSolid } from "react-icons/tfi";
import { MdOutlineRectangle } from "react-icons/md";
import { PiBezierCurve } from "react-icons/pi";
import { FaMousePointer } from "react-icons/fa";
import folder from "../image/folder.png";

import FrameComponent from "@/shapes/frame";
import { init } from "@/shapes/init";
import DefaultLayout from "@/layouts/default";
import { executeCommand } from "@/command/render";
import ShapeCard from "@/components/shapeCard";
import CustomShape from "@/components/customShape";
interface Shape {
  shape: "line" | "rectangle" | "circle" | "ellipse" | "bezier" | "hermite";
  controlPoints: { x: number; y: number }[];
  color?: string;
  isFilled?: boolean;
  strokeWidth?: number;
  points?: { x: number; y: number }[];
}
export default function App() {
  const [code, setCode] = useState<string>("INIT 1000 1000");
  const [frame, setFrame] = useState<{ x: number; y: number } | null>(null);
  const [codeCommand, setCodeCommand] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [shape, setShape] = useState<"mouse" | "line" | "rectangle" | "circle" | "ellipse" | "bezier" | "hermite">("mouse");
  const [fx, setFx] = useState<number>(1000);
  const [fy, setFy] = useState<number>(1000);
  const [grid, setGrid] = useState<boolean>(true);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [renderData, setRenderData] = useState<Shape[]>([]);
  const [shapeId, setShapeId] = useState<number | null>(null);

  const handleRun = () => {
    setErrorMessage(null); // Reset error message
    if (!code.trim()) {
      setErrorMessage("No command provided.");
      return;
    }
    const lines = code.trim().split(/\n/);
    const initFrame = init(lines[0]);

    if (initFrame === null) {
      setErrorMessage("Frame not initialized.");

      return;
    }
    if (typeof initFrame === "string") {
      setErrorMessage(initFrame);

      return;
    }
    const restCommand = lines.slice(1).join("\n");
    const { errors } = executeCommand(restCommand);
    console.log("error:", errors);

    if (errors.length > 0 && errors[0] !== " ") {
      setErrorMessage(errors.join(", "));
    }

    setFrame({ x: initFrame.width, y: initFrame.height });
    setCodeCommand(restCommand);
  };

  useEffect(() => {
    setErrorMessage(null); // Reset error message
  }, [code]);

  useEffect(() => {
    setFrame({ x: fx, y: fy });

  }, [fx, fy]);

  return (
    <DefaultLayout>
      <Splitter
        direction={SplitDirection.Horizontal}
        draggerClassName="custom-dragger-horizontal"
        gutterClassName="custom-gutter-horizontal"
        initialSizes={[70, 30]}
      >
        {/* ด้านซ้าย: Canvas */}
        <div className="h-full">
          <Card className="h-full">
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
              <div className="space-y-2 mb-2">
                <div className="flex space-x-2">
                  <div className="flex items-center">
                    X :
                    <Input
                      placeholder="xxxxx"
                      className="w-[6ch] text-center"
                      value={String(fx)}
                      onChange={(e) => setFx(Number(e.target.value))}
                    />
                  </div>
                  <div className="flex items-center">
                    Y :
                    <Input
                      placeholder="xxxxx"
                      className="w-[6ch] text-center"
                      value={String(fy)}
                      onChange={(e) => setFy(Number(e.target.value))}
                    />
                  </div>
                  <div className="flex items-center">
                    Grid :
                    <Switch
                      defaultSelected={grid}
                      size="sm"
                      onChange={(event) => setGrid(event.target.checked)}
                    />
                  </div>
                  <div className="flex items-center">
                    Position : <Kbd>{mousePos.x.toFixed(0)}, {mousePos.y.toFixed(0)}</Kbd>
                  </div>
                  <div className="flex items-center">
                    <Button onPress={() => setRenderData((prev) => prev.slice(0, -1))}>Back</Button>
                  </div>
                </div>
                <ButtonGroup>
                  <Button onPress={() => setShape("mouse")} isDisabled={shape === "mouse"}><FaMousePointer /></Button>
                  <Button onPress={() => setShape("circle")} isDisabled={shape === "circle"}><FaRegCircle />Circle</Button>
                  <Button onPress={() => setShape("line")} isDisabled={shape === "line"}><TfiLayoutLineSolid />Line</Button>
                  <Button onPress={() => setShape("rectangle")} isDisabled={shape === "rectangle"}><MdOutlineRectangle />Rectangle</Button>
                  <Button onPress={() => setShape("ellipse")} isDisabled={shape === "ellipse"}><FaRegCircle />Ellipse</Button>
                  <Button onPress={() => setShape("bezier")} isDisabled={shape === "bezier"}><PiBezierCurve />Bezier</Button>
                  <Button onPress={() => setShape("hermite")} isDisabled={shape === "hermite"}><PiBezierCurve />Hermite</Button>
                </ButtonGroup>
              </div>
            </CardHeader>
            <CardBody className="overflow-visible py-2 h-full">
              <ScrollShadow className="w-full h-full">
                <div className="items-center justify-center h-full">

                  {frame && (

                    <FrameComponent
                      bgColor="#FFFFFF"
                      drawData={codeCommand}
                      x={frame.x}
                      y={frame.y}
                      grid={grid}
                      setMousePos={setMousePos}
                      mousePos={mousePos}
                      shape={shape}
                      renderData={renderData}
                      setRenderData={setRenderData}
                      id={shapeId}
                      setId={setShapeId}

                    />
                  )}
                  {!frame && (
                    <p className="text-center text-gray-500">
                      No frame initialized.
                    </p>
                  )}
                </div>
              </ScrollShadow>
            </CardBody>
          </Card>
        </div>

        {/* ด้านขวา: Editor */}
        <div className="h-full pb-8">
          <Tabs aria-label="Options">
            <Tab key="Tools" className="h-full" title="Tools">
              <Card className="pt-4 h-full">
                <CardHeader className="pb-0 pt-2 px-4 flex-col items-start w-full">
                  {shapeId !== null && (
                    <CustomShape
                      renderData={renderData}
                      setRenderData={setRenderData}
                      id={shapeId}
                    />
                  )}
                </CardHeader>
                <CardBody className="overflow-visible py-2 h-full space-y-1">

                  {renderData.map((shape, index) => (
                    <ShapeCard key={index} {...shape}
                      renderData={renderData}
                      setRenderData={setRenderData}
                      shape={shape}
                      setShapeId={setShapeId}
                      shapeId={shapeId}
                    />
                  ))}
                </CardBody>
                <CardFooter className="bg-white/10 bottom-0 border-t-10 flex justify-between">

                </CardFooter>
              </Card>
            </Tab>
            <Tab key="Code" className="h-full" title="Code">
              <Card className="pt-4 h-full">
                <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                  <div className="flex flex-row items-center space-x-2">
                    <p className="font-bold text-large">Edit Your CAD Code</p>
                    <img alt="Folder Icon" className="w-6 h-6" src={folder} />
                  </div>
                </CardHeader>
                <CardBody className="overflow-visible py-2 h-full">
                  <CodeMirror
                    value={code}
                    height="100%"
                    theme={vscodeDark}
                    onChange={(value: string) => setCode(value)}
                  />
                </CardBody>
                <CardFooter className="bg-white/10 bottom-0 border-t-10 flex justify-between">
                  <pre>
                    {errorMessage && (
                      <p className="px-4 py-2 text-red-500 font-semibold text-sm flex">
                        {errorMessage}
                      </p>
                    )}
                  </pre>
                  <div>
                    <Button
                      className="flex text-sm px-8 py-2 font-semibold text-white bg-pink-500 hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-300 rounded-full shadow-md transition-all duration-300"
                      onPress={handleRun}
                    >
                      Run
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </Tab>

            <Tab key="Syntax" title="Syntax">
              <Card>
                <CardBody>
                  <ScrollShadow className="w-full h-[510px]">
                    <p>
                      {" "}
                      {/* เอาไว้เพิ่มคู่มือ syntax เช่น INIT, CIR เป็นต้น */}{" "}
                    </p>
                  </ScrollShadow>
                </CardBody>
              </Card>
            </Tab>
          </Tabs>
        </div>
      </Splitter>
    </DefaultLayout>
  );
}
