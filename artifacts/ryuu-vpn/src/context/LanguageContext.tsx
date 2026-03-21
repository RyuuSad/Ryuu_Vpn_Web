import { createContext, useContext, useState, ReactNode } from "react";

export type Lang = "en" | "my";

interface LanguageContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
}

const translations: Record<string, Record<Lang, string>> = {
  // Navbar
  "nav.features": { en: "Features", my: "ဝန်ဆောင်မှုများ" },
  "nav.pricing": { en: "Pricing", my: "စျေးနှုန်း" },
  "nav.faq": { en: "FAQ", my: "မေးမြန်းလေ့ရှိသောမေးခွန်းများ" },
  "nav.getStarted": { en: "Get Started", my: "စတင်ရန်" },

  // Announcement
  "ann.title": {
    en: "📣 RYUU VPN SHOP — New Plan Updates! 🐉",
    my: "📣 RYUU VPN SHOP — Plan အသစ်များ ထွက်ပြီ! 🐉",
  },
  "ann.body": {
    en: "We're excited to introduce improved services and better-value plans for our loyal customers! Singapore servers deliver the best speeds for Gaming, Streaming & Social Media. Choose your perfect plan now!",
    my: "ကျွန်တော်တို့ RYUU VPN ကို အစဉ်တစိုက် အားပေးနေကြတဲ့ Customer များအတွက် ပိုမိုကောင်းမွန်တဲ့ Service နဲ့ ပိုမိုတန်ဆာရှိတဲ့ Plan အသစ်တွေကို မိတ်ဆက်ပေးလိုက်ပါပြီ။ 🚀 စင်ကာပူ Server အစစ်ကို အသုံးပြုထားလို့ Gaming, Streaming နဲ့ Social Media အားလုံးအတွက် လိုင်းဆွဲအား အကောင်းဆုံး ဖြစ်မှာပါ။",
  },
  "ann.plans": {
    en: "🔹 STARTER: 50GB / 20 Days — 3,000 Ks   🔹 PREMIUM VALUE: 120GB / 30 Days — 5,000 Ks ✨   🔹 ULTRA PRO: 250GB / 30 Days — 10,000 Ks",
    my: "🔹 STARTER: 50GB / ၂၀ ရက် — ၃,၀၀၀ ကျပ်   🔹 PREMIUM VALUE: 120GB / ၃၀ ရက် — ၅,၀၀၀ ကျပ် ✨   🔹 ULTRA PRO: 250GB / ၃၀ ရက် — ၁၀,၀၀၀ ကျပ်",
  },
  "ann.dismiss": { en: "Dismiss", my: "ပိတ်မည်" },

  // Hero
  "hero.tagline": { en: "Singapore Servers · Zero Logs · Always On", my: "စင်ကာပူ Server · Log မရှိ · အမြဲ Online" },
  "hero.headline1": { en: "SECURE.", my: "လုံခြုံသည်။" },
  "hero.headline2": { en: "FAST.", my: "မြန်သည်။" },
  "hero.headline3": { en: "UNRESTRICTED.", my: "ကန့်သတ်မှုမရှိ။" },
  "hero.sub": {
    en: "Protect your digital identity with military-grade encryption. Bypass restrictions, mask your identity, and explore the internet without borders.",
    my: "စစ်တပ်အဆင့် Encryption ဖြင့် သင့် Digital Identity ကို ကာကွယ်ပါ။ ကန့်သတ်ချက်များကို ဖြတ်ကျော်ပြီး နယ်နိမိတ်မဲ့ Internet ကို ခံစားလိုက်ပါ။",
  },
  "hero.cta1": { en: "Get Started", my: "စတင်ရန်" },
  "hero.cta2": { en: "View Plans", my: "Plan များကြည့်ရန်" },

  // Stats
  "stats.users": { en: "Active Users", my: "အသုံးပြုသူများ" },
  "stats.locations": { en: "Server Locations", my: "Server တည်နေရာများ" },
  "stats.uptime": { en: "Uptime", my: "အလုပ်လုပ်ချိန်" },
  "stats.speed": { en: "Network Speed", my: "Network အမြန်နှုန်း" },

  // Features
  "feat.title": { en: "Why Choose", my: "ဘာကြောင့် ရွေးချယ်မလဲ" },
  "feat.titleHighlight": { en: "RYUU VPN?", my: "RYUU VPN?" },
  "feat.sub": {
    en: "Built for speed, security, and reliability — Singapore's fastest private network.",
    my: "အမြန်နှုန်း၊ လုံခြုံမှုနှင့် ယုံကြည်စိတ်ချရမှုအတွက် တည်ဆောက်ထားသည် — စင်ကာပူ၏ အမြန်ဆုံး Private Network။",
  },
  "feat.enc.title": { en: "Military-Grade Encryption", my: "စစ်တပ်အဆင့် Encryption" },
  "feat.enc.desc": {
    en: "AES-256 encryption keeps your data protected from hackers, ISPs, and surveillance.",
    my: "AES-256 Encryption ဖြင့် Hacker, ISP နှင့် စောင့်ကြည့်မှုများမှ သင့် Data ကို ကာကွယ်ပေးသည်။",
  },
  "feat.speed.title": { en: "Lightning Fast Speed", my: "လျှပ်စီးအမြန်နှုန်း" },
  "feat.speed.desc": {
    en: "Singapore servers optimized for Gaming, Streaming 4K, and Social Media with zero throttling.",
    my: "Gaming, 4K Streaming နှင့် Social Media အတွက် စင်ကာပူ Server များဖြင့် အမြန်နှုန်း အကောင်းဆုံး ဖြစ်သည်။",
  },
  "feat.servers.title": { en: "Singapore Servers", my: "စင်ကာပူ Server များ" },
  "feat.servers.desc": {
    en: "Premium Singapore infrastructure — real servers, not shared proxies. Lowest latency in the region.",
    my: "Premium စင်ကာပူ Infrastructure — Shared Proxy မဟုတ်ဘဲ စစ်မှန်သော Server များ။ ဒေသတွင်း နိမ့်ဆုံး Latency။",
  },
  "feat.logs.title": { en: "Zero Logs Policy", my: "Log မသိမ်းဆည်းသော မူဝါဒ" },
  "feat.logs.desc": {
    en: "We never store browsing history, connection logs, or IP addresses. Your privacy is absolute.",
    my: "Browsing History, Connection Log သို့မဟုတ် IP Address များကို ဘယ်တော့မှ သိမ်းဆည်းမည်မဟုတ်ပါ။",
  },

  // Pricing
  "pricing.title": { en: "Choose Your", my: "သင့်အတွက် Plan ရွေးချယ်ပါ" },
  "pricing.titleHighlight": { en: "Plan", my: "" },
  "pricing.sub": {
    en: "Transparent pricing. No hidden fees. Real Singapore VPN.",
    my: "ဈေးနှုန်း ရှင်းလင်းသည်။ လျှို့ဝှက်ကြေးမရှိ။ စစ်မှန်သော စင်ကာပူ VPN။",
  },
  "pricing.popular": { en: "Most Popular", my: "အရောင်းရဆုံး" },
  "pricing.days": { en: "Days", my: "ရက်" },
  "pricing.validity": { en: "Validity", my: "သက်တမ်း" },
  "pricing.data": { en: "Data", my: "Data" },
  "pricing.buy": { en: "Buy Now", my: "ယခုဝယ်ရန်" },
  "pricing.note.starter": {
    en: "Note: Data top-up not available for this plan.",
    my: "မှတ်ချက် — ဤ Plan တွင် Data ပေါင်းထည့်ခွင့် မရှိပါ။",
  },
  "pricing.note.premium": {
    en: "✅ Rollover: Unused data carries over when you renew before expiry.",
    my: "✅ Rollover — သက်တမ်းမကုန်ခင် ပြန်တိုးပါက လက်ကျန် Data များ ရှေ့လထဲ ပေါင်းထည့်ပေးသည်။",
  },
  "pricing.note.ultra": {
    en: "✅ Data rollover + High-Speed Priority access.",
    my: "✅ Data ပေါင်းထည့်ခွင့် ရှိပြီး High-Speed Priority ရရှိသည်။",
  },

  // Plan names
  "plan.starter.name": { en: "STARTER PLAN", my: "STARTER PLAN" },
  "plan.starter.sub": { en: "Trial & Light Users", my: "စမ်းသုံးသူ / စာပို့ & ဖုန်းပြောသုံးမည့်သူ" },
  "plan.premium.name": { en: "PREMIUM VALUE", my: "PREMIUM VALUE" },
  "plan.premium.sub": { en: "Best Seller — Most Popular", my: "Best Seller — အရောင်းရဆုံး" },
  "plan.ultra.name": { en: "ULTRA PRO", my: "ULTRA PRO" },
  "plan.ultra.sub": { en: "Heavy Users — 4K & Downloads", my: "Heavy User — 4K ကြည့်မည့်သူ & Download ဆွဲမည့်သူ" },

  // FAQ
  "faq.title": { en: "Frequently Asked", my: "မေးမြန်းလေ့ရှိသော" },
  "faq.titleHighlight": { en: "Questions", my: "မေးခွန်းများ" },
  "faq.q1": { en: "What devices are supported?", my: "ဘယ် Device တွေ ထောက်ပံ့သလဲ?" },
  "faq.a1": {
    en: "RYUU VPN works on Android, iOS, Windows, and Mac. One subscription covers all your devices.",
    my: "RYUU VPN သည် Android, iOS, Windows နှင့် Mac တွင် အလုပ်လုပ်သည်။ Subscription တစ်ခုဖြင့် Device အားလုံးကို အသုံးပြုနိုင်သည်။",
  },
  "faq.q2": { en: "How do I get my VPN after payment?", my: "ငွေပေးချေပြီးနောက် VPN ကို ဘယ်လိုရမလဲ?" },
  "faq.a2": {
    en: "After payment confirmation, your VPN account credentials will be sent to you immediately via our shop.",
    my: "ငွေပေးချေမှု အတည်ပြုပြီးနောက် VPN Account ကို ကျွန်တော်တို့ Shop မှတဆင့် ချက်ချင်းပေးပို့ပေးမည်ဖြစ်သည်။",
  },
  "faq.q3": { en: "Can I roll over unused data?", my: "သုံးမပြီးသေးသော Data ကို လှိမ့်သွားနိုင်သလား?" },
  "faq.a3": {
    en: "Yes! Premium Value and Ultra Pro plans support data rollover — renew before expiry and keep your remaining data.",
    my: "ဟုတ်ကဲ့! Premium Value နှင့် Ultra Pro Plan တွင် Data Rollover ရနိုင်ပါသည် — သက်တမ်းမကုန်ခင် ပြန်တိုးပါက လက်ကျန် Data ရှေ့လသို့ ပေါင်းထည့်ပေးမည်ဖြစ်သည်။",
  },
  "faq.q4": { en: "Is there a free trial?", my: "အခမဲ့ Trial ရှိသလား?" },
  "faq.a4": {
    en: "The Starter Plan (3,000 Ks / 50GB / 20 days) is our most affordable entry point to try out RYUU VPN.",
    my: "Starter Plan (၃,၀၀၀ ကျပ် / 50GB / ၂၀ ရက်) သည် RYUU VPN ကို စမ်းသုံးကြည့်ရန် အကောင်းဆုံး နည်းလမ်းဖြစ်သည်။",
  },
  "faq.q5": { en: "What servers do you use?", my: "ဘယ် Server တွေ သုံးသလဲ?" },
  "faq.a5": {
    en: "We use real Singapore servers — not shared proxies. This means faster speeds and more reliable connections for Gaming, Streaming, and everyday browsing.",
    my: "ကျွန်တော်တို့သည် စစ်မှန်သော စင်ကာပူ Server များကိုသာ အသုံးပြုသည် — Shared Proxy မဟုတ်ပါ။ Gaming, Streaming နှင့် နေ့စဉ် Browsing အတွက် ပိုမိုမြန်ဆန်ပြီး ယုံကြည်စိတ်ချရသော Connection ကို ရရှိမည်ဖြစ်သည်။",
  },

  // Testimonials
  "test.title": { en: "What Our", my: "ကျွန်တော်တို့" },
  "test.titleHighlight": { en: "Users Say", my: "Customer များ ပြောသောစကား" },

  // Footer
  "footer.tagline": { en: "Your privacy. Our mission.", my: "သင့်လွတ်လပ်မှု။ ကျွန်တော်တို့၏ ရည်မှန်းချက်။" },
  "footer.links": { en: "Quick Links", my: "လင့်ခ်များ" },
  "footer.contact": { en: "Contact Us", my: "ဆက်သွယ်ရန်" },
  "footer.copy": {
    en: "© 2025 RYUU VPN. All rights reserved.",
    my: "© 2025 RYUU VPN. မူပိုင်ခွင့် အားလုံး သိမ်းဆည်းထားသည်။",
  },
};

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  setLang: () => {},
  t: (key) => key,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");

  const t = (key: string): string => {
    return translations[key]?.[lang] ?? key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}
