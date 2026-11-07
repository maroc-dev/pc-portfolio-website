import {
  Bloom,
  EffectComposer,
  Outline,
  Sharpness,
  ToneMapping,
} from "@react-three/postprocessing";
import { useThree } from "@react-three/fiber";
import { ToneMappingMode, type OutlineEffect } from "postprocessing";
import { useEffect, useRef } from "react";
import { highlightedMeshes, subscribeHighlights } from "../interaction/highlight-registry";

/**
 * Post-processing for capable devices: soft outlines on every part while the PC is hovered,
 * a strong outline on the active part, a gentle bloom on LEDs, neutral tone mapping that keeps the
 * friendly colours true, and a light sharpen
 * (the composer takes over tone mapping from the renderer).
 */
export function Effects() {
  const invalidate = useThree((s) => s.invalidate);
  const hint = useRef<OutlineEffect>(null);
  const strong = useRef<OutlineEffect>(null);

  useEffect(() => {
    const sync = () => {
      hint.current?.selection.set(highlightedMeshes("hint"));
      strong.current?.selection.set(highlightedMeshes("strong"));
      invalidate();
    };
    sync();
    return subscribeHighlights(sync);
  }, [invalidate]);

  return (
    <EffectComposer multisampling={4} autoClear={false}>
      <Outline
        ref={hint}
        edgeStrength={2.4}
        visibleEdgeColor={0x8cc8ff}
        hiddenEdgeColor={0x4f86d9}
        blur
        xRay
      />
      <Outline
        ref={strong}
        edgeStrength={7}
        visibleEdgeColor={0x3d9bff}
        hiddenEdgeColor={0x2a6fe0}
        pulseSpeed={0.3}
        blur
        xRay
      />
      <Bloom
        luminanceThreshold={0.9}
        luminanceSmoothing={0.2}
        intensity={0.55}
        mipmapBlur
        radius={0.55}
      />
      <ToneMapping mode={ToneMappingMode.NEUTRAL} />
      {/* A light sharpen restores detail that mipmapped textures soften at an angle. */}
      <Sharpness sharpness={0.35} radius={1} />
    </EffectComposer>
  );
}
