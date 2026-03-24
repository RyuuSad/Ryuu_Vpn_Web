import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-md"
            >
              {/* Modal Content */}
              <div className="relative bg-gradient-to-br from-purple-900/95 via-purple-800/95 to-indigo-900/95 backdrop-blur-xl rounded-3xl border border-purple-500/30 shadow-2xl overflow-hidden">
                {/* Decorative gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-indigo-500/10 pointer-events-none" />
                
                {/* Close button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Content */}
                <div className="relative p-8 space-y-6">
                  {/* Title */}
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-white leading-tight">
                      {title}
                    </h2>
                  </div>

                  {/* Message */}
                  <div className="space-y-4">
                    <p className="text-white/90 leading-relaxed whitespace-pre-wrap text-sm">
                      {message}
                    </p>
                  </div>

                  {/* Dismiss Button */}
                  <button
                    onClick={onClose}
                    className="w-full py-4 px-6 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white font-bold text-lg rounded-2xl transition-all shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50"
                  >
                    DISMISS
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
