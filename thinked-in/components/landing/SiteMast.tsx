import Image from "next/image";
import logo from "@/public/thinkedinBACK.png";

// Sticky top mast with the brand logo (top-left). Lives outside the fading hero
// content so `position: sticky` isn't broken by a transformed/overflow ancestor.
export default function SiteMast() {
  return (
    <header className="sticky top-0 z-50 flex h-[80px] items-center border-b border-black/10 bg-white/80 px-6 shadow-sm backdrop-blur-md sm:px-8">
      <Image
        src={logo}
        alt="thinkedin"
        priority
        className="h-10 w-auto -translate-y-0.5 sm:h-12"
      />
    </header>
  );
}
