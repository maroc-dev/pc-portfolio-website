import { Environment, Lightformer } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Color, Object3D, type DirectionalLight, type Fog, type HemisphereLight } from "three";
import { SUN_DIRECTION, SUN_TARGET } from "./layout";
import { runtime } from "./runtime";
import { SCENE_THEME, blend, mix } from "./theme";

const { day, night } = SCENE_THEME;
const SUN_DISTANCE = 4;

/**
 * Sunlight through the window (moonlight at night) as the shadow-casting key, a sky/floor
 * hemisphere fill, and a Lightformer environment for reflections. Everything blends with
 * `runtime.daylight`. The lamp's warm light lives in Lamp.tsx.
 */
export function Lighting({ shadows }: { shadows: boolean }) {
  const sun = useRef<DirectionalLight>(null);
  const hemi = useRef<HemisphereLight>(null);
  const target = useMemo(() => {
    const object = new Object3D();
    object.position.copy(SUN_TARGET);
    return object;
  }, []);
  const sunPosition = useMemo(
    () => SUN_TARGET.clone().addScaledVector(SUN_DIRECTION, -SUN_DISTANCE),
    [],
  );

  useFrame(({ scene: s }) => {
    const t = runtime.daylight;
    if (s.background instanceof Color) blend(s.background, night.background, day.background, t);
    if (s.fog) blend((s.fog as Fog).color, night.background, day.background, t);
    s.environmentIntensity = mix(night.environment, day.environment, t);
    if (sun.current) {
      blend(sun.current.color, night.sun, day.sun, t);
      sun.current.intensity = mix(night.sunIntensity, day.sunIntensity, t);
    }
    if (hemi.current) {
      blend(hemi.current.color, night.hemiSky, day.hemiSky, t);
      blend(hemi.current.groundColor, night.hemiGround, day.hemiGround, t);
      hemi.current.intensity = mix(night.hemiIntensity, day.hemiIntensity, t);
    }
  });

  return (
    <>
      <hemisphereLight ref={hemi} />
      <primitive object={target} />
      <directionalLight
        ref={sun}
        position={sunPosition}
        target={target}
        castShadow={shadows}
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
        shadow-camera-left={-1.6}
        shadow-camera-right={1.6}
        shadow-camera-top={1.6}
        shadow-camera-bottom={-1.6}
        shadow-camera-near={0.5}
        shadow-camera-far={8}
      />
      <Environment resolution={128} frames={1}>
        <Lightformer
          form="rect"
          intensity={1.6}
          color="#eaf3ff"
          position={[-1.5, 2, 1.5]}
          scale={[3, 1.2, 1]}
          target={[0, 0, 0]}
        />
        <Lightformer
          form="rect"
          intensity={0.8}
          color="#fff1dc"
          position={[-1, 1, -1.5]}
          scale={[1, 1, 1]}
          target={[0, 0, 0]}
        />
        <Lightformer
          form="rect"
          intensity={0.5}
          color="#bcd6ff"
          position={[2, 0.8, 1.5]}
          scale={[1, 2, 1]}
          target={[0, 0, 0]}
        />
      </Environment>
    </>
  );
}
