/** Marks placeholder content so nothing unconfirmed passes as fact. */
export function DraftNote() {
  return (
    <p className="border-amber/30 bg-amber/5 text-dust mb-6 rounded-lg border px-3 py-2 text-sm">
      Draft: Marco is still writing this section, so parts of it are placeholder text.
    </p>
  );
}
