"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

// Glass iridescent bubble. On click it implodes with a bloom + expanding rings
// (a glassy "surface tension breaks" pop), then asks the parent to transition.
export default function GetStartedBubble({ onStart }: { onStart: () => void }) {
  const [popped, setPopped] = useState(false);

  const handleClick = () => {
    if (popped) return;
    setPopped(true);
    onStart();
  };

  return (
    <div className="relative mt-8 inline-flex items-center justify-center">
      {/* Bloom flash + expanding rings on pop */}
      <AnimatePresence>
        {popped && (
          <>
            <motion.span
              key="bloom"
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white blur-2xl"
              initial={{ scale: 0.4, opacity: 0.9 }}
              animate={{ scale: 1.9, opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
            <motion.span
              key="ring1"
              aria-hidden
              className="iridescent-sheen pointer-events-none absolute left-1/2 top-1/2 h-20 w-40 rounded-full opacity-70 blur-[1px]"
              style={{ translateX: "-50%", translateY: "-50%" }}
              initial={{ scale: 0.5, opacity: 0.8 }}
              animate={{ scale: 2.6, opacity: 0 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
            />
            <motion.span
              key="ring2"
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 h-16 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/70"
              initial={{ scale: 0.6, opacity: 0.7 }}
              animate={{ scale: 2.2, opacity: 0 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
            />
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!popped && (
          <motion.button
            onClick={handleClick}
            aria-label="Get started"
            className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full border border-white/60 bg-white/20 px-8 py-3.5 text-base font-semibold text-[#0a3d72] shadow-[0_10px_30px_-8px_rgba(10,102,194,0.45),inset_0_1px_2px_rgba(255,255,255,0.85),inset_0_-6px_14px_rgba(10,102,194,0.12)] backdrop-blur-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0a66c2]/40"
            initial={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            exit={{ scale: [1.12, 0], opacity: [1, 0], rotate: 8 }}
            transition={{ duration: 0.3, ease: "easeIn", times: [0.25, 1] }}
          >
            {/* Iridescent shimmer (clipped to the pill) */}
            <span
              aria-hidden
              className="iridescent-sheen pointer-events-none absolute left-1/2 top-1/2 h-[260%] w-[260%] opacity-40 mix-blend-screen"
            />
            {/* Specular highlight */}
            <span
              aria-hidden
              className="pointer-events-none absolute -left-1 -top-3 h-9 w-20 rounded-full bg-white/55 blur-md"
            />
            <span className="relative z-10 inline-flex items-center gap-2">
              Get started
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
