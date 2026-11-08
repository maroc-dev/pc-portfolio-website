import type { JourneyStop } from "@/content/types";
import { PhotoFrame } from "./PhotoFrame";

/**
 * The journey as one line with a stop for each chapter. As the reader scrolls, AboutSection sets
 * `data-state` on each stop: "passed" stops fill in, and the "current" one wears yellow tape. The
 * line runs dashed through a pause.
 */
export function Journey({ stops }: { stops: JourneyStop[] }) {
  return (
    <ol className="mt-7">
      {stops.map((stop, i) => (
        <li
          key={stop.id}
          id={`journey-${stop.id}`}
          data-stop=""
          className="group/stop relative scroll-mt-16 pb-14 pl-10 last:pb-2"
        >
          {i < stops.length - 1 && (
            <span
              aria-hidden="true"
              className={`border-line group-data-[state=passed]/stop:border-powder group-data-[state=current]/stop:border-powder absolute top-[18px] -bottom-[18px] left-[11px] border-l-2 transition-colors duration-300 ${
                stop.pause ? "border-dashed" : ""
              }`}
            />
          )}
          <span
            aria-hidden="true"
            className="border-line bg-panel group-data-[state=passed]/stop:border-powder group-data-[state=passed]/stop:bg-powder group-data-[state=current]/stop:bg-tape group-data-[state=current]/stop:border-tape-ink absolute top-[11px] left-[5px] h-4 w-4 rounded-full border-2 transition-colors duration-300"
          />

          <div className="@3xl:grid @3xl:grid-cols-[minmax(0,1fr)_14rem] @3xl:gap-10">
            <div>
              <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="tape tape-paper group-data-[state=current]/stop:bg-tape text-xs transition-colors duration-300">
                  {stop.place}
                </span>
                <span className="type-meta text-muted text-sm">{stop.when}</span>
              </p>
              <h4 className="type-display mt-3 text-[1.625rem] @2xl:text-[1.875rem]">
                {stop.title}
              </h4>
              <div
                className={`mt-3 max-w-[60ch] space-y-3 text-[1.0625rem] leading-relaxed ${
                  stop.pause ? "text-muted" : ""
                }`}
              >
                {stop.story.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>

              {stop.placings && (
                <ul className="mt-6 grid gap-4 @xl:grid-cols-2">
                  {stop.placings.map((placing) => (
                    <li
                      key={placing.event}
                      className="border-tape flex items-center gap-4 border-l-4 pl-4"
                    >
                      <span className="type-display text-[2.75rem] leading-none">
                        {placing.place}
                      </span>
                      <span className="text-muted text-sm leading-snug">{placing.event}</span>
                    </li>
                  ))}
                </ul>
              )}

              {stop.built && (
                <ul className="divide-line border-line mt-6 divide-y border-y">
                  {stop.built.map((thing) => (
                    <li
                      key={thing.name}
                      className="grid gap-1 py-3.5 @xl:grid-cols-[11rem_1fr] @xl:gap-6"
                    >
                      <span className="type-label">{thing.name}</span>
                      <span className="text-muted leading-relaxed">{thing.detail}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {stop.photo && (
              <PhotoFrame
                photo={stop.photo}
                sizes="(min-width: 768px) 300px, 80vw"
                className="mt-7 max-w-64 @3xl:mt-10"
              />
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
