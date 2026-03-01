import React, { createContext, useContext, useState, useCallback } from "react";

type View = "trails" | "trail-detail" | "buddy";

interface HikingContextValue {
  currentView: View;
  selectedTrailSlug: string | null;
  navigateToTrail: (slug: string) => void;
  navigateToList: () => void;
  navigateToBuddy: () => void;
}

const HikingContext = createContext<HikingContextValue | null>(null);

export function HikingProvider({ children }: { children: React.ReactNode }) {
  const [currentView, setCurrentView] = useState<View>("trails");
  const [selectedTrailSlug, setSelectedTrailSlug] = useState<string | null>(null);

  const navigateToTrail = useCallback((slug: string) => {
    setSelectedTrailSlug(slug);
    setCurrentView("trail-detail");
  }, []);

  const navigateToList = useCallback(() => {
    setCurrentView("trails");
    setSelectedTrailSlug(null);
  }, []);

  const navigateToBuddy = useCallback(() => {
    setCurrentView("buddy");
  }, []);

  return (
    <HikingContext.Provider value={{
      currentView,
      selectedTrailSlug,
      navigateToTrail,
      navigateToList,
      navigateToBuddy,
    }}>
      {children}
    </HikingContext.Provider>
  );
}

export function useHiking() {
  const ctx = useContext(HikingContext);
  if (!ctx) throw new Error("useHiking must be used within HikingProvider");
  return ctx;
}
