import { useFrame } from "@react-three/fiber";
import { WALL_Z, WINDOW } from "../layout";
import { materials } from "../materials";
import { runtime } from "../runtime";
import { SCENE_THEME, blend } from "../theme";
import { Sky } from "./Sky";

const T = 0.04;
const Z = WALL_Z - T / 2;
const SPAN = { x0: -3.5, x1: 3.5, y0: -1, y1: 3 } as const;
const FRAME = 0.035;
const FRAME_DEPTH = 0.07;

interface SlabProps {
  x0: number;
  x1: number;
  y0: number;
  y1: number;
}

/** A piece of wall between the given edges; the wall is built around the window opening. */
function WallSlab({ x0, x1, y0, y1 }: SlabProps) {
  return (
    <mesh position={[(x0 + x1) / 2, (y0 + y1) / 2, Z]} material={materials.wall}>
      <boxGeometry args={[x1 - x0, y1 - y0, T]} />
    </mesh>
  );
}

function Bar({
  position,
  size,
}: {
  position: [number, number, number];
  size: [number, number, number];
}) {
  return (
    <mesh position={position} material={materials.paint}>
      <boxGeometry args={size} />
    </mesh>
  );
}

/**
 * Back wall with a real opening, so the sun casts the window frame's shadow across the desk.
 * The wall colour follows the theme: soft blue by day, deep navy at night.
 */
export function Room() {
  useFrame(() => {
    blend(materials.wall.color, SCENE_THEME.night.wall, SCENE_THEME.day.wall, runtime.daylight);
  });

  const { x0, x1, y0, y1 } = WINDOW;
  const cx = (x0 + x1) / 2;
  const cy = (y0 + y1) / 2;
  const w = x1 - x0;
  const h = y1 - y0;
  const fz = WALL_Z - FRAME_DEPTH / 2 + 0.012;

  return (
    <group>
      <WallSlab x0={SPAN.x0} x1={x0} y0={SPAN.y0} y1={SPAN.y1} />
      <WallSlab x0={x1} x1={SPAN.x1} y0={SPAN.y0} y1={SPAN.y1} />
      <WallSlab x0={x0} x1={x1} y0={SPAN.y0} y1={y0} />
      <WallSlab x0={x0} x1={x1} y0={y1} y1={SPAN.y1} />

      {/* Painted frame, mullions and sill */}
      <Bar position={[cx, y1 - FRAME / 2, fz]} size={[w, FRAME, FRAME_DEPTH]} />
      <Bar position={[cx, y0 + FRAME / 2, fz]} size={[w, FRAME, FRAME_DEPTH]} />
      <Bar position={[x0 + FRAME / 2, cy, fz]} size={[FRAME, h, FRAME_DEPTH]} />
      <Bar position={[x1 - FRAME / 2, cy, fz]} size={[FRAME, h, FRAME_DEPTH]} />
      <Bar position={[cx, cy, fz]} size={[0.022, h, 0.04]} />
      <Bar position={[cx, cy + 0.06, fz]} size={[w, 0.022, 0.04]} />
      <Bar position={[cx, y0 - 0.012, WALL_Z + 0.035]} size={[w + 0.08, 0.024, 0.1]} />

      <Sky />
    </group>
  );
}
