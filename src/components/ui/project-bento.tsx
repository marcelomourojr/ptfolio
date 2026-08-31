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
      className="absolute left-3 top-3 z-20 size-2 border-l border-t border-rose-500 sm:left-6 sm:top-6"
    />
  );
}

function Card({
  project,
  fillBand,
  fill,
  className,
  onOpen,
}: {
  project: BentoItem;
  /** true = a altura vem da faixa (o par paisagem manda); o retrato estica
      para acompanhar, com desvio de proporção < 0.2% — invisível. */
  fillBand?: boolean;
  /** Como fillBand, mas em qualquer largura (superfaixas do mosaico mobile). */
  fill?: boolean;
  className?: string;
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
        "group relative block w-full overflow-hidden rounded-xl border border-white/10 bg-white/[0.02] sm:rounded-2xl",
        "text-left transition-colors duration-500 hover:border-white/25",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60",
        // O aspect-ratio dimensiona o bloco em qualquer largura; a partir de
        // md, se a faixa tiver altura própria (par paisagem), o h-full vence
        // o aspect-ratio e o retrato acompanha a altura exata da faixa.
        fillBand && "md:h-full",
        fill && "h-full",
        className,
      )}
      style={{ aspectRatio: project.aspect }}
    >
      <Image
        src={project.cover}
        alt=""
        fill
        sizes="(max-width: 768px) 60vw, 80vw"
        draggable={false}
              className="object-cover object-top transition-transform duration-[900ms] ease-out group-hover:scale-[1.03]"
      />

      {/* Véu de altura fixa na base, só onde o texto vive — mais baixo nos
          blocos pequenos do mosaico mobile */}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black via-black/70 to-transparent sm:h-40" />

      <Bracket />

      <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-2 p-3 sm:gap-4 sm:p-7">
        <div className="min-w-0">
          <p className="font-mono text-[9px] tracking-[0.08em] text-white/45 sm:text-[10px]">
            {project.year} · {project.category}
          </p>
          <h3 className="mt-1 truncate text-[clamp(0.9375rem,2.4vw,1.875rem)] font-semibold leading-tight tracking-[-0.03em] text-white sm:mt-2">
            {project.title}
          </h3>
        </div>

        <ArrowUpRight
          aria-hidden
          className="mb-1 hidden size-5 shrink-0 text-white/40 transition-all duration-300
                     group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-rose-500 sm:block"
        />
      </div>
    </button>
  );
}

const BAND_COLS: Record<BentoBand["layout"], string> = {
  portraitLeft: "md:grid-cols-[22.46fr_77.54fr]",
  portraitRight: "md:grid-cols-[77.54fr_22.46fr]",
  pair: "grid-cols-2",
};

/* ── Mosaico mobile ─────────────────────────────────────────────────────────
   Abaixo de md as colunas de proporção exata do desktop dariam um retrato de
   ~71px — inutilizável. A recomposição: SUPERFAIXAS de retrato + DUAS
   paisagens empilhadas, com a mesma matemática do topo do arquivo:

     largura_retrato / 0.4613 = 2 * (largura_paisagem * 0.6279) + gap
     => retrato ≈ 37.79% da largura útil, paisagens ≈ 62.21%

   O retrato leva h-full (o desvio de proporção pelo gap fixo é < 1% em
   qualquer celular — invisível). Sobras viram par lado a lado ou faixa
   inteira. Nada é recortado nem deformado. */

type MobileRow =
  | { kind: "superLeft" | "superRight"; portrait: BentoItem; landscapes: [BentoItem, BentoItem] }
  | { kind: "pair"; items: [BentoItem, BentoItem] }
  | { kind: "single"; item: BentoItem };

function ratio(aspect: string): number {
  const [w, h] = aspect.split("/").map((n) => parseFloat(n));
  const r = w / h;
  // Aspect malformado colapsaria o card para altura zero em silêncio (todos
  // os filhos são absolute). Melhor derrubar o build com nome e sobrenome —
  // mesma filosofia do bentoItem() em page.tsx.
  if (!Number.isFinite(r) || r <= 0) throw new Error(`Aspect inválido no bento: "${aspect}"`);
  return r;
}

function composeMobileRows(bands: BentoBand[]): MobileRow[] {
  const todos = bands.flatMap((b) => b.items);
  const retratos = todos.filter((p) => ratio(p.aspect) < 1);
  const paisagens = todos.filter((p) => ratio(p.aspect) >= 1);

  const rows: MobileRow[] = [];
  let lado: "superLeft" | "superRight" = "superLeft";
  while (retratos.length > 0 && paisagens.length >= 2) {
    rows.push({
      kind: lado,
      portrait: retratos.shift()!,
      landscapes: [paisagens.shift()!, paisagens.shift()!],
    });
    lado = lado === "superLeft" ? "superRight" : "superLeft";
  }
  while (paisagens.length >= 2) rows.push({ kind: "pair", items: [paisagens.shift()!, paisagens.shift()!] });
  while (retratos.length >= 2) rows.push({ kind: "pair", items: [retratos.shift()!, retratos.shift()!] });
  [...retratos, ...paisagens].forEach((item) => rows.push({ kind: "single", item }));
  return rows;
}

