import Image from "next/image";
import poster from "../../public/poster.jpg";

/** Shown instead of the 3D scene when WebGL is unavailable. Navigation below still works. */
export function StaticFallback() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <Image
        src={poster}
        alt="Marco's desk: a monitor and a powder-blue PC lit by a warm desk lamp."
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-45"
      />
      <div className="relative flex h-full items-center justify-center p-6">
        <div className="max-w-md text-center">
          <p className="type-casual text-2xl font-bold">
            The desk lamp is on, but the 3D view is off.
          </p>
          <p className="text-cream/85 mt-3">
            Your browser can&apos;t show the 3D machine, so pick a part below to open each section
            directly.
          </p>
        </div>
      </div>
    </div>
  );
}
