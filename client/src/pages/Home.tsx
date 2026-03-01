import { useState } from "react";
import { Map, Users, MessageSquare, Menu, X, Mountain } from "lucide-react";
import { HikingProvider, useHiking } from "@/contexts/HikingContext";
import { TrailsPage } from "./TrailsPage";
import { TrailDetailPage } from "./TrailDetailPage";
import { BuddyPage } from "./BuddyPage";
import { HikingChatPanel } from "@/components/HikingChatPanel";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

type NavTab = "trails" | "buddy";

function MainLayout() {
  const { currentView, navigateToList, navigateToBuddy } = useHiking();
  const { user, isAuthenticated, logout } = useAuth();
  const [activeNav, setActiveNav] = useState<NavTab>("trails");
  const [chatOpen, setChatOpen] = useState(false); // mobile chat toggle

  const handleNavTrails = () => {
    setActiveNav("trails");
    navigateToList();
  };

  const handleNavBuddy = () => {
    setActiveNav("buddy");
    navigateToBuddy();
  };

  const renderLeftContent = () => {
    if (currentView === "trail-detail") return <TrailDetailPage />;
    if (activeNav === "buddy") return <BuddyPage />;
    return <TrailsPage />;
  };

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Top Navigation Bar */}
      <header className="flex-shrink-0 h-14 border-b border-border bg-card flex items-center px-4 gap-4 z-10 shadow-sm">
        {/* Logo */}
        <div className="flex items-center gap-2 mr-2">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <Mountain className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-serif-sc font-semibold text-foreground text-base hidden sm:block">
            徒步指南
          </span>
        </div>

        {/* Nav Tabs */}
        <nav className="flex items-center gap-1 flex-1">
          <button
            onClick={handleNavTrails}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeNav === "trails" && currentView !== "buddy"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <Map className="w-3.5 h-3.5" />
            <span>线路探索</span>
          </button>
          <button
            onClick={handleNavBuddy}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeNav === "buddy" || currentView === "buddy"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>找搭子</span>
          </button>
        </nav>

        {/* Right: Auth + Mobile Chat Toggle */}
        <div className="flex items-center gap-2">
          {/* Mobile chat toggle */}
          <button
            onClick={() => setChatOpen(!chatOpen)}
            className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span className="hidden sm:block">AI向导</span>
          </button>

          {/* Auth */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-semibold">
                {(user?.name || "U")[0]}
              </div>
              <button
                onClick={() => logout()}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
              >
                退出
              </button>
            </div>
          ) : (
            <button
              onClick={() => window.location.href = getLoginUrl()}
              className="text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              登录
            </button>
          )}
        </div>
      </header>

      {/* Main Content: Left + Right Panels */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Main Content (mobile: full when not chatOpen; desktop: 55%) */}
        <div
          className={`overflow-hidden flex flex-col transition-all duration-300 ${
            chatOpen ? "hidden" : "flex w-full"
          } lg:flex lg:w-0 lg:flex-1`}
        >
          {renderLeftContent()}
        </div>

        {/* Divider (desktop only) */}
        <div className="hidden lg:block w-px bg-border flex-shrink-0" />

        {/* Right Panel - AI Chat (mobile: full when chatOpen; desktop: 45%) */}
        <div
          className={`overflow-hidden flex flex-col transition-all duration-300 ${
            chatOpen ? "flex w-full" : "hidden"
          } lg:flex lg:flex-shrink-0`}
          style={{ width: chatOpen ? "100%" : undefined, minWidth: 0 }}
        >
          <div className="lg:w-[420px] xl:w-[460px] h-full flex flex-col">
            <HikingChatPanel />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <HikingProvider>
      <MainLayout />
    </HikingProvider>
  );
}