export function ProjectBento({ bands }: { bands: BentoBand[] }) {
  const [active, setActive] = useState<BentoItem | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const reduceMotion = useReducedMotion();

  const open = useCallback((project: BentoItem, trigger: HTMLButtonElement) => {
    triggerRef.current = trigger;
    setActive(project);
  }, []);

  // Devolve o foco ao card que abriu o modal. Se aquele botão saiu de cena
  // (girou o aparelho e o outro bloco do dual-render assumiu), foca o botão
  // VISÍVEL do mesmo projeto — senão o foco cairia no body (WCAG 2.4.3).
  const close = useCallback(() => {
    setActive(null);
    const alvo = triggerRef.current;
    if (alvo && alvo.offsetParent !== null) {
      alvo.focus();
      return;
    }
    const rotulo = alvo?.getAttribute("aria-label");
    if (rotulo) {
      const visivel = [...document.querySelectorAll<HTMLButtonElement>("button[aria-label]")].find(
        (b) => b.getAttribute("aria-label") === rotulo && b.offsetParent !== null,
      );
      visivel?.focus();
    }
  }, []);

  const revealFaixa = (i: number) => ({
    initial: reduceMotion ? false : { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" as const },
    transition: {
      duration: 0.6,
      delay: reduceMotion ? 0 : Math.min(i * 0.05, 0.2),
      ease: [0.22, 1, 0.36, 1] as const,
    },
  });

  const mobileRows = composeMobileRows(bands);

  return (
    <section className="px-6 py-20 sm:px-10 sm:py-24">
      {/* Mosaico mobile: superfaixas densas (só existe abaixo de md; as
          imagens do bloco escondido não carregam — next/image é lazy) */}
      <div className="flex flex-col gap-3 md:hidden">
        {mobileRows.map((row, i) => {
          if (row.kind === "single") {
            // Retrato solto nunca em largura total: viraria um cartão de
            // ~709px de altura. Paisagem solta pode ocupar a faixa inteira.
            return (
              <motion.div key={row.item.title} {...revealFaixa(i)}>
                <Card
                  project={row.item}
                  className={ratio(row.item.aspect) < 1 ? "max-w-[56%]" : undefined}
                  onOpen={open}
                />
              </motion.div>
            );
          }
          if (row.kind === "pair") {
            return (
              <motion.div key={row.items[0].title} {...revealFaixa(i)} className="grid grid-cols-2 gap-3">
                <Card project={row.items[0]} onOpen={open} />
                <Card project={row.items[1]} onOpen={open} />
              </motion.div>
            );
          }
          // justify-between + h-full: em larguras onde o retrato natural é
          // mais alto que a pilha (ex. 640-767px), a folga vai para o MEIO da
          // pilha em vez de virar um vão sob a paisagem de baixo — topo e
          // base ficam sempre alinhados com o retrato.
          const retrato = <Card key="r" project={row.portrait} fill onOpen={open} />;
          const pilha = (
            <div key="p" className="flex h-full flex-col justify-between gap-3">
              <Card project={row.landscapes[0]} onOpen={open} />
              <Card project={row.landscapes[1]} onOpen={open} />
            </div>
          );
          return (
            <motion.div
              key={row.portrait.title}
              {...revealFaixa(i)}
              className={cn(
                "grid gap-3",
                row.kind === "superLeft"
                  ? "grid-cols-[37.79fr_62.21fr]"
                  : "grid-cols-[62.21fr_37.79fr]",
              )}
            >
              {row.kind === "superLeft" ? [retrato, pilha] : [pilha, retrato]}
            </motion.div>
          );
        })}
      </div>

      {/* Mosaico md+: as faixas de proporção exata originais */}
      <div className="hidden flex-col gap-4 md:flex">
        {bands.map((band, i) => {
          // Na faixa mista, quem dita a altura é a paisagem (aspect no card);
          // o retrato acompanha com h-full.
          const portraitIndex =
            band.layout === "portraitLeft" ? 0 : band.layout === "portraitRight" ? 1 : -1;

          return (
            <motion.div
              key={band.items[0].title}
              {...revealFaixa(i)}
              className={cn("grid gap-4", BAND_COLS[band.layout])}
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
