import { motion } from "framer-motion";
import { Wallet, ArrowUpRight, TrendingUp } from "lucide-react";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";

interface EnhancedBalanceCardProps {
  balance: number;
  onTopUp: () => void;
}

export function EnhancedBalanceCard({ balance, onTopUp }: EnhancedBalanceCardProps) {
  const isLowBalance = balance < 5000;

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.05 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-purple-500/5 to-cyan-500/10 backdrop-blur-xl border border-white/10 p-6"
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-cyan-500/20 opacity-50" />
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/30 blur-[80px] rounded-full animate-pulse-slow" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/20 border border-primary/30">
              <Wallet className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-white/50">Your Balance</p>
              {isLowBalance && (
                <p className="text-[10px] text-amber-400 font-medium">⚠️ Low balance</p>
              )}
            </div>
          </div>
          
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          >
            <TrendingUp className="w-5 h-5 text-cyan-400" />
          </motion.div>
        </div>

        {/* Balance Display */}
        <div className="mb-6">
          <div className="flex items-baseline gap-2">
            <AnimatedCounter 
              value={balance} 
              decimals={0}
              className="font-display text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-primary to-cyan-400"
            />
            <span className="text-2xl font-bold text-white/50">Ks</span>
          </div>
          
          {/* Progress bar showing balance health */}
          <div className="mt-4 h-2 bg-white/[0.06] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, (balance / 20000) * 100)}%` }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              className={`h-full rounded-full ${
                isLowBalance 
                  ? 'bg-gradient-to-r from-amber-500 to-red-500' 
                  : 'bg-gradient-to-r from-primary to-cyan-500'
              }`}
              style={{
                boxShadow: isLowBalance 
                  ? '0 0 10px rgba(251, 191, 36, 0.5)' 
                  : '0 0 10px rgba(139, 92, 246, 0.5)'
              }}
            />
          </div>
          
          {isLowBalance && (
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-amber-400 mt-2 font-medium"
            >
              Consider topping up to continue using services
            </motion.p>
          )}
        </div>

        {/* Action Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onTopUp}
          className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-primary to-purple-600 text-white font-bold text-sm hover:shadow-lg hover:shadow-primary/50 transition-all"
        >
          <ArrowUpRight className="w-5 h-5" />
          Top Up
        </motion.button>
      </div>
    </motion.div>
  );
}
