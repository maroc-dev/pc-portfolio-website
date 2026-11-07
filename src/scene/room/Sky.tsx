import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { ShaderMaterial } from "three";
import { WALL_Z, WINDOW } from "../layout";
import { runtime } from "../runtime";

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

/** Day: soft blue gradient with a sun glow. Night: navy with stars and a moon glow. */
const fragmentShader = /* glsl */ `
  uniform float uDaylight;
  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  void main() {
    vec3 dayTop = vec3(0.47, 0.70, 0.95);
    vec3 dayLow = vec3(0.90, 0.95, 1.0);
    vec3 nightTop = vec3(0.03, 0.05, 0.12);
    vec3 nightLow = vec3(0.10, 0.15, 0.30);
    vec3 day = mix(dayLow, dayTop, smoothstep(0.0, 1.0, vUv.y));
    vec3 night = mix(nightLow, nightTop, smoothstep(0.0, 1.0, vUv.y));

    vec2 glowAt = vec2(0.2, 0.85);
    float glow = exp(-distance(vUv, glowAt) * 6.0);
    day += vec3(1.0, 0.95, 0.85) * glow * 0.9;
    night += vec3(0.6, 0.7, 1.0) * glow * 0.35;

    // Small round stars on a fine grid, fading towards the horizon.
    vec2 grid = vUv * vec2(420.0, 360.0);
    vec2 cell = floor(grid);
    float twinkle = step(0.988, hash(cell));
    float dot = smoothstep(0.32, 0.0, length(fract(grid) - 0.5));
    night += vec3(twinkle * dot * smoothstep(0.15, 0.6, vUv.y));

    gl_FragColor = vec4(mix(night, day, uDaylight), 1.0);
  }
`;

/** What you see through the window. Unlit, so it reads as bright outdoor light. */
export function Sky() {
  const material = useRef<ShaderMaterial>(null);
  const uniforms = useMemo(() => ({ uDaylight: { value: 1 } }), []);

  useFrame(() => {
    if (material.current) material.current.uniforms.uDaylight.value = runtime.daylight;
  });

  const cx = (WINDOW.x0 + WINDOW.x1) / 2;
  const cy = (WINDOW.y0 + WINDOW.y1) / 2;
  return (
    <mesh position={[cx, cy, WALL_Z - 0.9]} raycast={() => null}>
      <planeGeometry args={[3, 2.6]} />
      <shaderMaterial
        ref={material}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        toneMapped={false}
        fog={false}
      />
    </mesh>
  );
}
