/** Shown instead of the 3D scene when WebGL is unavailable. Navigation below still works. */
export function StaticFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(ellipse_at_30%_70%,rgba(242,166,90,0.18),transparent_60%)] p-6">
      <div className="max-w-md text-center">
        <p className="type-casual text-2xl font-bold">
          The desk lamp is on, but the 3D view is off.
        </p>
        <p className="text-dust mt-3">
          Your browser can&apos;t show the 3D machine, so pick a part below to open each section
          directly.
        </p>
      </div>
    </div>
  );
}
