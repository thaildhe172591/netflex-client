import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyResultsProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyResults({
  title,
  description,
  actionLabel = "Reset filters",
  onAction,
}: EmptyResultsProps) {
  return (
    <div className="glass-panel rounded-2xl border border-white/10 px-5 py-8 text-center">
      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-muted-foreground">
        <SearchX className="h-5 w-5" />
      </div>
      <h3 className="mt-4 text-base font-semibold text-foreground">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      {onAction && (
        <Button
          type="button"
          variant="outline"
          onClick={onAction}
          className="mt-4 border-white/10 bg-white/5 text-foreground hover:bg-white/10"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
