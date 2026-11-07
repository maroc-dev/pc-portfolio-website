import { useMemo } from "react";
import { CatmullRomCurve3, TubeGeometry, Vector3 } from "three";
import { PART_ANCHORS, TOWER } from "../layout";
import { materials } from "../materials";
import { Fan } from "./Fan";

const cpu = PART_ANCHORS.cpu;
const Z = TOWER.boardZ;
const RADIATOR = { x: -0.02, y: 0.455, z: -0.02 };
const FAN_X = [-0.085, 0.045];

/** Top-mounted radiator with two fans, plumbed to the CPU pump. Not selectable yet. */
export function Cooling() {
  const tubes = useMemo(
    () =>
      [0, 0.012].map(
        (dz) =>
          new TubeGeometry(
            new CatmullRomCurve3([
              new Vector3(cpu.x - 0.012, cpu.y + 0.028, Z + 0.016 + dz),
              new Vector3(cpu.x - 0.045, cpu.y + 0.06, Z + 0.03 + dz),
              new Vector3(-0.13, 0.43, -0.035 + dz),
              new Vector3(-0.15, 0.445, -0.03 + dz),
            ]),
            32,
            0.0045,
            8,
          ),
      ),
    [],
  );

  return (
    <group>
      <mesh position={[RADIATOR.x, RADIATOR.y, RADIATOR.z]} material={materials.caseInner}>
        <boxGeometry args={[0.26, 0.026, 0.12]} />
      </mesh>
      {FAN_X.map((x) => (
        <Fan
          key={x}
          radius={0.05}
          position={[x, 0.43, RADIATOR.z]}
          rotation={[Math.PI / 2, 0, 0]}
          framed
          speed={3}
        />
      ))}
      {tubes.map((geometry, i) => (
        <mesh key={i} geometry={geometry} material={materials.rubber} />
      ))}
    </group>
  );
}
