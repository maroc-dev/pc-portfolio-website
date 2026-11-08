import { useMemo } from "react";
import { CableRun } from "./CableRun";
import { createCableCurve } from "./layout";
import { materials, palette } from "./materials";

/** Display cable from the tower to the monitor; the signal pulse runs along it on selection. */
export function Cable() {
  const curve = useMemo(() => createCableCurve(), []);
  return (
    <CableRun
      curve={curve}
      radius={0.0045}
      material={materials.rubber}
      pulseColor={palette.glow}
      carriesSignal={() => true}
    />
  );
}
