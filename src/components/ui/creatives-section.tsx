"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "framer-motion";

import { BlurFade } from "@/components/ui/blur-fade";
import { CreativePosterGrid } from "@/components/ui/creative-posters";
import { CreativeStack, type Creative } from "@/components/ui/creative-stack";
import { WhisperText } from "@/components/ui/whisper-text";

// O shader e o three.js só entram no bundle quando a seção existe na página —
// mesmo padrão do LiquidMetalButton. O placeholder ocupa a mesma altura para
// não haver salto de layout.
const CreativeGallery = dynamic(() => import("@/components/ui/creative-gallery"), {
  ssr: false,
  loading: () => <div className="h-full" />,
});

interface CreativesSectionProps {
  items: Creative[];
  title?: string;
  subtitle?: string;
  /** Frase parada no meio da galeria 3D. */
  phrase?: string;
  /** Declaração curta sobre os feitos, entre o efeito e o carrossel. */
  featStatement?: string;
  featText?: string;
}

/**
 * Seção Criativos: galeria 3D com os vídeos atravessando o fundo e a frase
 * parada no meio; abaixo, a pilha vertical navegável com as informações dos
 * dois lados.
 *
 * A galeria só monta quando a seção se aproxima do viewport (os vídeos não
 * são baixados antes disso) e pausa por completo quando sai de vista. Sob
 * `prefers-reduced-motion` ou sem WebGL, entra a grade estática de posters.
 */
export function CreativesSection({
  items,
  title = "Criativos",
  subtitle = "Vídeos de divulgação criados com IA para produtos reais.",
  phrase = "Criativos com IA",
  featStatement = "Criativos de anúncio gerados de ponta a ponta com IA para o Verbo.",
  featText = "Roteiro, avatar, narração e edição feitos com ferramentas de IA generativa — do gancho à tela final, prontos para campanha.",
}: CreativesSectionProps) {
  const reduceMotion = useReducedMotion();
  const galleryRef = useRef<HTMLDivElement>(null);
  const [montada, setMontada] = useState(false);
  const [pausada, setPausada] = useState(true);
  const [semWebgl, setSemWebgl] = useState(false);

  // Dois observadores com papéis distintos:
  // 1) ZONA QUENTE (900px de folga, contínua): monta o chunk do three e põe
  //    os vídeos para TOCAR mudos — é o toque que força o decode; sem ele a
  //    textura WebGL fica preta (preto sobre preto = "cadê os vídeos?") até
  //    o buffer chegar. Chegando no pin, os frames já existem. A checagem de
  //    WebGL acontece na primeira entrada.
  // 2) EXECUÇÃO (folga zero): frameloop e túnel só com o trilho encostando
  //    na tela. Com folga, a galeria ficava ligada enquanto o usuário mexia
  //    no carrossel logo abaixo — e o efeito "já tinha passado" na volta.
  const [aquecida, setAquecida] = useState(false);
  const jaChecou = useRef(false);
  useEffect(() => {
    const alvo = galleryRef.current;
    if (!alvo) return;
    const aquecer = new IntersectionObserver(
      ([entry]) => {
        setAquecida(entry.isIntersecting);
        if (entry.isIntersecting && !jaChecou.current) {
          jaChecou.current = true;
          // Máquina muito fraca nem tenta: mesmo com GPU real, 6 decodes de
          // vídeo + WebGL derrubam 2 núcleos / 2GB. Cartela estática serve.
          const nav = navigator as Navigator & { deviceMemory?: number };
          if ((nav.hardwareConcurrency ?? 8) <= 2 || (nav.deviceMemory ?? 8) <= 2) {
            setSemWebgl(true);
            setMontada(true);
            return;
          }
          try {
            const canvas = document.createElement("canvas");
            const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
            if (!gl) {
              setSemWebgl(true);
            } else {
              // WebGL "de mentira" também conta como sem WebGL: com a
              // aceleração de GPU desligada o Chrome entrega SwiftShader
              // (render por CPU) — a galeria vira um moedor e trava a
              // máquina inteira. Nesses casos a grade estática serve melhor.
              const info = gl.getExtension("WEBGL_debug_renderer_info");
              const renderer = info
                ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL))
                : "";
              if (/swiftshader|llvmpipe|software|basic render/i.test(renderer)) setSemWebgl(true);
            }
          } catch {
            setSemWebgl(true);
          }
          setMontada(true);
        }
      },
      { rootMargin: "900px 0px" },
    );
    const executar = new IntersectionObserver(([entry]) => setPausada(!entry.isIntersecting));
    aquecer.observe(alvo);
    executar.observe(alvo);
    return () => {
      aquecer.disconnect();
      executar.disconnect();
    };
  }, []);

  const reveal = (delay = 0) => ({
    initial: reduceMotion ? false : { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const, delay },
  });

  const estatico = reduceMotion || semWebgl;

  return (
    <section id="criativos" className="px-6 pb-24 pt-24 sm:px-10 sm:pb-32 sm:pt-32">
      {/* Sem reveal no contêiner: cada elemento tem o próprio efeito, visível
          quando a seção chega — um contêiner invisível escondia o whisper. */}
      <header className="relative max-w-3xl">
        <h2 className="text-display font-semibold text-white">
          <WhisperText text={title} />
        </h2>
        <BlurFade delay={0.15}>
          <p className="mt-5 max-w-md text-corpo text-white/50">{subtitle}</p>
        </BlurFade>
      </header>

      {/* Galeria 3D com a frase no meio — trilho + palco sticky, o mesmo
          padrão do ZoomParallax: a página prende aqui enquanto o efeito se
          consome com o scroll, e SÓ SOLTA para o carrossel quando os 6
          criativos terminaram de passar (progresso 1 = uma volta completa). */}
      {estatico ? (
        <CreativePosterGrid items={items} className="mt-12 sm:mt-16" />
      ) : (
        <div ref={galleryRef} className="relative mt-12 h-[300vh] sm:mt-16">
          <div className="sticky top-0 h-screen overflow-hidden">
            {montada && (
              <CreativeGallery
                items={items}
                railRef={galleryRef}
                pausado={pausada}
                aquecido={aquecida}
                className="h-full"
              />
            )}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-6 text-center mix-blend-exclusion">
              <p className="text-display-contido font-semibold text-white">
                {phrase}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Entre o efeito e o carrossel: o respiro que explica os feitos.
          Depois do trilho de propósito — antes dele já existe o cabeçalho da
          seção, e o ritmo espelha Projetos: mostrar → explicar → explorar. */}
      <div className="relative mx-auto mt-16 max-w-3xl text-center sm:mt-24">
        {/* Marca de canto centralizada junto com o texto — ancorada à
            esquerda ela ficaria órfã, longe do bloco que assina. */}
        <span
          aria-hidden
          className="absolute -top-3 left-1/2 size-2 -translate-x-1/2 border-l border-t border-rose-500"
        />
        <p className="text-destaque font-medium text-white">
          <WhisperText text={featStatement} />
        </p>
        <BlurFade delay={0.2}>
          <p className="mx-auto mt-4 max-w-md text-corpo text-white/50">{featText}</p>
        </BlurFade>
      </div>

      {/* A pilha vertical, depois do efeito. A margem compensa o VAZAMENTO
          da pilha: os cards vizinhos espreitam ~120px acima da caixa do
          carrossel (é o efeito), então o respiro visual é a margem menos
          isso — daí o valor alto. */}
      <motion.div {...reveal(0.08)} className="mt-36 sm:mt-52">
        <CreativeStack items={items} />
      </motion.div>
    </section>
  );
}
