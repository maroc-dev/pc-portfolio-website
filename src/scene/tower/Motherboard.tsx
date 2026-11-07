import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import type { MeshStandardMaterial } from "three";
import { BOARD, PART_ANCHORS, TOWER } from "../layout";
import { materials, palette } from "../materials";
import { runtime } from "../runtime";
import { createPcbTextures } from "../textures/pcb";

const BW = BOARD.maxX - BOARD.minX;
const BH = BOARD.maxY - BOARD.minY;
const CX = (BOARD.minX + BOARD.maxX) / 2;
const CY = (BOARD.minY + BOARD.maxY) / 2;
const Z = TOWER.boardZ;

/** Idle trace glow, and how much a travelling signal adds on top. */
const TRACE_IDLE = 0.12;
const TRACE_SIGNAL = 1.6;

/** PCB with copper traces that glow when a signal runs through the machine. */
export function Motherboard() {
  const textures = useMemo(() => createPcbTextures(), []);
  const material = useRef<MeshStandardMaterial>(null);

  useEffect(
    () => () => {
      textures.map.dispose();
      textures.emissiveMap.dispose();
    },
    [textures],
  );

  useFrame(() => {
    if (!material.current) return;
    // Rises and falls as the pulse passes through (peak mid-way).
    const pulse = Math.sin(Math.PI * runtime.signal);
    material.current.emissiveIntensity = (TRACE_IDLE + pulse * TRACE_SIGNAL) * runtime.power;
  });

  const cpu = PART_ANCHORS.cpu;
  return (
    <group>
      <mesh position={[CX, CY, Z]}>
        <boxGeometry args={[BW, BH, 0.003]} />
        <meshStandardMaterial
          ref={material}
          map={textures.map}
          emissiveMap={textures.emissiveMap}
          emissive={palette.teal}
          emissiveIntensity={TRACE_IDLE}
          metalness={0.3}
          roughness={0.55}
        />
      </mesh>
      {/* VRM heatsinks hugging the socket */}
      <mesh position={[cpu.x - 0.002, cpu.y + 0.052, Z + 0.008]} material={materials.caseMetal}>
        <boxGeometry args={[0.1, 0.018, 0.014]} />
      </mesh>
      <mesh position={[cpu.x - 0.058, cpu.y - 0.005, Z + 0.008]} material={materials.caseMetal}>
        <boxGeometry args={[0.018, 0.1, 0.014]} />
      </mesh>
      {/* Rear I/O shroud */}
      <mesh position={[BOARD.minX + 0.012, cpu.y, Z + 0.012]} material={materials.darkPlastic}>
        <boxGeometry args={[0.022, 0.12, 0.022]} />
      </mesh>
      {/* Chipset heatsink */}
      <mesh position={[0.05, 0.16, Z + 0.006]} material={materials.caseMetal}>
        <boxGeometry args={[0.05, 0.05, 0.01]} />
      </mesh>
    </group>
  );
}
