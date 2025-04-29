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
import { useEffect, useRef, useState } from "react";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import CodeMirror from "@uiw/react-codemirror";

import folder from "../image/folder.png";
import FrameComponent from "@/shapes/frame";
import { init } from "@/shapes/init";


import DefaultLayout from "@/layouts/default";

export default function App() {
  const [code, setCode] = useState<string>("");
  const [frame, setFrame] = useState<{ x: number; y: number } | null>(
    null
  );
  const [codeCommand, setCodeCommand] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleRun = () => {
    setErrorMessage(null); // Reset error message
    if (!code.trim()) {
      setErrorMessage("No command provided.");
      return;
    }

    const initFrame = init(code.trim().split(/\n/)[0]);
    if (initFrame === null) {
      setErrorMessage("Frame not initialized.");
      return;
    }
    if (typeof initFrame === "string") {
      setErrorMessage(initFrame);
      return;
    } else {
      setFrame({ x: initFrame.width, y: initFrame.height });
      setCodeCommand(code.trim().split(/\n/).slice(1).join("\n"));
    };
  };

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
                      x={frame.x}
                      y={frame.y}
                      bgColor="#FFFFFF"
                      drawData={codeCommand}
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
                      <p className="px-4 py-2 text-red-500 font-semibold text-sm">
                        {errorMessage}
                      </p>
                    )}
                  </pre>
                  <div>
                    <Button
                      className="text-sm px-8 py-2 font-semibold text-white bg-pink-500 hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-300 rounded-full shadow-md transition-all duration-300"
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
