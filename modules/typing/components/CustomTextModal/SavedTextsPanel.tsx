"use client";

type SavedTextsPanelProps = {
  savedNames: string[];
  showSaved: boolean;
  onLoad: (name: string) => void;
  onDelete: (name: string) => void;
};

export const SavedTextsPanel = ({
  savedNames,
  showSaved,
  onLoad,
  onDelete,
}: SavedTextsPanelProps) => {
  if (!showSaved) return null;

  return (
    <div className="space-y-1">
      {savedNames.length === 0 ? (
        <p className="text-xs text-text-muted">No saved lessons</p>
      ) : (
        savedNames.map((name) => (
          <div key={name} className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onLoad(name)}
              className="min-w-0 flex-1 truncate text-left text-sm text-text-secondary transition-colors hover:text-accent"
            >
              {name}
            </button>
            <button
              type="button"
              onClick={() => onDelete(name)}
              className="text-xs text-text-muted transition-colors hover:text-error"
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
};
