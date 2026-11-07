import { useFrame } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef } from "react";
import { MeshBasicMaterial, Object3D, type InstancedMesh } from "three";
import { materials, palette } from "./materials";
import { runtime } from "./runtime";

const KEY = 0.024;
const PITCH = 0.0285;
const COLS = 15;

/** Key layout as widths in key units; row 4 has a space bar. */
const ROWS: number[][] = [
  Array(COLS).fill(1),
  Array(COLS).fill(1),
  Array(COLS).fill(1),
  Array(COLS).fill(1),
  [1.25, 1.25, 1.25, 6.75, 1.25, 1.25, 1.25, 1],
];

const backlight = new MeshBasicMaterial({
  color: palette.glow,
  transparent: true,
  opacity: 0,
  toneMapped: false,
});
/** Backlight strength at night; off in daylight. */
const BACKLIGHT_NIGHT = 0.28;

function keyTransforms() {
  const dummy = new Object3D();
  const matrices = [];
  const width = COLS * PITCH;
  for (const [row, keys] of ROWS.entries()) {
    let x = -width / 2;
    for (const units of keys) {
      const span = units * PITCH;
      dummy.position.set(x + span / 2, 0, (row - 2) * PITCH);
      dummy.scale.set((span - (PITCH - KEY)) / KEY, 1, 1);
      dummy.updateMatrix();
      matrices.push(dummy.matrix.clone());
      x += span;
    }
  }
  return matrices;
}

export function Keyboard() {
  const keys = useRef<InstancedMesh>(null);
  const matrices = useMemo(() => keyTransforms(), []);

  useFrame(() => {
    backlight.opacity = BACKLIGHT_NIGHT * (1 - runtime.daylight);
  });

  useLayoutEffect(() => {
    const mesh = keys.current;
    if (!mesh) return;
    matrices.forEach((m, i) => mesh.setMatrixAt(i, m));
    mesh.instanceMatrix.needsUpdate = true;
  }, [matrices]);

  return (
    <group position={[-0.3, 0.003, 0.27]} rotation={[0.04, 0.05, 0]}>
      <mesh position={[0, 0.008, 0]} material={materials.caseWhite}>
        <boxGeometry args={[COLS * PITCH + 0.02, 0.016, ROWS.length * PITCH + 0.02]} />
      </mesh>
      <mesh position={[0, 0.0162, 0]} rotation={[-Math.PI / 2, 0, 0]} material={backlight}>
        <planeGeometry args={[COLS * PITCH, ROWS.length * PITCH]} />
      </mesh>
      <instancedMesh
        ref={keys}
        args={[undefined, materials.keycap, matrices.length]}
        position={[0, 0.021, 0]}
      >
        <boxGeometry args={[KEY, 0.009, KEY]} />
      </instancedMesh>
      {/* Mouse */}
      <mesh
        position={[0.33, 0.006, 0.01]}
        rotation={[Math.PI / 2, 0, 0.12]}
        scale={[1, 1, 0.55]}
        material={materials.caseWhite}
      >
        <capsuleGeometry args={[0.022, 0.05, 8, 16]} />
      </mesh>
    </group>
  );
}
