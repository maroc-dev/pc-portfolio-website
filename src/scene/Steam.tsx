import { Billboard } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Color, type ShaderMaterial } from "three";
import { prefersReducedMotion } from "@/lib/motion/use-reduced-motion";
import { runtime } from "./runtime";

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uSeed;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec3 p = position;
    // Sway grows with height, like steam drifting in still air.
    float h = uv.y;
    p.x += (sin(h * 7.0 + uTime * 1.3 + uSeed) * 0.012 + sin(h * 13.0 - uTime * 0.9) * 0.005) * h;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uSeed;
  uniform float uOpacity;
  uniform vec3 uColor;
  varying vec2 vUv;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y);
  }

  void main() {
    vec2 p = vec2(vUv.x * 2.2 + uSeed, vUv.y * 3.0 - uTime * 0.35);
    float n = noise(p) * 0.6 + noise(p * 2.3) * 0.4;
    float wisp = smoothstep(0.42, 0.85, n);
    float edges = smoothstep(0.0, 0.35, vUv.x) * smoothstep(1.0, 0.65, vUv.x);
    float fade = smoothstep(0.0, 0.12, vUv.y) * smoothstep(1.0, 0.35, vUv.y);
    float a = wisp * edges * fade * uOpacity;
    gl_FragColor = vec4(uColor, a);
  }
`;

const WISPS = [
  { seed: 0, offset: [0, 0, 0] as const, height: 0.15 },
  { seed: 2.7, offset: [0.008, 0.01, 0.004] as const, height: 0.12 },
  { seed: 5.1, offset: [-0.007, 0.005, -0.004] as const, height: 0.13 },
];

/** Gentle wisps of steam rising from the coffee. Still under reduced motion. */
export function Steam({ position }: { position: [number, number, number] }) {
  const materials = useRef<(ShaderMaterial | null)[]>([]);
  const uniforms = useMemo(
    () =>
      WISPS.map(({ seed }) => ({
        uTime: { value: 0 },
        uSeed: { value: seed },
        uOpacity: { value: 0.5 },
        uColor: { value: new Color("#ffffff") },
      })),
    [],
  );

  useFrame(({ clock }) => {
    const t = prefersReducedMotion() ? 0 : clock.elapsedTime;
    // Steam reads softer against the bright day wall, a little stronger at night.
    const opacity = 0.42 + (1 - runtime.daylight) * 0.18;
    for (const material of materials.current) {
      if (!material) continue;
      material.uniforms.uTime.value = t;
      material.uniforms.uOpacity.value = opacity;
    }
  });

  return (
    <group position={position}>
      {WISPS.map(({ seed, offset, height }, i) => (
        <Billboard key={seed} position={[offset[0], offset[1] + height / 2, offset[2]]} lockY>
          <mesh raycast={() => null} renderOrder={3}>
            <planeGeometry args={[0.045, height, 1, 24]} />
            <shaderMaterial
              ref={(m) => {
                materials.current[i] = m;
              }}
              uniforms={uniforms[i]}
              vertexShader={vertexShader}
              fragmentShader={fragmentShader}
              transparent
              depthWrite={false}
            />
          </mesh>
        </Billboard>
      ))}
    </group>
  );
}
