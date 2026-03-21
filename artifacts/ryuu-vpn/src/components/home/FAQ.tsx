import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion } from "framer-motion";

const faqs = [
  {
    q: "What devices are supported?",
    a: "RYUU VPN works on Android, iOS, Windows, and Mac. One subscription covers all your devices.",
  },
  {
    q: "How do I get my VPN after payment?",
    a: "After payment confirmation, your VPN account credentials will be sent to you immediately via our shop.",
  },
  {
    q: "Can I roll over unused data?",
    a: "Yes! Premium Value and Ultra Pro plans support data rollover — renew before expiry and keep your remaining data.",
  },
  {
    q: "Is there a free trial?",
    a: "The Starter Plan (3,000 Ks / 50GB / 20 days) is our most affordable entry point to try out RYUU VPN.",
  },
  {
    q: "What servers do you use?",
    a: "We use real Singapore servers — not shared proxies. This means faster speeds and more reliable connections for Gaming, Streaming, and everyday browsing.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="py-28 md:py-36 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
      <div className="text-center mb-16">
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="font-display text-4xl md:text-5xl font-bold mb-4 uppercase text-white"
        >
          Frequently Asked{" "}
          <span className="text-primary drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">Questions</span>
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
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-white/10 px-2 py-2">
              <AccordionTrigger className="text-left font-display text-lg tracking-wide hover:text-primary transition-colors hover:no-underline text-white/90">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed text-base font-medium pt-2 pb-4">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>
    </section>
  );
}
