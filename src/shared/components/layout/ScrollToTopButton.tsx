import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronUp } from "lucide-react";
import { Button } from "@shared/ui/button";
import { cn } from "@shared/lib/utils";

const SCROLL_THRESHOLD_PX = 400;

export function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > SCROLL_THRESHOLD_PX);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    const instant =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: instant ? "auto" : "smooth" });
  };

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          role="presentation"
          initial={reduceMotion ? false : { opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={reduceMotion ? undefined : { opacity: 0, scale: 0.9, y: 10 }}
          transition={{ duration: reduceMotion ? 0 : 0.2 }}
          className="fixed bottom-6 right-6 z-30"
        >
          <Button
            type="button"
            size="icon"
            onClick={scrollToTop}
            className={cn(
              "size-11 rounded-full shadow-md",
              "bg-[#E00122] text-white hover:bg-[#c00115]",
              "focus-visible:ring-[#E00122]/35"
            )}
            aria-label="Back to top"
          >
            <ChevronUp className="size-5" aria-hidden />
          </Button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
