import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { AdditiveBlending, CatmullRomCurve3, Color, type ShaderMaterial } from "three";
import { CABLE_POINTS } from "./layout";
import { materials, palette } from "./materials";
import { runtime } from "./runtime";

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

/** Display cable from the tower to the monitor; a pulse runs along it when a part is chosen. */
export function Cable() {
  const curve = useMemo(() => new CatmullRomCurve3(CABLE_POINTS, false, "centripetal"), []);
  const pulse = useRef<ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({ uProgress: { value: 0 }, uColor: { value: new Color(palette.glow) } }),
    [],
  );

  useFrame(() => {
    if (!pulse.current) return;
    const s = runtime.signal;
    pulse.current.visible = s > 0 && s < 1;
    // Overshoot slightly so the tail fully leaves the cable at the end.
    pulse.current.uniforms.uProgress.value = s * 1.3;
  });

  return (
    <group>
      <mesh material={materials.rubber}>
        <tubeGeometry args={[curve, 96, 0.0045, 8, false]} />
      </mesh>
      <mesh renderOrder={1} raycast={() => null}>
        <tubeGeometry args={[curve, 96, 0.0062, 8, false]} />
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
