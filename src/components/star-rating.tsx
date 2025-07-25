"use client";

import { Star } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  className?: string;
  interactive?: boolean;
  size?: "sm" | "md" | "lg";
  showRating?: boolean;
  onRatingChange?: (rating: number) => void;
}

export function StarRating({
  rating,
  maxStars = 5,
  className,
  interactive = false,
  size = "md",
  showRating = false,
  onRatingChange,
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(rating);
  const [tempRating, setTempRating] = useState(rating);

  useEffect(() => {
    setTempRating(rating);
  }, [rating]);

  const sizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-6 h-6",
  };

  const handleClick = (starIndex: number) => {
    if (!interactive) return;
    const newRating = starIndex + 1;
    setTempRating(newRating);
    onRatingChange?.(newRating);
  };

  const handleMouseEnter = (starIndex: number) => {
    if (!interactive) return;
    setHoverRating(starIndex + 1);
  };

  const handleMouseLeave = () => {
    if (!interactive) return;
    setHoverRating(0);
  };

  const displayRating = interactive ? hoverRating || tempRating : rating;

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {Array.from({ length: maxStars }, (_, index) => {
        const fillPercentage = Math.max(0, Math.min(1, displayRating - index));
        const isHovered = interactive && hoverRating > index;
        const isSelected = interactive && tempRating > index;

        return (
          <div
            key={index}
            className={cn(
              "relative",
              interactive &&
                "cursor-pointer transition-transform hover:scale-110"
            )}
            onClick={() => handleClick(index)}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          >
            <Star
              className={cn(
                sizeClasses[size],
                interactive
                  ? "text-gray-300 hover:text-gray-200"
                  : "text-gray-300"
              )}
            />

            <div
              className="absolute top-0 left-0 overflow-hidden"
              style={{ width: `${fillPercentage * 100}%` }}
            >
              <Star
                className={cn(
                  sizeClasses[size],
                  interactive && (isHovered || isSelected)
                    ? "text-yellow-300 fill-yellow-300"
                    : "text-yellow-400 fill-yellow-400"
                )}
              />
            </div>
          </div>
        );
      })}

      {showRating && !interactive && (
        <span className="ml-2 text-sm text-muted-foreground">
          {rating.toFixed(1)}/{maxStars}
        </span>
      )}

      {interactive && (
        <span className="ml-2 text-sm text-muted-foreground">
          {tempRating > 0 ? `${tempRating}/${maxStars}` : "Select a rating"}
        </span>
      )}
    </div>
  );
}
