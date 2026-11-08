import type { School } from "@/content/types";
import { PhotoFrame } from "../PhotoFrame";

function Course({ course }: { course: NonNullable<School["courses"]>[number] }) {
  return (
    <li className="grid gap-1.5 py-3.5 @xl:grid-cols-[5.5rem_1fr] @xl:gap-5">
      <span>
        <span className={`tape text-xs ${course.current ? "" : "tape-paper"}`}>{course.code}</span>
      </span>
      <span>
        <span className="flex flex-wrap items-baseline gap-x-3">
          <span className="font-semibold">{course.name}</span>
          {course.current && <span className="type-meta text-muted text-sm">Taking it now</span>}
        </span>
        <span className="text-muted mt-1 block leading-relaxed">{course.takeaway}</span>
      </span>
    </li>
  );
}

/** One school: its photos, the facts, then what it gave me. */
function SchoolEntry({ school }: { school: School }) {
  const [banner, ...rest] = school.photos ?? [];
  const wide = banner && banner.width / banner.height > 1.4;
  return (
    <article className="border-line mt-12 border-t pt-10 first-of-type:mt-6 first-of-type:border-t-0 first-of-type:pt-0">
      {wide && (
        <PhotoFrame
          photo={banner}
          aspect={2.4}
          tilt={false}
          sizes="(min-width: 768px) 820px, 95vw"
          className="mb-9"
        />
      )}
      <div className="@3xl:grid @3xl:grid-cols-[minmax(0,1fr)_13rem] @3xl:gap-10">
        <div>
          <h4 className="type-display text-[1.875rem] @2xl:text-[2.25rem]">{school.name}</h4>
          <p className="mt-1.5 text-lg">{school.degree}</p>
          <p className="type-meta text-muted mt-1 flex flex-wrap gap-x-4 text-sm">
            <span>{school.where}</span>
            <span>{school.when}</span>
          </p>
          <ul aria-label="Grades and honors" className="mt-4 flex flex-wrap gap-2">
            <li className="tape tape-paper text-xs">GPA {school.gpa}</li>
            {school.honours.map((honour) => (
              <li key={honour} className="tape tape-paper text-xs whitespace-normal">
                {honour}
              </li>
            ))}
          </ul>
          <p className="mt-5 max-w-[60ch] text-[1.0625rem] leading-relaxed">{school.summary}</p>

          {school.courses && (
            <ul aria-label="Courses" className="divide-line border-line mt-5 divide-y border-y">
              {school.courses.map((course) => (
                <Course key={course.code} course={course} />
              ))}
            </ul>
          )}
          {school.highlights && (
            <ul className="marker:text-powder mt-4 max-w-[62ch] list-disc space-y-2.5 pl-5 leading-relaxed">
              {school.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          )}
        </div>
        {(wide ? rest : (school.photos ?? [])).map((photo) => (
          <PhotoFrame
            key={photo.caption}
            photo={photo}
            sizes="(min-width: 768px) 260px, 80vw"
            className="mt-8 max-w-60 @3xl:mt-14"
          />
        ))}
      </div>
    </article>
  );
}

export function Education({ schools }: { schools: School[] }) {
  return (
    <>
      {schools.map((school) => (
        <SchoolEntry key={school.name} school={school} />
      ))}
    </>
  );
}
