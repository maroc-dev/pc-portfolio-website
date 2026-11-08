import { useId } from "react";

/*
 * A made-up example of what the network diagram generator produces: invented hostnames,
 * interfaces and addresses, drawn with Cisco-style router and switch symbols on a Draw.io-like
 * canvas. The canvas stays light in both themes, like a file preview.
 */

type Vendor = "cisco" | "juniper";
type Kind = "router" | "switch";

interface Device {
  id: string;
  platform: string;
  vendor: Vendor;
  kind: Kind;
  x: number;
  y: number;
}

interface Link {
  a: string;
  b: string;
  layer: 2 | 3;
  label?: string;
}

const DEVICES: Device[] = [
  { id: "edge-j1", platform: "Juniper MX", vendor: "juniper", kind: "router", x: 360, y: 66 },
  { id: "core-r1", platform: "Cisco ISR", vendor: "cisco", kind: "router", x: 200, y: 166 },
  { id: "core-r2", platform: "Cisco ISR", vendor: "cisco", kind: "router", x: 520, y: 166 },
  { id: "dist-sw1", platform: "Cisco Catalyst", vendor: "cisco", kind: "switch", x: 200, y: 270 },
  { id: "dist-sw2", platform: "Cisco Catalyst", vendor: "cisco", kind: "switch", x: 520, y: 270 },
  { id: "acc-sw1", platform: "Cisco Catalyst", vendor: "cisco", kind: "switch", x: 100, y: 372 },
  { id: "acc-sw2", platform: "Cisco Catalyst", vendor: "cisco", kind: "switch", x: 360, y: 372 },
  { id: "acc-sw3", platform: "Cisco Catalyst", vendor: "cisco", kind: "switch", x: 620, y: 372 },
];

const LINKS: Link[] = [
  { a: "edge-j1", b: "core-r1", layer: 3, label: "ge-0/0/1" },
  { a: "edge-j1", b: "core-r2", layer: 3, label: "ge-0/0/2" },
  { a: "core-r1", b: "core-r2", layer: 3, label: "10.0.12.0/30" },
  { a: "core-r1", b: "dist-sw1", layer: 3 },
  { a: "core-r2", b: "dist-sw2", layer: 3 },
  { a: "core-r1", b: "dist-sw2", layer: 3 },
  { a: "core-r2", b: "dist-sw1", layer: 3 },
  { a: "dist-sw1", b: "acc-sw1", layer: 2 },
  { a: "dist-sw1", b: "acc-sw2", layer: 2 },
  { a: "dist-sw2", b: "acc-sw2", layer: 2 },
  { a: "dist-sw2", b: "acc-sw3", layer: 2 },
];

const COLORS: Record<Vendor, { top: string; side: string }> = {
  cisco: { top: "#3b7fc4", side: "#215a92" },
  juniper: { top: "#4c9a6c", side: "#2c6a47" },
};
const INK = "#13234a";
const MUTED = "#4d5d7c";
const LAYER2 = "#5d77a8";
const CANVAS = "#fdfdfb";

const byId = new Map(DEVICES.map((d) => [d.id, d]));

/** A short arrow from (x1, y1) to (x2, y2) with an open head at the end. */
function arrow(x1: number, y1: number, x2: number, y2: number, head = 4.5): string {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const spread = Math.PI / 5;
  const hx1 = x2 - head * Math.cos(angle - spread);
  const hy1 = y2 - head * Math.sin(angle - spread);
  const hx2 = x2 - head * Math.cos(angle + spread);
  const hy2 = y2 - head * Math.sin(angle + spread);
  return `M${x1},${y1}L${x2},${y2}M${hx1},${hy1}L${x2},${y2}L${hx2},${hy2}`;
}

