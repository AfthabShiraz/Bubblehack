import Image from "next/image";
import { PencilLine } from "lucide-react";
import type { PostData } from "@/lib/types";

// A drafted post / outreach message, rendered as a LinkedIn-style card.
export default function PostCard({ post }: { post: PostData }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-3">
        {post.author ? (
          <Image
            src={post.author.avatarUrl}
            alt={post.author.name}
            width={40}
            height={40}
            className="rounded-full ring-2 ring-black/5"
            unoptimized
          />
        ) : (
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-blue">
            <PencilLine className="h-4 w-4 text-white" />
          </span>
        )}
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">
            {post.author?.name ?? "Draft"}
          </p>
          {post.author ? (
            <p className="truncate text-xs text-muted">{post.author.role}</p>
          ) : (
            <p className="truncate text-xs text-muted">Suggested by thinkedin</p>
          )}
        </div>
      </div>

      {post.title ? (
        <p className="mb-1.5 font-semibold text-foreground">{post.title}</p>
      ) : null}
      <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
        {post.body}
      </p>
    </div>
  );
}
