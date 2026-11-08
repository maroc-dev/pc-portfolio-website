import type { Hobby } from "@/content/types";
import { PhotoFrame } from "./PhotoFrame";

export function Hobbies({ hobbies }: { hobbies: Hobby[] }) {
  return (
    <ul className="mt-7 grid gap-x-8 gap-y-10 @xl:grid-cols-3">
      {hobbies.map((hobby) => (
        <li key={hobby.name}>
          <PhotoFrame photo={hobby.photo} sizes="(min-width: 768px) 260px, 80vw" />
          <h4 className="type-label mt-5 text-lg">{hobby.name}</h4>
          <p className="text-muted mt-1 leading-relaxed">{hobby.detail}</p>
        </li>
      ))}
    </ul>
  );
}
