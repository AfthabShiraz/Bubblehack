"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Lottie, { type LottieRefCurrentProps } from "lottie-react";
// Bubble-pop animation. To swap for a different one, replace this file with any
// LottieFiles bubble-pop JSON (public/lottie/bubble-pop.json).
import bubblePop from "@/public/lottie/bubble-pop.json";

// "Get started" as a water bubble (Lottie) that pops on click, then plays an
// iris transition into the sign-in page.
export default function GetStartedBubble() {
  const router = useRouter();
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const [popped, setPopped] = useState(false);

  const handleClick = () => {
    if (popped) return;
    setPopped(true);
    lottieRef.current?.goToAndPlay(0, true);
    // Navigate once the bubble has popped and the iris has covered the screen.
    setTimeout(() => router.push("/sign-in"), 820);
  };

  return (
    <>
      <div className="relative mt-8 inline-flex items-center justify-center">
        {/* Bubble-pop animation, played on click (sits behind the button). */}
        <div
          aria-hidden
          className={`pointer-events-none absolute h-52 w-52 transition-opacity duration-150 ${
            popped ? "opacity-100" : "opacity-0"
          }`}
        >
          <Lottie
            lottieRef={lottieRef}
            animationData={bubblePop}
            autoplay={false}
            loop={false}
          />
        </div>

        <AnimatePresence>
          {!popped && (
            <motion.button
              onClick={handleClick}
              aria-label="Get started"
              className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-blue px-7 py-3.5 text-base font-semibold text-white shadow-[0_10px_30px_-8px_rgba(10,102,194,0.6)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0a66c2]/40"
              initial={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
              exit={{ scale: 1.4, opacity: 0 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            >
              {/* Glossy bubble highlight */}
              <span
                aria-hidden
                className="pointer-events-none absolute -left-2 -top-3 h-10 w-16 rounded-full bg-white/35 blur-md"
              />
              <span className="relative z-10 inline-flex items-center gap-2">
                Get started
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Iris overlay expanding to cover the page before navigation */}
      <AnimatePresence>
        {popped && (
          <motion.div
            className="fixed inset-0 z-50 bg-gradient-blue"
            aria-hidden
            initial={{ clipPath: "circle(0% at 50% 42%)" }}
            animate={{ clipPath: "circle(150% at 50% 42%)" }}
            transition={{ duration: 0.6, ease: "easeInOut", delay: 0.18 }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
