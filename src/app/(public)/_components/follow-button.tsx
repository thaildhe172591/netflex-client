import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useFollowStatus } from "@/hooks/follow/use-follow-status";
import { useFollow, useUnfollow } from "@/hooks/follow/use-follow";
import { Heart, HeartOff } from "lucide-react";

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

  const isFollowing = status?.data && !error;
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
      variant={isFollowing ? "destructive" : "outline"}
      size="sm"
      onClick={handleToggleFollow}
      disabled={isLoading || isProcessing}
      className={className}
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
