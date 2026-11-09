import { useEffect, useMemo } from "react";
import { ExtrudeGeometry, MeshStandardMaterial, Shape, type Material } from "three";
import { Assemble } from "../intro/Assemble";
import { INTRO } from "../intro/schedule";
import { TOWER } from "../layout";
import { materials } from "../materials";
import { createHexTexture, createSlotTexture } from "../textures/perforation";

const { width: W, depth: D, height: H, chamfer: C, plinth: P, cap: CAP, wall: T } = TOWER;
const PANEL_H = H - P - CAP;
const POWDER = "#a9c0ea";
const HOLE = "#1d2433";
const SLOT_X = [-0.145, -0.123, -0.101, -0.079, -0.057];
const PANEL_Y = P + PANEL_H / 2;
/** Width of the square pillars at the corners. */
const PILLAR = 0.008;

/**
 * Octagonal footprint, counter-clockwise from the front-left corner of the front edge. `inset`
 * moves every edge inward by the same distance, the diagonal corner edges included: their legs
 * shrink by (2 - √2) times the inset, so an inset outline grown back by a bevel lines up exactly.
 */
function footprint(inset = 0): [number, number][] {
  const hw = W / 2 - inset;
  const hd = D / 2 - inset;
  const c = C - inset * (2 - Math.SQRT2);
  return [
    [-hw + c, hd],
    [hw - c, hd],
    [hw, hd - c],
    [hw, -hd + c],
    [hw - c, -hd],
    [-hw + c, -hd],
    [-hw, -hd + c],
    [-hw, hd - c],
  ];
}

type Face = "glass" | "solid" | "mesh";
/** One entry per footprint edge: front, front-right, right, back-right, back, back-left, left, front-left. */
const FACES: Face[] = ["glass", "glass", "glass", "solid", "solid", "solid", "mesh", "glass"];

/** Extrudes the footprint vertically (shape is in x/-z, rotated so extrusion runs up +y). */
function octagonSlab(height: number, bevel: number, inset: number): ExtrudeGeometry {
  const points = footprint(inset + bevel);
  const shape = new Shape();
  points.forEach(([x, z], i) => (i === 0 ? shape.moveTo(x, -z) : shape.lineTo(x, -z)));
  shape.closePath();
  const geometry = new ExtrudeGeometry(shape, {
    depth: height - bevel * 2,
    bevelEnabled: bevel > 0,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 1,
  });
  geometry.rotateX(-Math.PI / 2);
  geometry.translate(0, bevel, 0);
  return geometry;
}

interface PanelProps {
  from: [number, number];
  to: [number, number];
  material: Material;
  thickness: number;
  glass?: boolean;
}

/**
 * A vertical panel spanning one footprint edge, between plinth and cap. It sits just inside the
 * edge, so its outer face lies on the outline: flush with the cap and plinth, and meeting its
 * neighbours exactly at the corners.
 */
function Panel({ from, to, material, thickness, glass }: PanelProps) {
  const dx = to[0] - from[0];
  const dz = to[1] - from[1];
  const length = Math.hypot(dx, dz);
  // Inward normal of a counter-clockwise outline (seen from above, front towards +z).
  const nx = (dz / length) * (thickness / 2);
  const nz = (-dx / length) * (thickness / 2);
  return (
    <mesh
      position={[(from[0] + to[0]) / 2 + nx, PANEL_Y, (from[1] + to[1]) / 2 + nz]}
      rotation={[0, -Math.atan2(dz, dx), 0]}
      material={material}
      raycast={glass ? () => null : undefined}
    >
      <boxGeometry args={[length, PANEL_H, thickness]} />
    </mesh>
  );
}

/**
 * Octagonal showcase case modelled on Marco's: panoramic glass across the front corners and right
 * side, a perforated left panel, chamfered top cap with a honeycomb grille, and a vented plinth.
 * Branding is deliberately left off.
 */
