import { ContactShadows, RoundedBox } from "@react-three/drei";
import { useEffect, useState } from "react";
import { useExperience } from "@/state/experience-store";
import { holdIntro } from "./intro/readiness";
import { DESK } from "./layout";
import { materials } from "./materials";
import { createWoodTextures, type WoodTextures } from "./textures/wood";

/** Plain oak shown for the moment before the grain texture is ready. */
const OAK = "#d6b68c";

/** Runs `callback` when the browser is idle (Safari lacks requestIdleCallback: use a timeout). */
function whenIdle(callback: () => void): () => void {
  if (typeof requestIdleCallback === "function") {
    const id = requestIdleCallback(callback, { timeout: 1500 });
    return () => cancelIdleCallback(id);
  }
  const id = setTimeout(callback, 200);
  return () => clearTimeout(id);
}

const APRON_INSET = 0.06;

/** Solid light-oak desk with a softly rounded edge, a slim apron, and a felt mat. */
export function Desk() {
  const assembled = useExperience((s) => s.phase !== "boot");
  // The grain takes a moment to generate, so it's made when the browser is idle rather than
  // holding up the first frame. Without an intro the desk shows plain oak until then.
  const [wood, setWood] = useState<WoodTextures | null>(null);
  useEffect(() => {
    let made: WoodTextures | null = null;
    // The opening waits for the grain so it never swaps in mid-animation.
    const release = holdIntro();
    const cancel = whenIdle(() => {
      made = createWoodTextures();
      setWood(made);
      release();
    });
    return () => {
      cancel();
      release();
      made?.map.dispose();
      made?.roughnessMap.dispose();
    };
  }, []);

  return (
    <group>
      <mesh position={[0, -DESK.thickness / 2, DESK.z]}>
        <boxGeometry args={[DESK.width, DESK.thickness, DESK.depth]} />
        <meshStandardMaterial
          key={wood ? "grain" : "plain"}
          color={wood ? "#ffffff" : OAK}
          map={wood?.map ?? null}
          roughnessMap={wood?.roughnessMap ?? null}
          roughness={wood ? 1 : 0.5}
          metalness={0}
        />
      </mesh>
      {/* Rounded front lip so the edge catches the light like a real table top */}
      <RoundedBox
        args={[DESK.width, DESK.thickness, 0.03]}
        radius={0.012}
        smoothness={4}
        position={[0, -DESK.thickness / 2, DESK.z + DESK.depth / 2 - 0.012]}
      >
        <meshStandardMaterial
          key={wood ? "grain" : "plain"}
          color={wood ? "#ffffff" : OAK}
          map={wood?.map ?? null}
          roughness={0.55}
          metalness={0}
        />
      </RoundedBox>
      {/* Apron under the top */}
      <mesh position={[0, -DESK.thickness - 0.04, DESK.z + DESK.depth / 2 - APRON_INSET]}>
        <boxGeometry args={[DESK.width - 0.2, 0.08, 0.02]} />
        <meshStandardMaterial
          key={wood ? "grain" : "plain"}
          color={wood ? "#ffffff" : OAK}
          map={wood?.map ?? null}
          roughness={0.6}
          metalness={0}
        />
      </mesh>
      {/* Felt desk mat under the keyboard. */}
      <RoundedBox
        args={[0.86, 0.003, 0.34]}
        radius={0.0015}
        smoothness={2}
        position={[-0.22, 0.0015, 0.24]}
        material={materials.felt}
      />
      {/* Baked once (frames=1), after the opening, so it sees the finished layout. */}
      {assembled && (
        <ContactShadows
          position={[0, 0.0005, 0]}
          scale={[DESK.width, DESK.depth + 0.4]}
          resolution={1024}
          far={0.6}
          blur={2.4}
          opacity={0.45}
          frames={1}
          color="#1d2a40"
        />
      )}
    </group>
  );
}
