"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ContactPage() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://tally.so/widgets/embed.js";
    script.async = true;

    const loadEmbeds = () => {
      const tally = (
        window as typeof window & { Tally?: { loadEmbeds: () => void } }
      ).Tally;

      if (tally) {
        tally.loadEmbeds();
      } else {
        const iframes = document.querySelectorAll<HTMLIFrameElement>(
          "iframe[data-tally-src]:not([src])"
        );

        iframes.forEach((iframe) => {
          const dataSrc = iframe.getAttribute("data-tally-src");
          if (dataSrc) iframe.src = dataSrc;
        });
      }
    };

    script.onload = loadEmbeds;
    script.onerror = loadEmbeds;

    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-8">
      <AnimatePresence>
        <motion.section
          key="contact-form"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          transition={{
            duration: 0.6,
            ease: "easeOut",
          }}
          className="w-full max-w-3xl"
        >
          <iframe
            data-tally-src="https://tally.so/embed/wM205A?alignLeft=1&transparentBackground=1&dynamicHeight=1"
            loading="lazy"
            width="100%"
            height="auto"
            title="Contact form"
          />
        </motion.section>
      </AnimatePresence>
    </main>
  );
}
