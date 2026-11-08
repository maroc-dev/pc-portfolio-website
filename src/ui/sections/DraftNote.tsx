/** Marks placeholder content so nothing unconfirmed passes as fact. */
export function DraftNote() {
  return (
    <p className="border-line text-muted mb-8 flex items-start gap-3 rounded-md border border-dashed px-3.5 py-2.5 text-sm">
      <span className="tape tape-paper text-xs">Draft</span>
      <span>Marco is still writing this section, so parts of it are placeholder text.</span>
    </p>
  );
}
