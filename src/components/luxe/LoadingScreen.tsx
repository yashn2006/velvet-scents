import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export function LoadingScreen() {
  const [done, setDone] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setDone(true), 900);
    return () => clearTimeout(t);
  }, []);
  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[100] grid place-items-center bg-[#0a0a0a]"
        >
          <div className="relative h-16 w-16">
            <div className="absolute inset-0 rounded-full border-2 border-[#2a2a2a]" />
            <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-[#c9a84c] gold-spin" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}