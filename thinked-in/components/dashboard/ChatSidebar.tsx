"use client";

import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { MessagesSquare, Plus, RotateCcw, Settings, Sparkles } from "lucide-react";
import type { ChatSession } from "@/lib/types";

interface ChatSidebarProps {
  sessions: ChatSession[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNewChat: () => void;
  onReimport: () => void;
}

export default function ChatSidebar({
  sessions,
  activeId,
  onSelect,
  onNewChat,
  onReimport,
}: ChatSidebarProps) {
  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-border bg-surface">
      {/* Brand — links back to the landing page */}
      <div className="flex items-center px-4 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-blue">
            <Sparkles className="h-4 w-4 text-white" />
          </span>
          <span className="text-sm font-semibold tracking-tight text-gradient">
            thinkedin
          </span>
        </Link>
      </div>

      {/* New chat */}
      <div className="px-3">
        <button
          onClick={onNewChat}
          className="flex w-full items-center gap-2 rounded-xl border border-border px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-black/[0.04]"
        >
          <Plus className="h-4 w-4" />
          New chat
        </button>
      </div>

      {/* Sessions */}
      <div className="scroll-slim mt-4 flex-1 overflow-y-auto px-3">
        <p className="px-2 pb-2 text-xs font-medium uppercase tracking-wide text-muted">
          Chats
        </p>
        <div className="flex flex-col gap-0.5">
          {sessions.map((s) => (
            <button
              key={s.id}
              onClick={() => onSelect(s.id)}
              className={`flex items-center gap-2 truncate rounded-lg px-2.5 py-2 text-left text-sm transition-colors ${
                s.id === activeId
                  ? "bg-[#0a66c2]/10 font-medium text-[#0a66c2]"
                  : "text-muted hover:bg-black/[0.04] hover:text-foreground"
              }`}
            >
              <MessagesSquare className="h-3.5 w-3.5 shrink-0 opacity-70" />
              <span className="truncate">{s.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Footer: re-import, settings, user */}
      <div className="border-t border-border p-3">
        <button
          onClick={onReimport}
          className="mb-1 flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-muted transition-colors hover:bg-black/[0.04] hover:text-foreground"
        >
          <RotateCcw className="h-4 w-4" />
          Re-import network
        </button>
        <button className="mb-2 flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-muted transition-colors hover:bg-black/[0.04] hover:text-foreground">
          <Settings className="h-4 w-4" />
          Settings
        </button>
        <div className="flex items-center gap-2 rounded-lg px-1 py-1">
          <UserButton appearance={{ elements: { userButtonAvatarBox: "h-8 w-8" } }} />
          <span className="text-sm text-muted">Account</span>
        </div>
      </div>
    </aside>
  );
}
