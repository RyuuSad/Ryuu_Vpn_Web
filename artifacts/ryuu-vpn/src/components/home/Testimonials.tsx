import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useLang } from "@/context/LanguageContext";

const reviews = {
  en: [
    {
      initials: "KK",
      name: "Ko Kaung",
      role: "Gamer",
      text: "Gaming latency dropped massively after switching to RYUU VPN. Singapore servers are rock solid — zero lag even on peak hours.",
    },
    {
      initials: "MT",
      name: "Ma Thiri",
      role: "Content Creator",
      text: "4K YouTube streams without buffering. I use the Ultra Pro plan and it's worth every kyat. Data rollover is a huge plus!",
    },
    {
      initials: "ZW",
      name: "Ko Zaw Win",
      role: "Remote Worker",
      text: "RYUU VPN keeps my work connections secure and fast. The Premium Value plan gives me everything I need for a full month at an unbeatable price.",
    },
  ],
  my: [
    {
      initials: "KK",
      name: "ကိုကောင်း",
      role: "Gamer",
      text: "RYUU VPN သုံးပြီးနောက် Gaming Latency တော်တော်ကောင်းလာတယ်။ စင်ကာပူ Server တွေ သိပ်တည်ငြိမ်တယ် — Peak Hour မှာပဲ Lag မရှိဘူး။",
    },
    {
      initials: "MT",
      name: "မသီရိ",
      role: "Content Creator",
      text: "4K YouTube ကြည့်လို့ Buffer မဆိုက်တော့ဘူး။ Ultra Pro Plan သုံးနေတယ် — တစ်ကျပ်ကိုတစ်ကျပ် တန်တယ်။ Data Rollover ကတော့ Extra Bonus ပဲ!",
    },
    {
      initials: "ZW",
      name: "ကိုဇော်ဝင်း",
      role: "Remote Worker",
      text: "RYUU VPN က Work Connection တွေကို လုံခြုံပြီး မြန်မြန်ဆန်ဆန် ဖြစ်စေတယ်။ Premium Value Plan ကတစ်လစာ လိုအပ်တာ အကုန်ပြည့်တယ်၊ ဈေးနှုန်းလည်း ကောင်းတယ်။",
    },
  ],
};

export function Testimonials() {
  const { lang, t } = useLang();
  const currentReviews = reviews[lang];

  return (
    <section className="py-24 md:py-32 bg-background border-y border-white/5 relative">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-secondary/5 via-background to-background pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="font-display text-4xl md:text-5xl font-bold mb-4 uppercase text-white"
          >
            {t("test.title")}{" "}
            <span className="text-secondary drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]">
              {t("test.titleHighlight")}
            </span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {currentReviews.map((rev, idx) => (
            <motion.div
              key={idx}
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
              className="p-8 md:p-10 rounded-2xl bg-card/40 border border-white/10 hover:border-secondary/30 transition-colors shadow-lg"
            >
              <div className="flex text-secondary mb-8 gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current drop-shadow-[0_0_5px_rgba(6,182,212,0.8)]" />
                ))}
              </div>
              <p className="text-white/80 italic mb-10 leading-relaxed text-base">
                "{rev.text}"
              </p>
              <div className="flex items-center gap-4 mt-auto">
                <div className="w-12 h-12 rounded-full bg-secondary/10 border border-secondary/50 flex items-center justify-center font-display font-bold text-secondary text-lg shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                  {rev.initials}
                </div>
                <div>
                  <h4 className="font-bold text-white">{rev.name}</h4>
                  <p className="text-sm font-medium text-secondary">{rev.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
