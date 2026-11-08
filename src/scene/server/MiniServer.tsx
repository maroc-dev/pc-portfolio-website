import { RoundedBox } from "@react-three/drei";
import { MeshStandardMaterial } from "three";
import { experienceStore } from "@/state/experience-store";
import { HitArea } from "../interaction/HitArea";
import { Interactive, usePartAccent } from "../interaction/Interactive";
import { MINI_SERVER } from "../layout";
import { materials, palette } from "../materials";

const { width: W, height: H, depth: D } = MINI_SERVER;
const FOOT = 0.004;
const BODY_Y = FOOT + H / 2;
const FRONT_Z = D / 2;
const VENT_Y = [-0.012, -0.004, 0.004, 0.012];
const FEET: [number, number][] = [
  [-W / 2 + 0.02, -D / 2 + 0.02],
  [W / 2 - 0.02, -D / 2 + 0.02],
  [-W / 2 + 0.02, D / 2 - 0.02],
  [W / 2 - 0.02, D / 2 - 0.02],
];

/** Brushed silver shell, like most mini PCs; the lid picks up the tower's powder blue. */
const shell = new MeshStandardMaterial({ color: "#d4d9e1", metalness: 0.65, roughness: 0.32 });

/** The power ring breathes slowly while the machine is on. */
const breathe = (t: number) => 0.6 + 0.4 * (0.5 + 0.5 * Math.sin(t * 1.6));
/** Network activity: quick bursts of blinks, like traffic coming and going. */
const traffic = (t: number) => (Math.sin(t * 17) * Math.sin(t * 2.7) > 0.35 ? 2.2 : 0.4);

/**
 * A small home-lab server on the desk, between the monitor and the tower. It opens the
 * distributed-systems section; a blue network cable links it to the PC.
 */
export function MiniServer() {
  const power = usePartAccent(palette.glow, breathe, 3);
  const activity = usePartAccent(palette.signal, traffic, 3);

  return (
    <group position={MINI_SERVER.position} rotation={[0, MINI_SERVER.rotationY, 0]}>
      <Interactive id="server" accents={[power, activity]}>
        {FEET.map(([x, z]) => (
          <mesh key={`${x}${z}`} position={[x, FOOT / 2, z]} material={materials.rubber}>
            <cylinderGeometry args={[0.007, 0.007, FOOT, 16]} />
          </mesh>
        ))}
        <RoundedBox
          args={[W, H, D]}
          radius={0.01}
          smoothness={4}
          position={[0, BODY_Y, 0]}
          material={shell}
        />
        {/* Powder-blue lid inset into the top */}
        <RoundedBox
          args={[W - 0.016, 0.003, D - 0.016]}
          radius={0.0015}
          smoothness={2}
          position={[0, FOOT + H + 0.0006, 0]}
          material={materials.casePowder}
        />

        {/* Front panel: dark strip with power ring, activity lights and ports */}
        <mesh position={[0, BODY_Y, FRONT_Z + 0.0006]} material={materials.darkPlastic}>
          <boxGeometry args={[W - 0.024, H - 0.02, 0.0012]} />
        </mesh>
        <mesh position={[-W / 2 + 0.03, BODY_Y, FRONT_Z + 0.0016]} material={power.material}>
          <torusGeometry args={[0.0065, 0.0012, 10, 32]} />
        </mesh>
        {[0, 1, 2].map((i) => (
          <mesh
            key={i}
            position={[-W / 2 + 0.05 + i * 0.008, BODY_Y, FRONT_Z + 0.0015]}
            material={activity.material}
          >
            <boxGeometry args={[0.004, 0.0025, 0.001]} />
          </mesh>
        ))}
        {[0.02, 0.038].map((x) => (
          <mesh key={x} position={[x, BODY_Y, FRONT_Z + 0.0015]} material={materials.rubber}>
            <boxGeometry args={[0.012, 0.005, 0.001]} />
          </mesh>
        ))}

        {/* Side vents */}
        {[-1, 1].map((side) =>
          VENT_Y.map((y) => (
            <mesh
              key={`${side}${y}`}
              position={[side * (W / 2 + 0.0004), BODY_Y + y, 0]}
              material={materials.darkPlastic}
            >
              <boxGeometry args={[0.001, 0.003, D - 0.05]} />
            </mesh>
          )),
        )}

        {/* Rear network ports; the blue cable plugs into the first */}
        {[0.03, 0.05].map((x) => (
          <mesh key={x} position={[x, FOOT + 0.02, -D / 2 - 0.0006]} material={materials.rubber}>
            <boxGeometry args={[0.014, 0.011, 0.0012]} />
          </mesh>
        ))}
        <mesh position={[0.03, FOOT + 0.02, -D / 2 - 0.006]} material={ethernetBlue}>
          <boxGeometry args={[0.012, 0.009, 0.012]} />
        </mesh>

        <HitArea size={[W + 0.02, H + 0.03, D + 0.02]} position={[0, BODY_Y, 0]} />
      </Interactive>
    </group>
  );
}

/** Bright blue patch cable, so the network link reads at a glance. */
export const ethernetBlue = new MeshStandardMaterial({
  color: "#2f6fe0",
  roughness: 0.45,
  metalness: 0,
});

/** True while the mini server is the part being opened. */
export function serverSelected(): boolean {
  return experienceStore.getState().selected === "server";
}
