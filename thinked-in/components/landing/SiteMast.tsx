import Image from "next/image";
import Link from "next/link";
import logo from "@/public/thinkedinBACK.png";

// Sticky top mast: brand logo (top-left), "The Proof" link (top-right). Lives
// outside the fading hero content so `position: sticky` isn't broken by a
// transformed/overflow ancestor.
export default function SiteMast() {
  return (
    <header className="sticky top-0 z-50 flex h-[80px] items-center justify-between border-b border-black/10 bg-white/80 px-6 shadow-sm backdrop-blur-md sm:px-8">
      <Image
        src={logo}
        alt="thinkedin"
        priority
        className="h-10 w-auto -translate-y-0.5 sm:h-12"
      />
      <Link
        href="/proof"
        className="rounded-full bg-gradient-blue px-5 py-2.5 text-sm font-semibold text-white shadow-md ring-1 ring-white/40 transition-all hover:scale-[1.04] hover:brightness-110 active:scale-95"
      >
        The Proof
      </Link>
    </header>
  );
}
