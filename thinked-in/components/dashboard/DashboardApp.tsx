"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import OnboardingFlow from "./OnboardingFlow";
import ChatApp from "./ChatApp";

const IMPORTED_KEY = "thinkedin:hasImported";

type Stage = "init" | "onboarding" | "chat";

// Top-level dashboard state machine. Source of truth for "has the user imported
// a network?" is the SERVER (their connections in the DB), checked on load — so
// returning users (and across devices) land straight in chat. localStorage is
// only an optimistic hint to avoid a flash before the check resolves.
export default function DashboardApp() {
  const [stage, setStage] = useState<Stage>("init");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/status", { cache: "no-store" });
        const data = await res.json();
        if (cancelled) return;
        if (data?.hasConnections) {
          localStorage.setItem(IMPORTED_KEY, "true");
          setStage("chat");
        } else {
          localStorage.removeItem(IMPORTED_KEY);
          setStage("onboarding");
        }
      } catch {
        // Network/error fallback: trust the local hint.
        if (!cancelled) setStage(localStorage.getItem(IMPORTED_KEY) === "true" ? "chat" : "onboarding");
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const handleComplete = useCallback(() => {
    localStorage.setItem(IMPORTED_KEY, "true");
    setStage("chat");
  }, []);

  const handleReimport = useCallback(() => {
    localStorage.removeItem(IMPORTED_KEY);
    setStage("onboarding");
  }, []);

  if (stage === "init") {
    return (
      <main className="relative flex h-dvh items-center justify-center">
        <div className="aurora" aria-hidden />
        <Loader2 className="relative z-10 h-6 w-6 animate-spin text-muted" />
      </main>
    );
  }

  if (stage === "onboarding") {
    return <OnboardingFlow onComplete={handleComplete} />;
  }

  return <ChatApp onReimport={handleReimport} />;
}
