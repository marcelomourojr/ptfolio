"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import dynamic from "next/dynamic";

import { cn } from "@/lib/utils";
import type { ProjectDetail } from "./project-modal";

// O modal (e a galeria dentro dele) só é necessário quando um card é
// clicado — sob demanda ele sai do JS inicial da página.
const ProjectModal = dynamic(
  () => import("./project-modal").then((m) => m.ProjectModal),
  { ssr: false },
);

export interface BentoItem extends ProjectDetail {
  /** Imagem de capa do bloco. */
  cover: string;
  /** Proporção EXATA da capa, ex. "1179/2556". É ela que dimensiona o bloco. */
  aspect: string;
}

/**
 * Uma faixa do mosaico. `portraitLeft`/`portraitRight` casam um retrato de
 * app (ratio ~0.4613) com uma paisagem de web (ratio 1.5926) na MESMA altura:
 *
 *   largura_retrato / 0.4613 = largura_paisagem * 0.6279
 *   => retrato = 22.46% da largura útil, paisagem = 77.54%
 *
 * Com colunas em `fr` a conta vale em qualquer largura e com qualquer gap —
 * nenhuma imagem é recortada nem deformada.
 */
export interface BentoBand {
  layout: "portraitLeft" | "portraitRight" | "pair";
  items: [BentoItem, BentoItem];
}

/** Mesma marca de canto do hero e do Sobre. */
function Bracket() {
  return (
    <span
      aria-hidden
      className="absolute left-6 top-6 z-20 size-2 border-l border-t border-rose-500"
    />
  );
}

function Card({
  project,
  fillBand,
  onOpen,
}: {
  project: BentoItem;
  /** true = a altura vem da faixa (o par paisagem manda); o retrato estica
      para acompanhar, com desvio de proporção < 0.2% — invisível. */
  fillBand?: boolean;
  onOpen: (project: BentoItem, trigger: HTMLButtonElement) => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);

  return (
    <button
      ref={ref}
      type="button"
      onClick={() => ref.current && onOpen(project, ref.current)}
      aria-label={`Abrir detalhes de ${project.title}`}
      className={cn(
        "group relative block w-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]",
        "text-left transition-colors duration-500 hover:border-white/25",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60",
        // No mobile (coluna única) o aspect-ratio dimensiona o bloco; a partir
        // de md, se a faixa tiver altura própria (par paisagem), o h-full
        // vence o aspect-ratio e o retrato acompanha a altura exata da faixa.
        fillBand && "md:h-full",
      )}
      style={{ aspectRatio: project.aspect }}
    >
      <Image
        src={project.cover}
        alt=""
        fill
        sizes="(max-width: 768px) 100vw, 80vw"
        draggable={false}
              className="object-cover object-top transition-transform duration-[900ms] ease-out group-hover:scale-[1.03]"
      />

      {/* Véu de altura fixa na base, só onde o texto vive */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black via-black/70 to-transparent" />

      <Bracket />

      <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-4 p-6 sm:p-7">
        <div className="min-w-0">
          <p className="font-mono text-[10px] tracking-[0.08em] text-white/45">
            {project.year} · {project.category}
          </p>
          <h3 className="mt-2 text-[clamp(1.25rem,2.4vw,1.875rem)] font-semibold leading-tight tracking-[-0.03em] text-white">
            {project.title}
          </h3>
        </div>

        <ArrowUpRight
          aria-hidden
          className="mb-1 size-5 shrink-0 text-white/40 transition-all duration-300
                     group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-rose-500"
        />
      </div>
    </button>
  );
}

const BAND_COLS: Record<BentoBand["layout"], string> = {
  portraitLeft: "md:grid-cols-[22.46fr_77.54fr]",
  portraitRight: "md:grid-cols-[77.54fr_22.46fr]",
  pair: "md:grid-cols-2",
};

export function ProjectBento({ bands }: { bands: BentoBand[] }) {
  const [active, setActive] = useState<BentoItem | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const reduceMotion = useReducedMotion();

  const open = useCallback((project: BentoItem, trigger: HTMLButtonElement) => {
    triggerRef.current = trigger;
    setActive(project);
  }, []);

  // Devolve o foco ao card que abriu o modal.
  const close = useCallback(() => {
    setActive(null);
    triggerRef.current?.focus();
  }, []);

  return (
    <section className="px-6 py-20 sm:px-10 sm:py-24">
      <div className="flex flex-col gap-3 sm:gap-4">
        {bands.map((band, i) => {
          // Na faixa mista, quem dita a altura é a paisagem (aspect no card);
          // o retrato acompanha com h-full. No mobile cada um usa a própria
          // proporção — nada é cortado em nenhuma largura.
          const portraitIndex =
            band.layout === "portraitLeft" ? 0 : band.layout === "portraitRight" ? 1 : -1;

          return (
            <motion.div
              key={band.items[0].title}
              initial={reduceMotion ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 0.6,
                delay: reduceMotion ? 0 : Math.min(i * 0.05, 0.2),
                ease: [0.22, 1, 0.36, 1],
              }}
              className={cn("grid grid-cols-1 gap-3 sm:gap-4", BAND_COLS[band.layout])}
            >
              {band.items.map((item, j) => (
                <Card
                  key={item.title}
                  project={item}
                  fillBand={j === portraitIndex}
                  onOpen={open}
                />
              ))}
            </motion.div>
          );
        })}
      </div>

      <ProjectModal project={active} onClose={close} />
    </section>
  );
}
