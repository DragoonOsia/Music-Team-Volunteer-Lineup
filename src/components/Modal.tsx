"use client";

// Bottom sheet on mobile (anchored to the bottom edge, rounded top corners
// only), centered dialog on desktop. Every Add/Edit modal in the app shares
// this shell so the sheet behavior only needs to be built once.
export default function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-scrim sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[85vh] w-full overflow-y-auto rounded-t-[20px] border border-rule border-t-2 border-t-rule-strong bg-card p-6 pb-8 sm:max-w-sm sm:rounded-[16px] sm:pb-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-4 font-serif text-2xl text-ink">{title}</h2>
        {children}
      </div>
    </div>
  );
}
