import { Sparkles } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import {
  AdditiveBlending,
  BufferGeometry,
  Float32BufferAttribute,
  type Group,
  type ShaderMaterial,
} from "three";
import { SUN_DIRECTION, WALL_Z, WINDOW } from "../layout";
import { runtime } from "../runtime";

const LENGTH = 1.9;

/** A box swept from the window opening along the sun direction; `along` runs 0 → 1. */
function shaftGeometry(): BufferGeometry {
  const { x0, x1, y0, y1 } = WINDOW;
  const z = WALL_Z + 0.01;
  const near = [
    [x0, y0, z],
    [x1, y0, z],
    [x1, y1, z],
    [x0, y1, z],
  ];
  const far = near.map(([x, y, zz]) => [
    x! + SUN_DIRECTION.x * LENGTH,
    y! + SUN_DIRECTION.y * LENGTH,
    zz! + SUN_DIRECTION.z * LENGTH,
  ]);
  const positions: number[] = [];
  const along: number[] = [];
  const quad = (a: number[], b: number[], c: number[], d: number[], ta: number, tb: number) => {
    for (const [p, t] of [
      [a, ta],
      [b, ta],
      [c, tb],
      [a, ta],
      [c, tb],
      [d, tb],
    ] as const) {
      positions.push(...p);
      along.push(t);
    }
  };
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4;
    quad(near[i]!, near[j]!, far[j]!, far[i]!, 0, 1);
    quad(near[i]!, far[i]!, far[j]!, near[j]!, 0, 1);
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
  geometry.setAttribute("along", new Float32BufferAttribute(along, 1));
  return geometry;
}

const vertexShader = /* glsl */ `
  attribute float along;
  varying float vAlong;
  void main() {
    vAlong = along;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uStrength;
  varying float vAlong;
  void main() {
    float fade = smoothstep(0.0, 0.12, vAlong) * pow(1.0 - vAlong, 1.6);
    float a = uStrength * fade;
    gl_FragColor = vec4(vec3(1.0, 0.96, 0.86) * a, a);
  }
`;

/** Soft beams of sunlight with dust drifting through them. Day only. */
export function SunShafts({ dust }: { dust: boolean }) {
  const geometry = useMemo(() => shaftGeometry(), []);
  const material = useRef<ShaderMaterial>(null);
  const motes = useRef<Group>(null);
  const uniforms = useMemo(() => ({ uStrength: { value: 0 } }), []);
  const dustCentre = useMemo(() => {
    const { x0, x1, y0, y1 } = WINDOW;
    return [
      (x0 + x1) / 2 + SUN_DIRECTION.x * 0.8,
      (y0 + y1) / 2 + SUN_DIRECTION.y * 0.8,
      WALL_Z + SUN_DIRECTION.z * 0.8,
    ] as const;
  }, []);

  useFrame(() => {
    const t = runtime.daylight;
    if (material.current) material.current.uniforms.uStrength.value = 0.07 * t;
    if (motes.current) motes.current.visible = t > 0.4;
  });

  return (
    <group>
      <mesh geometry={geometry} renderOrder={2} raycast={() => null}>
        <shaderMaterial
          ref={material}
          uniforms={uniforms}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          transparent
          depthWrite={false}
          blending={AdditiveBlending}
          toneMapped={false}
        />
      </mesh>
      {dust && (
        <group ref={motes} position={dustCentre}>
          <Sparkles
            count={40}
            scale={[0.5, 0.5, 0.5]}
            size={0.7}
            speed={0.15}
            opacity={0.35}
            color="#fff3d6"
            noise={0.6}
          />
        </group>
      )}
    </group>
  );
}
