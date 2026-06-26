import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export function LoadingScreen() {
  const [done, setDone] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setDone(true), 2200);
    return () => clearTimeout(t);
  }, []);
  const letters = "Maison Oudh".split("");
  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] grid place-items-center bg-[#0a0a0a]"
        >
          <div className="flex flex-col items-center gap-6">
            <h1 className="font-display flex select-none gap-[0.04em] text-4xl text-[#c9a84c] md:text-6xl" aria-label="Maison Oudh">
              {letters.map((ch, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.08, duration: 0.5, ease: "easeOut" }}
                  style={{ display: "inline-block", minWidth: ch === " " ? "0.35em" : undefined }}
                >
                  {ch === " " ? "\u00a0" : ch}
                </motion.span>
              ))}
            </h1>
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.6, ease: "easeOut" }}
              className="h-px w-32 origin-left bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}