const strokeWhite = {
  fill: "none",
  stroke: "#fff",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/** The classic router symbol: a puck with four arrows on top, two in and two out. */
function Router({ vendor }: { vendor: Vendor }) {
  const { top, side } = COLORS[vendor];
  return (
    <g>
      <path d="M-24,-4v11a24,9 0 0 0 48,0v-11z" fill={side} />
      <ellipse cx="0" cy="-4" rx="24" ry="9" fill={top} />
      <path
        {...strokeWhite}
        d={[
          arrow(-5, -6, -16, -10), // out, up-left
          arrow(5, -2, 16, 2), // out, down-right
          arrow(17, -10, 6, -6), // in, from up-right
          arrow(-17, 2, -6, -2), // in, from down-left
        ].join("")}
      />
    </g>
  );
}

/** The classic workgroup switch symbol: a box with crossing arrows on top. */
function Switch({ vendor }: { vendor: Vendor }) {
  const { top, side } = COLORS[vendor];
  return (
    <g>
      <rect x="-27" y="-3" width="54" height="11" fill={side} />
      <path d="M-27,-3L-20,-13H27L27,-3z" fill={top} />
      <path {...strokeWhite} d={arrow(-14, -10, 14, -10, 3.5) + arrow(16, -5.5, -12, -5.5, 3.5)} />
    </g>
  );
}

export function NetworkSample() {
  const grid = useId();
  return (
    <figure className="mt-6">
      <div className="border-line overflow-hidden rounded-md border">
        <div className="border-line bg-base flex items-center justify-between gap-3 border-b px-3 py-2">
          <span className="type-meta text-muted text-sm">example-network.drawio</span>
          <span className="tape text-xs">Example output</span>
        </div>
        <svg
          viewBox="0 0 720 420"
          role="img"
          aria-label="Example network diagram: a Juniper MX edge router linked to two Cisco ISR core routers, which connect at Layer 3 to two Cisco Catalyst distribution switches; those connect at Layer 2 to three Cisco Catalyst access switches."
          className="block h-auto w-full"
          style={{ background: CANVAS }}
        >
          <defs>
            <pattern id={grid} width="16" height="16" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="0.9" fill="#d5deec" />
            </pattern>
          </defs>
          <rect width="720" height="420" fill={`url(#${grid})`} />

          {LINKS.map(({ a, b, layer }) => {
            const from = byId.get(a)!;
            const to = byId.get(b)!;
            return (
              <line
                key={`${a}-${b}`}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke={layer === 3 ? INK : LAYER2}
                strokeWidth={layer === 3 ? 1.6 : 1.4}
                strokeDasharray={layer === 2 ? "5 4" : undefined}
              />
            );
          })}

          <g fontSize="9.5" fill={MUTED} textAnchor="middle">
            {LINKS.filter((l) => l.label).map(({ a, b, label }) => {
              const from = byId.get(a)!;
              const to = byId.get(b)!;
              return (
                <text
                  key={label}
                  x={(from.x + to.x) / 2}
                  y={(from.y + to.y) / 2 - 4}
                  stroke={CANVAS}
                  strokeWidth="4"
                  paintOrder="stroke"
                >
                  {label}
                </text>
              );
            })}
          </g>

          {DEVICES.map((device) => (
            <g key={device.id} transform={`translate(${device.x} ${device.y})`}>
              {device.kind === "router" ? (
                <Router vendor={device.vendor} />
              ) : (
                <Switch vendor={device.vendor} />
              )}
              <g textAnchor="middle" stroke={CANVAS} strokeWidth="4" paintOrder="stroke">
                <text y="26" fontSize="11" fontWeight="700" fill={INK}>
                  {device.id}
                </text>
                <text y="38" fontSize="9.5" fill={MUTED}>
                  {device.platform}
                </text>
              </g>
            </g>
          ))}

          <g transform="translate(18 22)" fontSize="10" fill={MUTED}>
            <line x1="0" y1="0" x2="26" y2="0" stroke={INK} strokeWidth="1.6" />
            <text x="34" y="3.5">
              Layer 3 link
            </text>
            <line
              x1="0"
              y1="18"
              x2="26"
              y2="18"
              stroke={LAYER2}
              strokeWidth="1.4"
              strokeDasharray="5 4"
            />
            <text x="34" y="21.5">
              Layer 2 link
            </text>
          </g>
        </svg>
      </div>
      <figcaption className="text-muted mt-2.5 text-sm leading-relaxed">
        A made-up example of the kind of diagram it generates, with Cisco and Juniper routers and
        switches and their Layer 2 and Layer 3 links. Every device and address here is invented.
      </figcaption>
    </figure>
  );
}
