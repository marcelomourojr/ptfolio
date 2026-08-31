"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, type PanInfo } from "framer-motion";
import { ChevronDown, ChevronUp, Pause, Play, Volume2, VolumeX } from "lucide-react";

/** Um criativo de vídeo. `slug` é a base dos arquivos em /public/videos
    (slug.webm + slug.mp4 + slug.webp de poster). */
export interface Creative {
  slug: string;
  title: string;
  meta: string;
}

interface CreativeStackProps {
  items: Creative[];
  className?: string;
}

/**
 * Carrossel vertical em pilha 3D dos criativos, com as informações nos dois
 * lados: contador e título à esquerda, navegação à direita.
 *
 * Adaptações sobre o componente de referência (pilha de imagens):
 * - Vídeo no lugar de imagem: só o card ativo toca; vizinhos ficam pausados
 *   no poster. Botão de som — os criativos têm narração — desligado por padrão.
 * - SEM listener de wheel no window: o original navegava o carrossel em
 *   QUALQUER scroll da página, o que brigaria com o Lenis. Aqui a navegação é
 *   arrasto, bolinhas, setas — e roda apenas com o cursor sobre a pilha.
 * - Tokens shadcn (bg-background, ring-border…) trocados pela linguagem do
 *   site: preto puro e branco com opacidade.
 */
