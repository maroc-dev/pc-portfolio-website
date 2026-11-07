import { TOWER } from "../layout";
import { materials } from "../materials";

const { depth: D, height: H, width: W, wall: T, shroudHeight } = TOWER;

/** Panels, glass side, PSU shroud and the front light strip. Not selectable. */
export function CaseShell() {
  return (
    <group>
      {/* Bottom, top, back, front, solid side */}
      <mesh position={[0, T / 2, 0]} material={materials.caseMetal}>
        <boxGeometry args={[D, T, W]} />
      </mesh>
      <mesh position={[0, H - T / 2, 0]} material={materials.caseMetal}>
        <boxGeometry args={[D, T, W]} />
      </mesh>
      <mesh position={[-D / 2 + T / 2, H / 2, 0]} material={materials.caseMetal}>
        <boxGeometry args={[T, H, W]} />
      </mesh>
      <mesh position={[D / 2 - 0.006, H / 2, 0]} material={materials.caseMetal}>
        <boxGeometry args={[0.012, H, W]} />
      </mesh>
      <mesh position={[0, H / 2, -W / 2 + T / 2]} material={materials.caseInner}>
        <boxGeometry args={[D, H, T]} />
      </mesh>

      {/* Front light strip along the glass-side edge */}
      <mesh position={[D / 2 + 0.0005, H / 2, W / 2 - 0.006]} material={materials.ledAmber}>
        <boxGeometry args={[0.002, H - 0.06, 0.003]} />
      </mesh>

      {/* PSU shroud */}
      <mesh position={[0, T + (shroudHeight - T) / 2, 0.004]} material={materials.caseInner}>
        <boxGeometry args={[D - 2 * T, shroudHeight - T, W - 2 * T - 0.008]} />
      </mesh>

      {/* Interior strip under the top panel, near the glass */}
      <mesh position={[0, H - T - 0.003, W / 2 - 0.02]} material={materials.ledAmber}>
        <boxGeometry args={[D - 0.08, 0.003, 0.004]} />
      </mesh>

      {/* Tempered glass: reflective but ignored by pointer raycasts so parts stay clickable. */}
      <mesh position={[0, H / 2, W / 2 - 0.002]} material={materials.glass} raycast={() => null}>
        <boxGeometry args={[D - 0.01, H - 0.01, 0.004]} />
      </mesh>
    </group>
  );
}
