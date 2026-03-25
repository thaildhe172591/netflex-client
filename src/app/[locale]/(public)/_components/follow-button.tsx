import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useFollowStatus } from "@/hooks/follow/use-follow-status";
import { useFollow, useUnfollow } from "@/hooks/follow/use-follow";
import { Heart, HeartOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface FollowButtonProps {
  targetId: string;
  targetType: string;
  className?: string;
}

export function FollowButton({
  targetId,
  targetType,
  className,
}: FollowButtonProps) {
  const auth = useAuth();
  const {
    data: status,
    isLoading,
    error,
  } = useFollowStatus({
    targetId,
    targetType,
  });
  const followMutation = useFollow();
  const unfollowMutation = useUnfollow();

  if (!auth.data) return null;

  const isFollowing = !!status?.isFollow && !error;
  const isProcessing = followMutation.isPending || unfollowMutation.isPending;

  const handleToggleFollow = () => {
    if (isFollowing) {
      unfollowMutation.mutate({ targetId, targetType });
    } else {
      followMutation.mutate({ targetId, targetType });
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleToggleFollow}
      disabled={isLoading || isProcessing}
      className={cn(
        "border-white/10 bg-white/5 text-foreground hover:bg-white/10",
        isFollowing && "border-primary/40 bg-primary/20",
        className
      )}
    >
      {isFollowing ? (
        <>
          <HeartOff className="w-4 h-4 mr-2" />
          Unfollow
        </>
      ) : (
        <>
          <Heart className="w-4 h-4 mr-2" />
          Follow
        </>
      )}
    </Button>
  );
}
