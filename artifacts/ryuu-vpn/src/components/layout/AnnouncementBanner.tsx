import { useState } from "react";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";

export function AnnouncementBanner() {
  const { t } = useLang();
  const [dismissed, setDismissed] = useState(false);
  const [expanded, setExpanded] = useState(false);

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          <div className="relative bg-gradient-to-r from-purple-950 via-[#1a0a2e] to-blue-950 border-b border-purple-500/30">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-transparent to-cyan-600/10 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 relative z-10">
              <div className="flex items-start gap-3">
                {/* Icon */}
                <span className="text-xl shrink-0 mt-0.5">📣</span>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-white text-sm md:text-base leading-snug">
                    {t("ann.title")}
                  </p>

                  <AnimatePresence initial={false}>
                    {expanded && (
                      <motion.div
                        key="expanded"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <p className="mt-2 text-purple-200/90 text-sm leading-relaxed">
                          {t("ann.body")}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1">
                          {t("ann.plans").split("   ").map((item, i) => (
                            <span
                              key={i}
                              className="text-xs text-cyan-300/90 font-medium"
                            >
                              {item.trim()}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Toggle */}
                  <button
                    onClick={() => setExpanded(!expanded)}
                    className="mt-1 flex items-center gap-1 text-xs text-purple-300 hover:text-white transition-colors font-medium"
                  >
                    {expanded ? (
                      <>
                        <ChevronUp className="w-3 h-3" /> Show less
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-3 h-3" /> Read more
                      </>
                    )}
                  </button>
                </div>

                {/* Dismiss button */}
                <button
                  onClick={() => setDismissed(true)}
                  aria-label={t("ann.dismiss")}
                  className="shrink-0 mt-0.5 flex items-center gap-1.5 text-xs text-purple-300 hover:text-white transition-colors border border-purple-500/40 hover:border-purple-400/70 rounded-full px-2.5 py-1 bg-purple-900/30 hover:bg-purple-800/40"
                >
                  <X className="w-3 h-3" />
                  <span className="hidden sm:inline">{t("ann.dismiss")}</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
