import { useState, useEffect, useCallback } from "react";

export interface WatchHistoryItem {
  serieId: number;
  episodeId: number;
  episodeNumber: number;
  watchedAt: Date;
  progress?: number; // Progress in seconds
}

const WATCH_HISTORY_KEY = "netflex_watch_history";

export const useWatchHistory = () => {
  const [watchHistory, setWatchHistory] = useState<WatchHistoryItem[]>([]);

  // Load watch history from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(WATCH_HISTORY_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as WatchHistoryItem[];
        setWatchHistory(
          parsed.map((item) => ({
            ...item,
            watchedAt: new Date(item.watchedAt),
          }))
        );
      } catch (error) {
        console.error("Error parsing watch history:", error);
        setWatchHistory([]);
      }
    }
  }, []);

  // Save to localStorage whenever watch history changes
  useEffect(() => {
    if (watchHistory.length > 0) {
      localStorage.setItem(WATCH_HISTORY_KEY, JSON.stringify(watchHistory));
    }
  }, [watchHistory]);

  const addToWatchHistory = useCallback(
    (item: Omit<WatchHistoryItem, "watchedAt">) => {
      setWatchHistory((prev) => {
        // Remove existing entry for the same episode
        const filtered = prev.filter(
          (h) => h.serieId !== item.serieId || h.episodeId !== item.episodeId
        );

        // Add new entry at the beginning
        const newHistory = [{ ...item, watchedAt: new Date() }, ...filtered];

        // Keep only last 100 entries
        return newHistory.slice(0, 100);
      });
    },
    []
  );

  const getLastWatchedEpisode = useCallback(
    (serieId: number): WatchHistoryItem | null => {
      return watchHistory.find((item) => item.serieId === serieId) || null;
    },
    [watchHistory]
  );

  const removeFromWatchHistory = useCallback(
    (serieId: number, episodeId?: number) => {
      setWatchHistory((prev) => {
        if (episodeId) {
          return prev.filter(
            (h) => !(h.serieId === serieId && h.episodeId === episodeId)
          );
        }
        return prev.filter((h) => h.serieId !== serieId);
      });
    },
    []
  );

  const clearWatchHistory = useCallback(() => {
    setWatchHistory([]);
    localStorage.removeItem(WATCH_HISTORY_KEY);
  }, []);

  const getWatchHistoryForSerie = useCallback(
    (serieId: number): WatchHistoryItem[] => {
      return watchHistory.filter((item) => item.serieId === serieId);
    },
    [watchHistory]
  );

  return {
    watchHistory,
    addToWatchHistory,
    getLastWatchedEpisode,
    removeFromWatchHistory,
    clearWatchHistory,
    getWatchHistoryForSerie,
  };
};
