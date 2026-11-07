import { useEffect, useMemo } from "react";
import { CatmullRomCurve3, TubeGeometry, Vector3, type Material } from "three";
import { PART_ANCHORS, TOWER } from "../layout";
import { materials } from "../materials";
import { RADIATOR_FANS_Y, RADIATOR_FAN_RADIUS, RADIATOR_FAN_X, RADIATOR_FAN_Z } from "./radiator";

const cpu = PART_ANCHORS.cpu;
const Z = TOWER.boardZ;
const v = (x: number, y: number, z: number) => new Vector3(x, y, z);

interface CableProps {
  points: Vector3[];
  radius: number;
  material: Material;
}

/** A smooth cable through `points` (tower frame). */
export function Cable({ points, radius, material }: CableProps) {
  const geometry = useMemo(
    () => new TubeGeometry(new CatmullRomCurve3(points), 48, radius, 8),
    [points, radius],
  );
  useEffect(() => () => geometry.dispose(), [geometry]);
  return <mesh geometry={geometry} material={material} />;
}

/** Coolant loop from the CPU pump up to the radiator inlet. */
export function CoolantTubes() {
  const tubes = useMemo(
    () =>
      [0, 0.014].map((dz) => [
        v(cpu.x + 0.02, cpu.y + 0.022, Z + 0.02 + dz),
        v(cpu.x + 0.04, cpu.y + 0.06, Z + 0.035 + dz),
        v(0.09, 0.405, -0.075 + dz),
        v(0.145, 0.41, -0.05 + dz),
      ]),
    [],
  );
  return (
    <>
      {tubes.map((points, i) => (
        <Cable key={i} points={points} radius={0.0045} material={materials.rubber} />
      ))}
    </>
  );
}

/** Edge of a radiator fan frame facing into the case, offset along y from its centre. */
function fanEdge(index: number, dy: number, dz = -0.04): Vector3 {
  const frameFace = RADIATOR_FAN_X - RADIATOR_FAN_RADIUS * 0.4;
  return v(frameFace - 0.002, RADIATOR_FANS_Y[index]! + dy, RADIATOR_FAN_Z + dz);
}

/**
 * Wiring that makes the build believable: the pump's fan lead to the radiator fans, the
 * daisy-chain between fans, and the main power bundle dropping into the PSU in the plinth.
 */
export function Wiring() {
  const runs = useMemo(() => {
    const edge = RADIATOR_FAN_RADIUS * 0.9;
    return {
      pumpToFans: [
        v(cpu.x + 0.034, cpu.y - 0.004, Z + 0.016),
        v(cpu.x + 0.05, cpu.y - 0.01, Z + 0.03),
        v(0.088, 0.3, -0.06),
        fanEdge(1, edge * 0.6),
      ],
      chainTop: [fanEdge(2, -edge), v(0.095, 0.32, -0.042), fanEdge(1, edge)],
      chainBottom: [fanEdge(1, -edge), v(0.095, 0.216, -0.042), fanEdge(0, edge)],
      power: [
        v(0.098, 0.33, Z + 0.006),
        v(0.104, 0.26, -0.122),
        v(0.1, 0.17, -0.124),
        v(0.09, TOWER.plinth - 0.01, -0.12),
      ],
    };
  }, []);

  return (
    <>
      <Cable points={runs.pumpToFans} radius={0.0016} material={materials.rubber} />
      <Cable points={runs.chainTop} radius={0.0016} material={materials.rubber} />
      <Cable points={runs.chainBottom} radius={0.0016} material={materials.rubber} />
      <Cable points={runs.power} radius={0.007} material={materials.rubber} />
    </>
  );
}
