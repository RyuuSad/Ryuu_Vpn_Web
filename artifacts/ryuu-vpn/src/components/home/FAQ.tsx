import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { useLang } from "@/context/LanguageContext";

const faqKeys = [
  { q: "faq.q1", a: "faq.a1" },
  { q: "faq.q2", a: "faq.a2" },
  { q: "faq.q3", a: "faq.a3" },
  { q: "faq.q4", a: "faq.a4" },
  { q: "faq.q5", a: "faq.a5" },
];

export function FAQ() {
  const { t } = useLang();

  return (
    <section id="faq" className="py-24 md:py-32 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="font-display text-4xl md:text-5xl font-bold mb-4 uppercase text-white"
        >
          {t("faq.title")}{" "}
          <span className="text-primary drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">
            {t("faq.titleHighlight")}
          </span>
        </motion.h2>
      </div>

      <motion.div
        initial={{ y: 30, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="bg-card/30 p-6 md:p-10 rounded-3xl border border-white/5"
      >
        <Accordion type="single" collapsible className="w-full">
          {faqKeys.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-white/10 px-2 py-2">
              <AccordionTrigger className="text-left font-display text-lg tracking-wide hover:text-primary transition-colors hover:no-underline text-white/90">
                {t(faq.q)}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed text-base font-medium pt-2 pb-4">
                {t(faq.a)}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>
    </section>
  );
}
