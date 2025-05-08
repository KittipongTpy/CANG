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
} from "@heroui/react";
import { useEffect, useState } from "react";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import CodeMirror from "@uiw/react-codemirror";

import folder from "../image/folder.png";

import FrameComponent from "@/shapes/frame";
import { init } from "@/shapes/init";
import DefaultLayout from "@/layouts/default";
import { executeCommand } from "@/command/render";

export default function App() {
  const [code, setCode] = useState<string>("");
  const [frame, setFrame] = useState<{ x: number; y: number } | null>(null);
  const [codeCommand, setCodeCommand] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

  return (
    <DefaultLayout>
      <Splitter
        direction={SplitDirection.Horizontal}
        draggerClassName="custom-dragger-horizontal"
        gutterClassName="custom-gutter-horizontal"
        initialSizes={[60, 40]}
      >
        {/* ด้านซ้าย: Canvas */}
        {/* ด้านซ้าย: Canvas */}
        <div className="h-full">
          <Card className="h-full">
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
              <h4 className="font-bold text-2xl p-5">CAD Canvas</h4>
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

        {/* ด้านขวา: Editor */}
        <div className="h-full pb-8">
          <Tabs aria-label="Options">
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
                  <div className="text-sm text-white font-mono space-y-2 leading-relaxed">
                    <p><span className="font-bold text-gray-300">Starting frame size :</span></p>
                    <p className="pl-4 text-gray-400 font-medium">
                      INIT &lt;width&gt; &lt;height&gt;
                      <br />
                      <span className="text-gray-400">Ex. INIT 100 100</span>
                    </p>

                    <p className="mt-3"><span className="font-bold text-gray-300">Shape drawing command :</span></p>
                    <p className="pl-4 text-gray-400 font-medium">
                      LIN &lt;x1&gt; &lt;y1&gt; &lt;x2&gt; &lt;y2&gt;
                      <br />
                      <span className="text-gray-400">Ex. LIN 15 10 55 60</span>
                    </p>
                    <p className="pl-4 text-gray-400 font-medium">
                      CIR &lt;center x&gt; &lt;center y&gt; &lt;radius&gt;
                      <br />
                      <span className="text-gray-400">Ex. CIR 50 50 10</span>
                    </p>
                    <p className="pl-4 text-gray-400 font-medium">
                      ELI &lt;center x&gt; &lt;center y&gt; &lt;a&gt; &lt;b&gt;
                      <br />
                      <span className="text-gray-400">Ex. ELI 30 30 10 20</span>
                    </p>
                    <p className="pl-4 text-gray-400 font-medium">
                      REC &lt;x1&gt; &lt;y1&gt; &lt;x2&gt; &lt;y2&gt;
                      <br />
                      <span className="text-gray-400">Ex. REC 10 10 55 60</span>
                    </p>
                    <p className="pl-4 text-gray-400 font-medium">
                      HER &lt;x1&gt; &lt;y1&gt; &lt;x2&gt; &lt;y2&gt; &lt;R1x&gt; &lt;R1y&gt; &lt;R2x&gt; &lt;R2y&gt;
                      <br />
                      <span className="text-gray-400">Ex. HER 1 1 90 80 25 35 75 85</span>
                    </p>
                    <p className="pl-4 text-gray-400 font-medium">
                      BEZ &lt;x0&gt; &lt;y0&gt; &lt;x1&gt; &lt;y1&gt; &lt;x2&gt; &lt;y2&gt; &lt;x3&gt; &lt;y3&gt;
                      <br />
                      <span className="text-gray-400">Ex. BEZ 20 20 85 95 50 35 15 10</span>
                    </p>

                    <p className="mt-3"><span className="font-bold text-gray-300">Custom color and border :</span></p>
                    <p className="pl-4 text-gray-400 font-medium">
                      FIL &lt;colorname&gt;
                      <br />
                      <span className="text-gray-400">Ex. CIR 50 50 10 FIL red</span>
                    </p>
                    <p className="pl-4 text-gray-400 font-medium">
                      BOR &lt;stroke width&gt;
                      <br />
                      <span className="text-gray-400">Ex. REC 10 10 55 60 BOR 4</span>
                    </p>
                  </div>
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
