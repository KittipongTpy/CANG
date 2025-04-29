import * as THREE from "three";
import type { DrawData } from "../command/index";

export function renderCanvas(
  mountElement: HTMLElement,
  frame: { width: number; height: number },
  drawData: DrawData[]
): void {
  const scene = new THREE.Scene();

  const camera = new THREE.OrthographicCamera(
    -frame.width / 2,
    frame.width / 2,
    frame.height / 2,
    -frame.height / 2,
    1,
    1000
  );

  camera.position.z = 10;
  const renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(frame.width, frame.height);

  mountElement.innerHTML = ""; // ล้าง div เดิม
  mountElement.appendChild(renderer.domElement); // ใส่ WebGL Canvas ใหม่

  // วาดแกน X และ Y
  const axisMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });

  // แกน X (แนวนอน)
  const pointsX = [
    new THREE.Vector3(-frame.width / 2, 0, 0),
    new THREE.Vector3(frame.width / 2, 0, 0),
  ];
  const geometryX = new THREE.BufferGeometry().setFromPoints(pointsX);
  scene.add(new THREE.Line(geometryX, axisMaterial));

  // แกน Y (แนวตั้ง)
  const pointsY = [
    new THREE.Vector3(0, -frame.height / 2, 0),
    new THREE.Vector3(0, frame.height / 2, 0),
  ];
  const geometryY = new THREE.BufferGeometry().setFromPoints(pointsY);
  scene.add(new THREE.Line(geometryY, axisMaterial));

  // วาดรูปทรงจาก drawData
  drawData.forEach((item) => {
    if (item.type === "circle") {
      item.points?.forEach(([x, y]) => {
        const geometry = new THREE.CircleGeometry(1, 8);
        const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x, y, 0);
        scene.add(mesh);
      });
    } else if (item.type === "ellipse") {
      item.points?.forEach(([x, y]) => {
        const geometry = new THREE.CircleGeometry(1, 8);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ffff });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x, y, 0);
        scene.add(mesh);
      });
    } else if (item.type === "line") {
      item.points?.forEach(([x, y]) => {
        const geometry = new THREE.CircleGeometry(1, 8);
        const material = new THREE.MeshBasicMaterial({ color: 0xff00ff });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x, y, 0);
        scene.add(mesh);
      });
    }
  });

  // render หลังวาดครบหมด
  renderer.render(scene, camera);
}