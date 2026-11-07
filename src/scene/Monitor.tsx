import { RoundedBox } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { MeshBasicMaterial } from "three";
import { prefersReducedMotion } from "@/lib/motion/use-reduced-motion";
import { experienceStore, type ScreenRect } from "@/state/experience-store";
import { MONITOR } from "./layout";
import { materials, palette } from "./materials";
import { SCREEN_CORNERS, projectRect, rectChanged } from "./screen-rect";
import { createIdleScreen } from "./textures/idle-screen";

const { screenCenter: C, screenWidth: SW, screenHeight: SH, bezel: B, depth: D } = MONITOR;
const CHIN = 0.014;

export function Monitor() {
  const screen = useMemo(() => createIdleScreen(), []);
  const screenMaterial = useMemo(
    () => new MeshBasicMaterial({ map: screen.texture, toneMapped: false }),
    [screen],
  );

  useEffect(
    () => () => {
      screen.dispose();
      screenMaterial.dispose();
    },
    [screen, screenMaterial],
  );

  const published = useRef<ScreenRect | null>(null);

  useFrame(({ clock, camera, size }) => {
    screen.setCursor(prefersReducedMotion() || Math.floor(clock.elapsedTime * 1.6) % 2 === 0);

    // Tell the interface where the screen is so the content window can sit exactly on it.
    const { selected, setScreenRect } = experienceStore.getState();
    if (!selected) {
      if (published.current) {
        published.current = null;
        setScreenRect(null);
      }
      return;
    }
    const rect = projectRect(SCREEN_CORNERS, camera, size);
    if (rectChanged(published.current, rect)) {
      published.current = rect;
      setScreenRect(rect);
    }
  });

  const panelZ = C.z - D / 2;
  return (
    <group>
      <RoundedBox
        args={[SW + B * 2, SH + B * 2 + CHIN, D]}
        radius={0.008}
        smoothness={3}
        position={[C.x, C.y - CHIN / 2, panelZ]}
        material={materials.darkPlastic}
      />
      <mesh position={[C.x, C.y, C.z + 0.0005]} material={screenMaterial}>
        <planeGeometry args={[SW, SH]} />
      </mesh>
      {/* Stand */}
      <mesh position={[C.x, 0.17, panelZ - D / 2 - 0.012]} material={materials.aluminium}>
        <boxGeometry args={[0.055, 0.34, 0.012]} />
      </mesh>
      <RoundedBox
        args={[0.26, 0.008, 0.17]}
        radius={0.004}
        smoothness={2}
        position={[C.x, 0.004, panelZ - 0.03]}
        material={materials.aluminium}
      />
      {/* Bias light behind the monitor washes the wall in warm light. */}
      <pointLight
        position={[C.x, C.y, panelZ - 0.08]}
        color={palette.amber}
        intensity={0.9}
        distance={1.4}
        decay={2}
      />
      {/* Screen spill onto the keyboard. */}
      <pointLight
        position={[C.x, C.y - 0.05, C.z + 0.18]}
        color="#ffe2c4"
        intensity={0.12}
        distance={0.8}
        decay={2}
      />
    </group>
  );
}
