import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import {
  AdditiveBlending,
  Color,
  type CatmullRomCurve3,
  type ColorRepresentation,
  type Material,
  type ShaderMaterial,
  type TubeGeometry,
} from "three";
import { runtime } from "./runtime";

/** Tube resolution; the draw range grows in whole segments (6 indices per radial step). */
const TUBULAR = 160;
const RADIAL = 10;

const vertexShader = /* glsl */ `
  varying float vAlong;
  void main() {
    vAlong = uv.x;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uProgress;
  uniform vec3 uColor;
  varying float vAlong;
  void main() {
    // A short bright head with a softer trailing tail.
    float d = uProgress - vAlong;
    float head = smoothstep(0.05, 0.0, abs(d));
    float tail = d > 0.0 ? smoothstep(0.25, 0.0, d) * 0.45 : 0.0;
    float a = max(head, tail);
    gl_FragColor = vec4(uColor * a, a);
  }
`;

interface CableRunProps {
  curve: CatmullRomCurve3;
  radius: number;
  material: Material;
  pulseColor: ColorRepresentation;
  /** Whether the signal pulse should run along this cable right now. */
  carriesSignal: () => boolean;
}

/**
 * A cable along `curve`. It runs out from its start during the opening (`runtime.cable`), and
 * a pulse of light travels along it with `runtime.signal` while `carriesSignal()` is true.
 */
export function CableRun({ curve, radius, material, pulseColor, carriesSignal }: CableRunProps) {
  const pulse = useRef<ShaderMaterial>(null);
  const body = useRef<TubeGeometry>(null);
  const uniforms = useMemo(
    () => ({ uProgress: { value: 0 }, uColor: { value: new Color(pulseColor) } }),
    [pulseColor],
  );

  useFrame(() => {
    if (body.current) {
      const segments = Math.ceil(TUBULAR * runtime.cable);
      body.current.setDrawRange(0, segments * RADIAL * 6);
    }
    if (!pulse.current) return;
    const s = runtime.signal;
    pulse.current.visible = s > 0 && s < 1 && carriesSignal();
    // Overshoot slightly so the tail fully leaves the cable at the end.
    pulse.current.uniforms.uProgress.value = s * 1.3;
  });

  return (
    <group>
      <mesh material={material}>
        <tubeGeometry ref={body} args={[curve, TUBULAR, radius, RADIAL, false]} />
      </mesh>
      <mesh renderOrder={1} raycast={() => null}>
        <tubeGeometry args={[curve, TUBULAR, radius * 1.4, RADIAL, false]} />
        <shaderMaterial
          ref={pulse}
          uniforms={uniforms}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          transparent
          depthWrite={false}
          blending={AdditiveBlending}
          toneMapped={false}
          visible={false}
        />
      </mesh>
    </group>
  );
}
