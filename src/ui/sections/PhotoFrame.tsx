import Image from "next/image";
import type { CSSProperties } from "react";
import type { Photo } from "@/content/types";
import { tapeTilt } from "@/lib/tape";

interface PhotoFrameProps {
  photo: Photo;
  /** `sizes` for the responsive image. */
  sizes: string;
  /** Crop to this aspect ratio (width / height) instead of the photo's own. */
  aspect?: number;
  /** Prints pinned to the board sit a little crooked; banners sit straight. */
  tilt?: boolean;
  className?: string;
}

/**
 * A photo as a print: a paper border, a slight tilt and a label-tape caption. A placeholder slot
 * keeps the same frame with a hatched fill, so the story reads the same once Marco's photo
 * arrives. Placeholders are decorative and hidden from assistive technology.
 */
export function PhotoFrame({ photo, sizes, aspect, tilt = true, className = "" }: PhotoFrameProps) {
  const style: CSSProperties = tilt ? { rotate: `${tapeTilt(photo.caption, 1.8)}deg` } : {};
  return (
    <figure
      aria-hidden={photo.placeholder || undefined}
      className={`relative ${className}`}
      style={style}
    >
      <div className="bg-panel ring-line p-2 shadow-[0_16px_30px_-20px_rgb(19_35_74/0.6),0_1px_2px_rgb(19_35_74/0.12)] ring-1">
        <div
          className="bg-base relative overflow-hidden"
          style={{ aspectRatio: aspect ?? photo.width / photo.height }}
        >
          {photo.placeholder ? (
            <div className="flex h-full items-center justify-center bg-[repeating-linear-gradient(135deg,var(--line)_0_1px,transparent_1px_11px)]">
              <span className="type-meta bg-panel text-muted rounded-[3px] px-2 py-0.5 text-xs">
                Photo coming soon
              </span>
            </div>
          ) : (
            <Image src={photo.src} alt={photo.alt} fill sizes={sizes} className="object-cover" />
          )}
        </div>
      </div>
      <figcaption className="relative -mt-3 ml-3 flex flex-col items-start gap-1.5">
        <span className="tape tape-paper text-xs whitespace-normal">{photo.caption}</span>
        {!photo.placeholder && photo.credit && (
          <span className="type-meta text-muted text-[0.6875rem]">
            Photo:{" "}
            <a
              href={photo.credit.href}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-fg underline underline-offset-2"
            >
              {photo.credit.author}
            </a>
            , {photo.credit.license}
          </span>
        )}
      </figcaption>
    </figure>
  );
}
