import { useMemo } from "react";
import { CatmullRomCurve3, TubeGeometry, Vector3 } from "three";
import { PART_ANCHORS, TOWER } from "../layout";
import { materials } from "../materials";
import { Fan } from "./Fan";

const cpu = PART_ANCHORS.cpu;
const Z = TOWER.boardZ;
const FAN_Y = [0.14, 0.255, 0.37];
const FAN_X = 0.122;

/** 360 mm radiator on the right side with three fans, plumbed to the CPU pump. */
export function Cooling() {
  const tubes = useMemo(
    () =>
      [0, 0.014].map(
        (dz) =>
          new TubeGeometry(
            new CatmullRomCurve3([
              new Vector3(cpu.x + 0.02, cpu.y + 0.022, Z + 0.02 + dz),
              new Vector3(cpu.x + 0.04, cpu.y + 0.06, Z + 0.035 + dz),
              new Vector3(0.09, 0.405, -0.075 + dz),
              new Vector3(0.145, 0.408, -0.05 + dz),
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
      <mesh position={[0.156, 0.255, -0.01]} material={materials.caseInner}>
        <boxGeometry args={[0.026, 0.36, 0.125]} />
      </mesh>
      {FAN_Y.map((y) => (
        <Fan
          key={y}
          radius={0.054}
          position={[FAN_X, y, -0.01]}
          rotation={[0, -Math.PI / 2, 0]}
          ring={materials.ledAmber}
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
