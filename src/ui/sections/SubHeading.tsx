import type { ReactNode } from "react";

/** A heading inside a section window, one step below the window's own title. */
export function SubHeading({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <h3 className={`type-label text-[1.1875rem] ${className}`}>{children}</h3>;
}
