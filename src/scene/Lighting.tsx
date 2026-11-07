import { Environment, Lightformer } from "@react-three/drei";

/**
 * Warm hemisphere fill, a cool rim from behind the tower, and a tiny Lightformer environment
 * for reflections on metal and glass (no HDRI download). The desk lamp's key light lives in
 * Lamp.tsx so it moves with the lamp.
 */
export function Lighting() {
  return (
    <>
      <hemisphereLight args={["#ffdcb0", "#1d1b19", 0.45]} />
      <directionalLight position={[1.6, 1.5, -1.2]} intensity={0.6} color="#bcd9d3" />
      <Environment resolution={128} frames={1} environmentIntensity={0.55}>
        <Lightformer
          form="rect"
          intensity={1.4}
          color="#ffd2a1"
          position={[-1.2, 2, 1.2]}
          scale={[2.5, 1, 1]}
          target={[0, 0, 0]}
        />
        <Lightformer
          form="rect"
          intensity={0.5}
          color="#f2a65a"
          position={[2, 0.8, 1.5]}
          scale={[1, 2, 1]}
          target={[0, 0, 0]}
        />
      </Environment>
    </>
  );
}