export function CreativeStack({ items, className }: CreativeStackProps) {
  const [current, setCurrent] = useState(0);
  const [comSom, setComSom] = useState(false);
  // null = automático: toca, exceto sob prefers-reduced-motion (WCAG 2.2.2 —
  // mídia que anda sozinha precisa de pausa; quem pediu menos movimento não
  // recebe autoplay). O botão de play/pause fixa a escolha do usuário.
  const [tocando, setTocando] = useState<boolean | null>(null);
  const reduceMotion = useReducedMotion();
  const deveTocar = tocando ?? !reduceMotion;
  // Nada toca (nem baixa) antes de a pilha entrar em vista
  const [emVista, setEmVista] = useState(false);
  // No toque, o drag do framer engoliria o scroll da página (o dedo sobre o
  // card não rolaria mais a página — o scroll hijacking que este site evita).
  // Lá a navegação é por tap nos cards vizinhos, setas e bolinhas.
  const [toque, setToque] = useState(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const lastNav = useRef(0);
  const wheelAcc = useRef(0);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: coarse)");
    const sync = () => setToque(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // Tela estreita = pilha compacta: card menor e deslocamentos menores,
  // senão o carrossel engolia o celular inteiro
  const [compacto, setCompacto] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const sync = () => setCompacto(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const navigate = useCallback(
    (dir: number) => {
      const agora = Date.now();
      if (agora - lastNav.current < 400) return;
      lastNav.current = agora;
      setCurrent((prev) => (prev + dir + items.length) % items.length);
    },
    [items.length],
  );

  // Só o card ativo toca, apenas com a pilha em vista; som se o usuário ligou
  useEffect(() => {
    videoRefs.current.forEach((video, i) => {
      if (!video) return;
      if (i === current && deveTocar && emVista) {
        video.muted = !comSom;
        void video.play().catch(() => {
          // Safari só permite play desmutado dentro do gesto — e este play
          // roda num efeito. Se rejeitar, volta mudo (para o card não
          // congelar no poster) e reflete na UI que o som caiu.
          if (!video.muted) {
            video.muted = true;
            void video.play().catch(() => {});
            setComSom(false);
          }
        });
      } else {
        video.pause();
        video.muted = i !== current || !comSom;
      }
    });
  }, [current, comSom, deveTocar, emVista]);

  // Vista/fora de vista vira estado — o efeito acima é o único dono do play
  const rootRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const io = new IntersectionObserver(([entry]) => setEmVista(entry.isIntersecting), {
      threshold: 0.15,
    });
    io.observe(root);
    return () => io.disconnect();
  }, []);

  const onDragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      if (info.offset.y < -50) navigate(1);
      else if (info.offset.y > 50) navigate(-1);
    },
    [navigate],
  );

  // Roda do mouse APENAS com o cursor sobre a pilha, acumulando deltas para
  // um trackpad não disparar três navegações num gesto só
  const lastWheelT = useRef(0);
  const onWheel = useCallback(
    (e: React.WheelEvent) => {
      const agora = performance.now();
      // Resíduo de gesto antigo não pode sobrar: pausa de 300ms ou inversão
      // de direção começa um gesto novo — senão um toque mínimo minutos
      // depois cruzaria o limiar e navegaria "sozinho".
      if (agora - lastWheelT.current > 300 || e.deltaY * wheelAcc.current < 0) {
        wheelAcc.current = 0;
      }
      lastWheelT.current = agora;
      wheelAcc.current += e.deltaY;
      if (Math.abs(wheelAcc.current) > 60) {
        navigate(wheelAcc.current > 0 ? 1 : -1);
        wheelAcc.current = 0;
      }
    },
    [navigate],
  );

  /** Posição/escala de cada card em relação ao ativo (referência mantida).
      Na tela estreita os deslocamentos encolhem junto com o card. */
  const cardStyle = (index: number) => {
    const total = items.length;
    let diff = index - current;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;

    const passo1 = compacto ? 76 : 150;
    const passo2 = compacto ? 130 : 260;
    const fora = compacto ? 185 : 380;

    if (diff === 0) return { diff, y: 0, scale: 1, opacity: 1, zIndex: 5, rotateX: 0 };
    if (diff === -1) return { diff, y: -passo1, scale: 0.82, opacity: 0.45, zIndex: 4, rotateX: 8 };
    if (diff === -2) return { diff, y: -passo2, scale: 0.7, opacity: 0.2, zIndex: 3, rotateX: 15 };
    if (diff === 1) return { diff, y: passo1, scale: 0.82, opacity: 0.45, zIndex: 4, rotateX: -8 };
    if (diff === 2) return { diff, y: passo2, scale: 0.7, opacity: 0.2, zIndex: 3, rotateX: -15 };
    return { diff, y: diff > 0 ? fora : -fora, scale: 0.6, opacity: 0, zIndex: 0, rotateX: diff > 0 ? -20 : 20 };
  };

  const atual = items[current];

  return (
    <div
      ref={rootRef}
      className={className}
      role="region"
      aria-roledescription="carrossel"
      aria-label="Criativos em vídeo"
    >
      {/* Anúncio da troca para leitores de tela */}
      <p aria-live="polite" className="sr-only">
        {atual.title} — {atual.meta}, {current + 1} de {items.length}
      </p>
      <div className="relative flex items-center justify-center gap-4 sm:gap-8 lg:gap-16">
        {/* Informações à esquerda: contador + criativo atual */}
        <div className="hidden w-36 shrink-0 flex-col items-end text-right md:flex">
          <span className="text-4xl font-light tabular-nums text-white">
            {String(current + 1).padStart(2, "0")}
          </span>
          <span aria-hidden className="my-3 h-px w-8 bg-white/20" />
          <span className="font-mono text-[11px] tabular-nums text-white/35">
            {String(items.length).padStart(2, "0")}
          </span>
          <p className="mt-8 text-[15px] font-medium tracking-[-0.01em] text-white">{atual.title}</p>
          <p className="mt-1 font-mono text-[10px] tracking-[0.04em] text-white/40">{atual.meta}</p>
        </div>

        {/* A pilha */}
        <div
          className="relative flex h-[340px] w-[min(46vw,280px)] items-center justify-center sm:h-[620px]"
          style={{ perspective: "1200px" }}
          onWheel={onWheel}
        >
          {items.map((item, index) => {
            const style = cardStyle(index);
            if (Math.abs(style.diff) > 2) return null;
            const ativo = index === current;

            return (
              <motion.div
                key={item.slug}
                className={ativo ? "absolute cursor-grab active:cursor-grabbing" : "absolute cursor-pointer"}
                animate={{
                  y: style.y,
                  scale: style.scale,
                  opacity: style.opacity,
                  rotateX: style.rotateX,
                  zIndex: style.zIndex,
                }}
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 300, damping: 30, mass: 1 }
                }
                drag={ativo && !toque ? "y" : false}
                dragConstraints={{ top: 0, bottom: 0 }}
                dragElastic={0.2}
                onDragEnd={onDragEnd}
                onClick={ativo ? undefined : () => setCurrent(index)}
                style={{ transformStyle: "preserve-3d", zIndex: style.zIndex }}
              >
                <div
                  className="relative w-[min(46vw,280px)] overflow-hidden rounded-xl bg-zinc-950 ring-1 ring-white/10 sm:rounded-2xl"
                  style={{ aspectRatio: "9 / 16" }}
                >
                  <video
                    ref={(el) => {
                      videoRefs.current[index] = el;
                    }}
                    poster={`/videos/${item.slug}.webp`}
                    preload={Math.abs(style.diff) <= 1 ? "metadata" : "none"}
                    loop
                    muted
                    playsInline
                    draggable={false}
                    aria-label={`${item.title} — ${item.meta}`}
                    className="pointer-events-none size-full select-none object-cover"
                  >
                    <source src={`/videos/${item.slug}.webm`} type="video/webm" />
                    <source src={`/videos/${item.slug}.mp4`} type="video/mp4" />
                  </video>

                  {/* Assinatura do site no card ativo */}
                  {ativo && (
                    <span
                      aria-hidden
                      className="absolute left-4 top-4 size-2 border-l border-t border-rose-500"
                    />
                  )}

                  {ativo && (
                    <div className="absolute bottom-2 right-2 flex gap-1.5 sm:bottom-4 sm:right-4 sm:gap-2">
                      <button
                        type="button"
                        aria-label={deveTocar ? "Pausar vídeo" : "Reproduzir vídeo"}
                        onClick={() => setTocando(!deveTocar)}
                        className="rounded-full border border-white/20 bg-black/50 p-2 text-white backdrop-blur-sm transition-colors
                                   hover:border-white/50 sm:p-2.5
                                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                      >
                        {deveTocar ? (
                          <Pause aria-hidden className="size-3.5 sm:size-4" />
                        ) : (
                          <Play aria-hidden className="size-3.5 sm:size-4" />
                        )}
                      </button>
                      <button
                        type="button"
                        aria-label={comSom ? "Desligar som" : "Ligar som"}
                        aria-pressed={comSom}
                        onClick={() => setComSom((s) => !s)}
                        className="rounded-full border border-white/20 bg-black/50 p-2 text-white backdrop-blur-sm transition-colors
                                   hover:border-white/50 sm:p-2.5
                                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                      >
                        {comSom ? (
                          <Volume2 aria-hidden className="size-3.5 sm:size-4" />
                        ) : (
                          <VolumeX aria-hidden className="size-3.5 sm:size-4" />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Navegação à direita: setas + bolinhas. No celular sai do fluxo
            (absolute) para o carrossel ficar EXATAMENTE no centro da tela —
            no fluxo, a largura dos botões empurrava a pilha para a esquerda. */}
        <div className="flex w-36 shrink-0 flex-col items-start gap-6 max-md:absolute max-md:right-0 max-md:top-1/2 max-md:w-auto max-md:-translate-y-1/2 max-md:gap-4">
          <button
            type="button"
            aria-label="Criativo anterior"
            onClick={() => navigate(-1)}
            className="rounded-full border border-white/15 p-2 text-white transition-colors
                       hover:border-white/40
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            <ChevronUp aria-hidden className="size-4" />
          </button>

          <div className="flex flex-col items-center pl-1">
            {/* O visual da bolinha é pequeno; o botão em volta garante alvo
                de toque de 24px (WCAG 2.5.8) */}
            {items.map((item, index) => (
              <button
                key={item.slug}
                type="button"
                aria-label={`Ir para ${item.title}`}
                aria-current={index === current ? "true" : undefined}
                onClick={() => setCurrent(index)}
                className="group flex min-h-6 w-6 items-center justify-center py-1"
              >
                <span
                  aria-hidden
                  className={`w-1.5 rounded-full transition-all duration-300 ${
                    index === current ? "h-6 bg-white" : "h-1.5 bg-white/25 group-hover:bg-white/50"
                  }`}
                />
              </button>
            ))}
          </div>

          <button
            type="button"
            aria-label="Próximo criativo"
            onClick={() => navigate(1)}
            className="rounded-full border border-white/15 p-2 text-white transition-colors
                       hover:border-white/40
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            <ChevronDown aria-hidden className="size-4" />
          </button>
        </div>
      </div>

      {/* No mobile as laterais somem: título e contador vêm para baixo */}
      <div className="mt-4 flex items-baseline justify-between px-1 md:hidden">
        <div>
          <p className="text-[15px] font-medium tracking-[-0.01em] text-white">{atual.title}</p>
          <p className="mt-1 font-mono text-[10px] tracking-[0.04em] text-white/40">{atual.meta}</p>
        </div>
        <p className="font-mono text-[11px] tabular-nums text-white/35">
          {String(current + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
        </p>
      </div>
    </div>
  );
}
