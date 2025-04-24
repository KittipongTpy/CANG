import DefaultLayout from "@/layouts/default";

import Splitter, { SplitDirection } from "@devbookhq/splitter";
import "./customGutter.css";
import {
  Snippet,
  ScrollShadow,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Tabs,
  Tab,
} from "@heroui/react";
import { useState } from "react";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import CodeMirror from "@uiw/react-codemirror";

import { getCurrentFrame } from "../shapes/init"; // Import the function to get the current frame
import { executeCommand } from "../command/index";
export default function App() {
  const [code, setCode] = useState<string>("");
  const [frame, setFrame] = useState<{ width: number; height: number } | null>(
    null
  ); // State for the frame

  const handleRun = () => {
    if (code.trim()) {
      executeCommand(code.trim());
      const updatedFrame = getCurrentFrame(); // Get the updated frame

      setFrame(updatedFrame); // Update the frame state
    } else {
      console.error("No command provided.");
    }
  };

  return (
    <DefaultLayout>
      <Splitter
        direction={SplitDirection.Horizontal}
        draggerClassName="custom-dragger-horizontal"
        gutterClassName="custom-gutter-horizontal"
        initialSizes={[60, 40]}
      >
        <div className="h-full">
          <Card className="h-full">
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
              <h4 className="font-bold text-large">CAD Canvas</h4>
            </CardHeader>
            <CardBody className="overflow-visible py-2 h-full">
              <ScrollShadow className="w-full h-full">
                {frame ? (
                  <div
                    className="border border-white"
                    style={{
                      width: `${frame.width}px`,
                      height: `${frame.height}px`,
                    }}
                  >
                    Frame: {frame.width} x {frame.height}
                  </div>
                ) : (
                  <p className="text-center text-gray-500">
                    No frame initialized.
                  </p>
                )}
              </ScrollShadow>
            </CardBody>
            <p className="font-bold text-2xl p-5">Geometric</p>
          </Card>
        </div>
        <div className="h-full pb-8">
          <Tabs aria-label="Options">
            <Tab key="Code" className="h-full" title="Code">
              <Card className="pt-4 h-full">
                <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                  <h4 className="font-bold text-large">Edit Your CAD Code</h4>
                </CardHeader>
                <CardBody className="overflow-visible py-2 h-full">
                  <CodeMirror
                    height="100%"
                    theme={vscodeDark}
                    onChange={(value: string) => setCode(value)}
                  />
                </CardBody>
                <CardFooter className="bg-white/10 bottom-0 border-t-10 flex justify-end">
                  <Button
                    className="text-tiny"
                    color="primary"
                    radius="full"
                    size="sm"
                    onClick={handleRun}
                  >
                    Run
                  </Button>
                </CardFooter>
              </Card>
            </Tab>
            <Tab key="Syntax" title="Syntax">
              <Card>
                <CardBody>
                  <ScrollShadow className="w-full h-[510px]">
                   <p></p>
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
