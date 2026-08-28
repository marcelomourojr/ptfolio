"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

export interface HeaderLink {
  label: string;
  href: string;
}

interface SiteHeaderProps {
  wordmark: string;
  available?: string;
  links: HeaderLink[];
  contact: { label: string; href: string }[];
}

export function SiteHeader({ wordmark, available, links, contact }: SiteHeaderProps) {
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Fundo do cabeçalho só aparece depois que a página sai do topo.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Esc fecha e a página trava enquanto o menu está aberto.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
          scrolled && !open ? "bg-black/70 backdrop-blur-xl" : "bg-transparent"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5 sm:px-10">
          <div className="flex items-center gap-3">
            <a
              href="#inicio"
              className="text-[15px] font-semibold tracking-[-0.02em] text-white
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            >
              {wordmark}
              <sup className="ml-0.5 text-[9px] align-super">®</sup>
            </a>

            {available && (
              <span className="hidden items-center gap-2 rounded-full bg-white/[0.07] px-3 py-1.5 sm:inline-flex">
                <span className="relative flex size-1.5">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-rose-500 opacity-60" />
                  <span className="relative inline-flex size-1.5 rounded-full bg-rose-500" />
                </span>
                <span className="text-[11px] font-medium text-white/70">{available}</span>
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="menu-principal"
            className="flex items-center gap-3 rounded-full bg-white/[0.07] py-2.5 pl-5 pr-4
                       text-[14px] font-medium text-white transition-colors hover:bg-white/[0.12]
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            {open ? "Fechar" : "Menu"}
            <span aria-hidden className="relative flex h-3 w-4 flex-col justify-between">
              <span
                className={`h-px w-full bg-white transition-transform duration-300 ${
                  open ? "translate-y-[5.5px] rotate-45" : ""
                }`}
              />
              <span className={`h-px w-full bg-white transition-opacity ${open ? "opacity-0" : ""}`} />
              <span
                className={`h-px w-full bg-white transition-transform duration-300 ${
                  open ? "-translate-y-[5.5px] -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="menu-principal"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            data-lenis-prevent
            className="fixed inset-0 z-40 overflow-y-auto overscroll-contain bg-black"
          >
            <nav
              aria-label="Navegação principal"
              className="flex min-h-full flex-col justify-between px-6 pb-10 pt-28 sm:px-10 sm:pb-14"
            >
              <ul className="flex flex-col">
                {links.map((link, i) => (
                  <motion.li
                    key={link.href}
                    initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: reduceMotion ? 0 : 0.06 + i * 0.05,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="border-b border-white/10"
                  >
                    <a
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="group flex items-baseline justify-between py-5 text-white
                                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 sm:py-7"
                    >
                      <span className="text-[clamp(2rem,7vw,4.5rem)] font-medium leading-none tracking-[-0.035em] transition-opacity group-hover:opacity-55">
                        {link.label}
                      </span>
                      <span className="font-mono text-[11px] text-white/25">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </a>
                  </motion.li>
                ))}
              </ul>

              <ul className="flex flex-wrap gap-x-8 gap-y-3">
                {contact.map(({ label, href }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target={href.startsWith("http") ? "_blank" : undefined}
                      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="font-mono text-[11px] tracking-[0.06em] text-white/40
                                 transition-colors hover:text-white
                                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
