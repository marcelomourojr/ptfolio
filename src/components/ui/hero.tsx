import { BlurFade } from "@/components/ui/blur-fade";
import { TextEffect } from "@/components/ui/text-effect";

interface MetaColumn {
  label: string;
  body: string;
}

interface HeroProps {
  eyebrow: string;
  statement: string;
  wordmark: string;
  meta: MetaColumn[];
}

/** Marca de canto em L, no acento. Detalhe emprestado da referência. */
function Bracket() {
  return (
    <span
      aria-hidden
      className="absolute -top-3 left-0 size-2 border-l border-t border-rose-500"
    />
  );
}

export function Hero({ eyebrow, statement, wordmark, meta }: HeroProps) {
  return (
    <section
      id="inicio"
      className="relative flex min-h-svh flex-col justify-between overflow-hidden px-6 pb-8 pt-28 sm:px-10 sm:pb-10 sm:pt-32"
    >
      {/* Bloco superior: posicionamento, alinhado à esquerda */}
      <div className="max-w-3xl">
        {/* Entrada por letra no rótulo e por palavra na declaração — os dois
            únicos textos animados no carregamento; o resto anima por scroll */}
        <TextEffect
          per="char"
          preset="blur"
          className="font-mono text-[11px] tracking-[0.08em] text-white/40"
        >
          {eyebrow}
        </TextEffect>
        <TextEffect
          per="word"
          preset="slide"
          delay={0.35}
          className="mt-6 text-[clamp(1.25rem,3.2vw,2.25rem)] font-medium leading-[1.15] tracking-[-0.025em] text-white/90"
        >
          {statement}
        </TextEffect>
      </div>

      {/* Bloco inferior: assinatura em escala máxima + metadados, na mesma
          cascata de entrada do topo (rótulo → declaração → nome → metas) */}
      <div>
        <BlurFade delay={0.5} yOffset={20} blur="10px">
          <h1 className="text-[clamp(2.75rem,14vw,15rem)] font-semibold leading-[0.82] tracking-[-0.05em] text-white">
            {wordmark}
            {/* Inline, não flex: assim o ® acompanha a última palavra quando o
                nome quebra em duas linhas no mobile. */}
            <span className="align-super text-[0.26em] font-normal tracking-normal">®</span>
          </h1>
        </BlurFade>

        <div className="mt-10 grid gap-y-8 border-t border-white/10 pt-10 sm:grid-cols-3 sm:gap-x-10">
          {meta.map(({ label, body }, i) => (
            <BlurFade key={label} delay={0.75 + i * 0.15} className="relative">
              <Bracket />
              <h2 className="text-lg font-semibold tracking-[-0.02em] text-white">{label}</h2>
              <p className="mt-2 max-w-xs text-[13px] leading-relaxed text-white/50">{body}</p>
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  );
}
