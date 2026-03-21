import { Shield, Zap, Globe, FileX } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Shield,
    title: "Military-Grade Encryption",
    desc: "AES-256 encryption keeps your data protected from hackers, ISPs, and surveillance.",
    color: "from-purple-500/20 to-purple-500/5",
    glow: "rgba(168,85,247,0.6)",
  },
  {
    icon: Zap,
    title: "Lightning Fast Speed",
    desc: "Singapore servers optimized for Gaming, Streaming 4K, and Social Media with zero throttling.",
    color: "from-cyan-500/20 to-cyan-500/5",
    glow: "rgba(6,182,212,0.6)",
  },
  {
    icon: Globe,
    title: "Singapore Servers",
    desc: "Premium Singapore infrastructure — real servers, not shared proxies. Lowest latency in the region.",
    color: "from-purple-500/20 to-purple-500/5",
    glow: "rgba(168,85,247,0.6)",
  },
  {
    icon: FileX,
    title: "Zero Logs Policy",
    desc: "We never store browsing history, connection logs, or IP addresses. Your privacy is absolute.",
    color: "from-cyan-500/20 to-cyan-500/5",
    glow: "rgba(6,182,212,0.6)",
  },
];

export function Features() {
  return (
    <section
      id="features"
      className="py-28 md:py-36 relative overflow-hidden bg-background scroll-mt-24"
    >
      {/* Decorative background glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-primary/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[300px] bg-secondary/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-primary text-xs font-bold uppercase tracking-[0.25em] mb-4"
          >
            Built Different
          </motion.p>
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl md:text-5xl font-bold mb-5 uppercase tracking-wide text-white"
          >
            Why Choose{" "}
            <span className="text-primary drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">
              RYUU VPN?
            </span>
          </motion.h2>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-white/50 max-w-xl mx-auto text-base"
          >
            Singapore's fastest private network — built for speed, security,
            and reliability.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, idx) => (
            <motion.div
              key={idx}
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="group relative p-8 rounded-2xl bg-white/[0.03] border border-white/[0.07] hover:border-white/20 transition-all duration-500 hover:-translate-y-2 overflow-hidden"
            >
              {/* Card glow */}
              <div
                className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: feat.glow.replace("0.6", "0.15") }}
              />

              <div
                className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feat.color} flex items-center justify-center mb-7 border border-white/10`}
              >
                <feat.icon
                  className="w-7 h-7"
                  style={{ color: feat.glow.replace("rgba(", "rgb(").replace(", 0.6)", ")") }}
                />
              </div>
              <h3 className="font-display text-lg font-bold mb-3 text-white tracking-wide">
                {feat.title}
              </h3>
              <p className="text-white/50 leading-relaxed text-sm">{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
