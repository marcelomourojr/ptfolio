"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import { GalleryStrip } from "./gallery-strip";

export interface ProjectDetail {
  title: string;
  year: string;
  category: string;
  description: string;
  images: string[];
  tags: string[];
  link?: string;
  appStoreLink?: string;
  playStoreLink?: string;
  /** Capturas de celular ficam num slide mais estreito. */
  portrait?: boolean;
}

/** Links "#" são placeholders — não viram botão. */
function realHref(href?: string) {
  return href && href !== "#" ? href : undefined;
}

function ActionButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5
                 text-[14px] font-medium text-white transition-colors hover:border-white/40 hover:bg-white/[0.06]
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
    >
      {children}
      <ArrowUpRight
        aria-hidden
        className="size-4 text-white/40 transition-all duration-300
                   group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-rose-500"
      />
    </a>
  );
}

export function ProjectModal({
  project,
  onClose,
}: {
  project: ProjectDetail | null;
  onClose: () => void;
}) {
  const reduceMotion = useReducedMotion();
  const closeRef = useRef<HTMLButtonElement>(null);

  const open = project !== null;

  // Esc fecha, página trava, e o foco vai para o botão fechar.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const site = realHref(project?.link);
  const appStore = realHref(project?.appStoreLink);
  const playStore = realHref(project?.playStoreLink);
  const hasActions = Boolean(site || appStore || playStore);

  return (
    <AnimatePresence>
      {open && project && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="titulo-projeto"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          /* Sem isto o Lenis engole a roda do mouse no documento inteiro e o
             modal fica impossível de rolar — a galeria some abaixo da dobra. */
          data-lenis-prevent
          className="fixed inset-0 z-[60] overflow-y-auto overscroll-contain bg-black"
        >
          <div className="sticky top-0 z-10 flex justify-end bg-black/80 px-6 py-5 backdrop-blur-xl sm:px-10">
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              className="group flex items-center gap-3 rounded-full bg-white/[0.07] py-2.5 pl-5 pr-4 text-[14px]
                         font-medium text-white transition-colors hover:bg-white/[0.12]
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            >
              Fechar
              {/* `-translate-y-1/2` é obrigatório junto do `top-1/2`: sem ele
                  o que fica no meio é a BORDA da linha, não o centro dela. */}
              <span
                aria-hidden
                className="relative block size-4 transition-transform duration-300 ease-out group-hover:rotate-90"
              >
                <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 rotate-45 bg-white" />
                <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 -rotate-45 bg-white" />
              </span>
            </button>
          </div>

          <div className="px-6 pb-16 sm:px-10">
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="font-mono text-[11px] tracking-[0.08em] text-white/40">
                {project.year} · {project.category}
              </p>
              <h2
                id="titulo-projeto"
                className="mt-4 text-[clamp(2rem,5.5vw,4.25rem)] font-semibold leading-[0.95] tracking-[-0.045em] text-white"
              >
                {project.title}
              </h2>

              <div className="mt-8 grid gap-8 border-t border-white/10 pt-8 lg:grid-cols-12 lg:gap-16">
                <p className="text-[15px] leading-relaxed text-white/55 lg:col-span-7">
                  {project.description}
                </p>

                <div className="lg:col-span-5">
                  <p className="font-mono text-[10px] tracking-[0.08em] text-white/35">
                    Ferramentas
                  </p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <li
                        key={tag}
                        className="rounded-full border border-white/10 px-3.5 py-1.5 font-mono text-[11px]
                                   tracking-[0.04em] text-white/60"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>

                  {hasActions && (
                    <div className="mt-8 flex flex-wrap gap-3">
                      {site && <ActionButton href={site}>Ver site</ActionButton>}
                      {appStore && <ActionButton href={appStore}>App Store</ActionButton>}
                      {playStore && <ActionButton href={playStore}>Google Play</ActionButton>}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            <GalleryStrip images={project.images} title={project.title} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
