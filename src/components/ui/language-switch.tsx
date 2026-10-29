"use client";

import { useId } from "react";
import { LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { useLanguage } from "@/components/language-provider";

export function LanguageSwitch() {
  const { language, setLanguage, t } = useLanguage();
  const animationId = useId();
  const reduceMotion = useReducedMotion();

  return (
    <LayoutGroup id={animationId}>
      {/* Independente do notch: a escolha de idioma não desloca seu centro,
          nem quando a gaveta abre. No celular as opções ficam empilhadas. */}
      <div role="group" aria-label={t("Idioma do site")} className="pointer-events-auto fixed right-3 top-2 z-[55] flex items-center gap-0.5 rounded-full border border-white/10 bg-white p-1 shadow-sm max-sm:flex-col sm:right-6 sm:top-3">
        {([{ code: "pt", flag: "🇧🇷", label: "Português" }, { code: "en", flag: "🇺🇸", label: "English" }] as const).map(item => (
          <button
            key={item.code}
            type="button"
            lang={item.code === "pt" ? "pt-BR" : "en-US"}
            aria-label={item.label}
            aria-pressed={language === item.code}
            onClick={() => setLanguage(item.code)}
            className={`relative flex min-h-9 items-center justify-center gap-1 rounded-full px-2 text-micro font-semibold transition-colors duration-300 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 sm:px-2.5 ${language === item.code ? "text-white" : "text-black/60 hover:text-black"}`}
          >
            {language === item.code && (
              <motion.span
                aria-hidden
                layoutId="language-indicator"
                initial={false}
                className="pointer-events-none absolute inset-0 rounded-full bg-black"
                transition={reduceMotion ? { duration: 0 } : { type: "tween", duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              />
            )}
            <span aria-hidden className="relative z-10 text-corpo leading-none">{item.flag}</span>
            <span className="relative z-10">{item.code.toUpperCase()}</span>
          </button>
        ))}
      </div>
    </LayoutGroup>
  );
}
