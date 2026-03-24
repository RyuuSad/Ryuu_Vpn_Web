import { motion, AnimatePresence } from "framer-motion";

interface AnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
}

export function AnnouncementModal({ isOpen, onClose, title, message }: AnnouncementModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 24 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[101] flex items-center justify-center px-4 py-8 pointer-events-none"
          >
            <div className="pointer-events-auto w-full max-w-lg relative rounded-2xl overflow-hidden shadow-2xl border border-purple-500/30 max-h-[85vh] flex flex-col">
              {/* Gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#0e0018] via-[#130928] to-[#050d1a]" />
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-700/20 via-transparent to-cyan-700/15 pointer-events-none" />
              <div className="absolute -top-20 -right-20 w-56 h-56 bg-purple-600/20 blur-[60px] rounded-full pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-cyan-600/15 blur-[50px] rounded-full pointer-events-none" />

              {/* Scrollable content */}
              <div className="relative z-10 p-6 sm:p-8 overflow-y-auto flex-1">
                <h2 className="text-white font-bold text-lg sm:text-xl leading-snug mb-4">
                  {title}
                </h2>
                <p className="text-purple-200/85 text-sm leading-relaxed whitespace-pre-wrap">
                  {message}
                </p>
              </div>

              {/* Dismiss — sticky at bottom */}
              <div className="relative z-10 px-6 sm:px-8 pb-6 sm:pb-8 pt-3 shrink-0">
                <button
                  onClick={onClose}
                  className="w-full py-3 rounded-xl bg-primary/20 hover:bg-primary/30 border border-primary/40 hover:border-primary/70 text-primary font-bold text-sm tracking-widest uppercase transition-all"
                >
                  DISMISS
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
