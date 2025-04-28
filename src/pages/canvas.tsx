import DefaultLayout from "@/layouts/default";
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
import { useRef, useState } from "react";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import CodeMirror from "@uiw/react-codemirror";
import * as THREE from "three";

import folder from "../image/folder.png";
import { getCurrentFrame } from "../shapes/init";
import { executeCommand } from "../command/index";

export default function App() {
  const [code, setCode] = useState<string>("");
  const [frame, setFrame] = useState<{ width: number; height: number } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const mountRef = useRef<HTMLDivElement>(null); 

  const handleRun = () => {
    if (!code.trim()) {
      setErrorMessage("No command provided.");
      return;
    }
    const { errors, drawData } = executeCommand(code.trim());
    if (errors.length > 0) {
      setErrorMessage(errors.join("\n"));
      return;
    }
    const updatedFrame = getCurrentFrame();
    if (!updatedFrame) {
      setErrorMessage("Frame not initialized.");
      return;
    }
    setFrame(updatedFrame); // อัปเดต Frame เพื่อ render div ขนาดถูกต้อง
    setErrorMessage(null);

    if (mountRef.current) {
      const scene = new THREE.Scene();

      const camera = new THREE.OrthographicCamera(
        -updatedFrame.width / 2, updatedFrame.width / 2,
        updatedFrame.height / 2, -updatedFrame.height / 2,
        1, 1000
      );
      camera.position.z = 10;
      const renderer = new THREE.WebGLRenderer({ alpha: true });
      renderer.setSize(updatedFrame.width, updatedFrame.height);

      mountRef.current.innerHTML = ""; // ล้าง div เดิม
      mountRef.current.appendChild(renderer.domElement); // ใส่ WebGL Canvas ใหม่
      // --------- วาดแกน X และ Y -------------
      const axisMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });

      // แกน X (แนวนอน)
      const pointsX = [
        new THREE.Vector3(-updatedFrame.width / 2, 0, 0),
        new THREE.Vector3(updatedFrame.width / 2, 0, 0),
      ];
      const geometryX = new THREE.BufferGeometry().setFromPoints(pointsX);
      scene.add(new THREE.Line(geometryX, axisMaterial));

      // แกน Y (แนวตั้ง)
      const pointsY = [
        new THREE.Vector3(0, -updatedFrame.height / 2, 0),
        new THREE.Vector3(0, updatedFrame.height / 2, 0),
      ];
      const geometryY = new THREE.BufferGeometry().setFromPoints(pointsY);
      scene.add(new THREE.Line(geometryY, axisMaterial));
      // วาดวงกลม (จาก drawData)
      drawData.forEach((item) => {
        if (item.type === "circle") {
          if (item.points && item.points.length > 0) {
            item.points.forEach(([x, y]) => {
              const geometry = new THREE.CircleGeometry(1, 8);
              const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
              const mesh = new THREE.Mesh(geometry, material);
              mesh.position.set(x, y, 0);
              scene.add(mesh);
            });
          }
        }
      });

      // ✅ render หลังวาดครบทั้งหมด
      renderer.render(scene, camera);
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
        {/* ด้านซ้าย: Canvas */}
        <div className="h-full">
          <Card className="h-full">
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
              <h4 className="font-bold text-2xl p-5">CAD Canvas</h4>
            </CardHeader>
            <CardBody className="overflow-visible py-2 h-full">
              <ScrollShadow className="w-full h-full">
                {frame ? (
                  <div
                    ref={mountRef}
                    className="border border-white"
                    style={{
                      width: `${frame.width}px`,
                      height: `${frame.height}px`,
                    }}
                  />
                ) : (
                  <p className="text-center text-gray-500">
                    No frame initialized.
                  </p>
                )}
              </ScrollShadow>
            </CardBody>
          </Card>
        </div>

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
                    <p> {/* เอาไว้เพิ่มคู่มือ syntax เช่น INIT, CIR เป็นต้น */} </p>
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
