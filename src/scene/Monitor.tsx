import { RoundedBox } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import type { Mesh, MeshBasicMaterial, PointLight } from "three";
import { prefersReducedMotion } from "@/lib/motion/use-reduced-motion";
import { experienceStore, useExperience, type ScreenRect } from "@/state/experience-store";
import { holdIntro } from "./intro/readiness";
import { MONITOR } from "./layout";
import { materials, palette } from "./materials";
import { runtime } from "./runtime";
import { SCREEN_CORNERS, projectRect, rectChanged } from "./screen-rect";
import { createIdleScreen } from "./textures/idle-screen";

const { screenCenter: C, screenWidth: SW, screenHeight: SH, bezel: B, depth: D } = MONITOR;
const CHIN = 0.01;
const BIAS_NIGHT = 1.1;
/** Brightness of a switched-off screen: a dark panel, not pure black. */
const SCREEN_OFF = 0.04;

/** Slim monitor with a crisp, themed idle desktop and a blue bias light for night. */
export function Monitor() {
  const maxAnisotropy = useThree((s) => s.gl.capabilities.getMaxAnisotropy());
  const cursor = useRef<Mesh>(null);
  const bias = useRef<PointLight>(null);
  const panel = useRef<MeshBasicMaterial>(null);
  const published = useRef<ScreenRect | null>(null);

  const quality = useExperience((s) => s.quality);
  // 3072 × 1920 on capable devices; 2048 × 1280 on phones and weaker GPUs to save memory.
  const screen = useMemo(
    () => createIdleScreen(experienceStore.getState().theme, quality === "high" ? 1.2 : 0.8),
    [quality],
  );

  useEffect(() => {
    // The opening waits for the final screen so it never redraws mid-animation.
    const release = holdIntro();
    void screen.ready.then(release);
    const unsubscribe = experienceStore.subscribe((state, prev) => {
      if (state.theme !== prev.theme) screen.setTheme(state.theme);
    });
    return () => {
      release();
      unsubscribe();
      screen.dispose();
    };
  }, [screen]);

  useFrame(({ clock, camera, size }) => {
    // Blinking text cursor, placed from where the texture drew the greeting.
    const rect = screen.cursor;
    if (cursor.current) {
      cursor.current.position.set(
        C.x - SW / 2 + (rect.x + rect.width / 2) * SW,
        C.y + SH / 2 - (rect.y + rect.height / 2) * SH,
        C.z + 0.001,
      );
      cursor.current.scale.set(rect.width * SW, rect.height * SH, 1);
      cursor.current.visible =
        runtime.screen > 0.95 &&
        (prefersReducedMotion() || Math.floor(clock.elapsedTime * 1.6) % 2 === 0);
    }
    if (bias.current) bias.current.intensity = BIAS_NIGHT * (1 - runtime.daylight) * runtime.screen;
    // The screen fades up from black as the machine wakes.
    panel.current?.color.setScalar(SCREEN_OFF + (1 - SCREEN_OFF) * runtime.screen);

    // Tell the interface where the screen is so the content window can sit exactly on it.
    const { selected, setScreenRect } = experienceStore.getState();
    if (!selected) {
      if (published.current) {
        published.current = null;
        setScreenRect(null);
      }
      return;
    }
    const projected = projectRect(SCREEN_CORNERS, camera, size);
    if (rectChanged(published.current, projected)) {
      published.current = projected;
      setScreenRect(projected);
    }
  });

  const panelZ = C.z - D / 2;
  return (
    <group>
      <RoundedBox
        args={[SW + B * 2, SH + B * 2 + CHIN, D]}
        radius={0.006}
        smoothness={3}
        position={[C.x, C.y - CHIN / 2, panelZ]}
        material={materials.darkPlastic}
      />
      <mesh position={[C.x, C.y, C.z + 0.0005]}>
        <planeGeometry args={[SW, SH]} />
        <meshBasicMaterial
          ref={panel}
          map={screen.texture}
          map-anisotropy={maxAnisotropy}
          toneMapped={false}
        />
      </mesh>
      <mesh ref={cursor}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial color={palette.glow} toneMapped={false} />
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
      {/* Bias light behind the monitor: a soft blue halo on the wall at night. */}
      <pointLight
        ref={bias}
        position={[C.x, C.y, panelZ - 0.08]}
        color={palette.glow}
        intensity={0}
        distance={1.4}
        decay={2}
      />
    </group>
  );
}
