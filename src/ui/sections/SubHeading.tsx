import type { ReactNode } from "react";

/** A heading inside a section window, one step below the window's own title. */
export function SubHeading({
  children,
  id,
  className = "",
}: {
  children: ReactNode;
  id?: string;
  className?: string;
}) {
  return (
    <h3 id={id} className={`type-label text-[1.1875rem] ${className}`}>
      {children}
    </h3>
  );
}
