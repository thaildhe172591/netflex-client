import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LoadingButtonProps extends React.ComponentProps<typeof Button> {
  isLoading?: boolean;
  loadingLabel?: string;
}

export function LoadingButton({
  isLoading,
  children,
  disabled,
  loadingLabel,
  ...props
}: LoadingButtonProps) {
  return (
    <Button disabled={disabled || isLoading} {...props}>
      {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
      {isLoading && loadingLabel ? loadingLabel : children}
    </Button>
  );
}
