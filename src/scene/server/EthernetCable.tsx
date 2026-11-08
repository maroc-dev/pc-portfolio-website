import { useMemo } from "react";
import { CableRun } from "../CableRun";
import { createEthernetCurve } from "../layout";
import { palette } from "../materials";
import { ethernetBlue, serverSelected } from "./MiniServer";

/** Blue network cable from the mini server into the PC; the signal runs along it for the server. */
export function EthernetCable() {
  const curve = useMemo(() => createEthernetCurve(), []);
  return (
    <CableRun
      curve={curve}
      radius={0.0028}
      material={ethernetBlue}
      pulseColor={palette.signal}
      carriesSignal={serverSelected}
    />
  );
}