export function CaseShell() {
  const assets = useMemo(() => {
    // Texture base colours match casePowder so perforated panels blend with the paint.
    const meshMap = createSlotTexture(POWDER, HOLE, [6, 11]);
    const hexMap = createHexTexture(POWDER, HOLE, [70, 70]);
    const ventMap = createSlotTexture(POWDER, HOLE, [14, 2.5]);
    return {
      cap: octagonSlab(CAP, 0.012, 0),
      plinth: octagonSlab(P, 0.006, 0),
      grille: octagonSlab(0.004, 0, 0.025),
      meshPanel: new MeshStandardMaterial({ map: meshMap, metalness: 0.15, roughness: 0.6 }),
      grillePanel: new MeshStandardMaterial({ map: hexMap, metalness: 0.2, roughness: 0.6 }),
      vent: new MeshStandardMaterial({ map: ventMap, metalness: 0.15, roughness: 0.6 }),
    };
  }, []);

  useEffect(
    () => () => {
      for (const geometry of [assets.cap, assets.plinth, assets.grille]) geometry.dispose();
      for (const material of [assets.meshPanel, assets.grillePanel, assets.vent]) {
        material.map?.dispose();
        material.dispose();
      }
    },
    [assets],
  );

  const outline = footprint();
  const panels = outline.map((from, i) => {
    const to = outline[(i + 1) % outline.length]!;
    const face = FACES[i]!;
    const material =
      face === "glass"
        ? materials.glass
        : face === "mesh"
          ? assets.meshPanel
          : materials.casePowder;
    return (
      <Panel
        key={i}
        from={from}
        to={to}
        material={material}
        thickness={face === "glass" ? 0.004 : T}
        glass={face === "glass"}
      />
    );
  });
  const isGlass = (i: number) => FACES[i] === "glass";
  // Each pillar turns to face along its corner's bisector, its outermost edge on the corner.
  const pillars = outline.map(([x, z]) => {
    const length = Math.hypot(x, z);
    const back = (PILLAR / 2) * Math.SQRT2;
    return {
      x: x - (x / length) * back,
      z: z - (z / length) * back,
      angle: Math.PI / 4 - Math.atan2(z, x),
    };
  });

  // Assembled in three stages for the opening: chassis, then the glass closes, then the cap.
  return (
    <group>
      <Assemble step={INTRO.plinth}>
        <mesh geometry={assets.plinth} material={materials.casePowder} />
        {/* Vents along the plinth's front; the PSU lives inside the plinth */}
        <mesh position={[0, P * 0.45, D / 2 + 0.0005]} material={assets.vent}>
          <planeGeometry args={[W - 2 * C - 0.03, P * 0.45]} />
        </mesh>
        {panels.filter((_, i) => !isGlass(i))}
        {/* Expansion slot covers along the top (the board is mounted rotated) */}
        <mesh position={[-0.1, H - CAP - 0.006, -0.11]} material={materials.aluminium}>
          <boxGeometry args={[0.11, 0.004, 0.05]} />
        </mesh>
        {SLOT_X.map((x) => (
          <mesh key={x} position={[x, H - CAP - 0.009, -0.095]} material={materials.caseMetal}>
            <cylinderGeometry args={[0.0035, 0.0035, 0.004, 12]} />
          </mesh>
        ))}
        {/* Vertical light strip in the back-right corner */}
        <mesh
          position={[W / 2 - C / 2 - 0.006, PANEL_Y, -D / 2 + C / 2 + 0.006]}
          rotation={[0, Math.PI / 4, 0]}
          material={materials.ledGlow}
        >
          <boxGeometry args={[0.004, PANEL_H - 0.04, 0.002]} />
        </mesh>
      </Assemble>

      <Assemble step={INTRO.shell}>
        {panels.filter((_, i) => isGlass(i))}
        {/* Corner pillars framing the glass, tucked inside each corner */}
        {pillars.map(({ x, z, angle }, i) => (
          <mesh
            key={i}
            position={[x, PANEL_Y, z]}
            rotation={[0, angle, 0]}
            material={materials.casePowder}
          >
            <boxGeometry args={[PILLAR, PANEL_H, PILLAR]} />
          </mesh>
        ))}
      </Assemble>

      <Assemble step={INTRO.cap}>
        <mesh geometry={assets.cap} position={[0, H - CAP, 0]} material={materials.casePowder} />
        <mesh
          geometry={assets.grille}
          position={[0, H + 0.0005, 0]}
          material={assets.grillePanel}
        />
      </Assemble>
    </group>
  );
}
