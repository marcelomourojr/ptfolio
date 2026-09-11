"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { imageAspect } from "@/lib/image-dims";

interface GalleryStripProps {
  images: string[];
  title: string;
}

/**
 * Faixa de telas do modal.
 *
 * - Cada slide tem a proporção EXATA da sua imagem (altura fixa, largura
 *   derivada) — zero tarja e zero recorte, mesmo em galerias que misturam
 *   retrato e paisagem, como a do Zé dos Concursos.
 * - Loop infinito por triplicação: [A][A][A], começando na cópia do meio.
 *   Quando o scroll sai da janela central, teletransporta exatamente um
 *   período — invisível, porque as cópias são idênticas.
 * - Arrasto com o mouse (pointer capture) com inércia própria; no toque o
 *   scroll nativo já é fluido e continua valendo.
 */
export function GalleryStrip({ images, title }: GalleryStripProps) {
  const n = images.length;
  const loop = n >= 2;
  const items = loop ? [...images, ...images, ...images] : images;

  const stripRef = useRef<HTMLUListElement>(null);
  const periodRef = useRef(0);
  const momentumRaf = useRef(0);
  const drag = useRef({ ativo: false, startX: 0, startScroll: 0, lastX: 0, lastT: 0, v: 0 });
  const [slide, setSlide] = useState(0);

  const stopMomentum = useCallback(() => {
    cancelAnimationFrame(momentumRaf.current);
    momentumRaf.current = 0;
  }, []);

  /** Mede um período (largura de uma cópia). Leitura de offsetLeft é
      síncrona — funciona mesmo com rAF congelado em aba de fundo. */
  const medir = useCallback(() => {
    const strip = stripRef.current;
    if (!strip || !loop) return 0;
    const filhos = strip.children;
    if (filhos.length < n + 1) return 0;
    periodRef.current =
      (filhos[n] as HTMLElement).offsetLeft - (filhos[0] as HTMLElement).offsetLeft;
    return periodRef.current;
  }, [loop, n]);

  /** Posiciona na cópia do meio já no primeiro layout. */
  useLayoutEffect(() => {
    const strip = stripRef.current;
    if (!strip || !loop) return;
    const W = medir();
    if (W > 0) strip.scrollLeft = W;
    const ro = new ResizeObserver(() => medir());
    ro.observe(strip);
    return () => {
      ro.disconnect();
      stopMomentum();
    };
  }, [images, loop, medir, stopMomentum]);

  /** Mantém o scroll na janela central e atualiza o contador. */
  const onScroll = useCallback(() => {
    const strip = stripRef.current;
    if (!strip) return;
    // fallback preguiçoso: se a medição inicial foi engolida (aba de fundo),
    // mede aqui — o primeiro gesto de scroll conserta tudo
    const W = periodRef.current || medir();
    if (loop && W > 0) {
      if (strip.scrollLeft < W * 0.5) strip.scrollLeft += W;
      else if (strip.scrollLeft >= W * 1.5) strip.scrollLeft -= W;
    }
    // slide ativo = item cujo início está mais perto da borda esquerda
    let melhor = 0;
    let menor = Infinity;
    [...strip.children].forEach((el, i) => {
      const d = Math.abs((el as HTMLElement).offsetLeft - strip.scrollLeft);
      if (d < menor) {
        menor = d;
        melhor = i;
      }
    });
    setSlide(melhor % n);
  }, [loop, n, medir]);

  /** Setas: anda um item, atravessando a emenda sem clamp. */
  const passo = useCallback(
    (delta: number) => {
      const strip = stripRef.current;
      if (!strip) return;
      stopMomentum();
      let atual = 0;
      let menor = Infinity;
      [...strip.children].forEach((el, i) => {
        const d = Math.abs((el as HTMLElement).offsetLeft - strip.scrollLeft);
        if (d < menor) {
          menor = d;
          atual = i;
        }
      });
      const alvo = strip.children[atual + delta] as HTMLElement | undefined;
      if (!alvo) return;
      strip.scrollTo({ left: alvo.offsetLeft, behavior: "smooth" });
    },
    [stopMomentum],
  );

  /** Arrasto de mouse com inércia. Toque fica com o scroll nativo. */
  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLUListElement>) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      const strip = stripRef.current;
      if (!strip) return;
      stopMomentum();
      // Capture mantém o arrasto vivo fora da faixa; se indisponível
      // (pointer sintético, browsers antigos), o arrasto funciona igual.
      try {
        strip.setPointerCapture(e.pointerId);
      } catch {}
      drag.current = {
        ativo: true,
        startX: e.clientX,
        startScroll: strip.scrollLeft,
        lastX: e.clientX,
        lastT: performance.now(),
        v: 0,
      };
    },
    [stopMomentum],
  );

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLUListElement>) => {
    const strip = stripRef.current;
    const d = drag.current;
    if (!strip || !d.ativo) return;
    strip.scrollLeft = d.startScroll - (e.clientX - d.startX);
    const agora = performance.now();
    const dt = agora - d.lastT;
    if (dt > 0) {
      // px por ms, suavizado para a inércia não depender de um único evento
      d.v = 0.8 * d.v + 0.2 * ((e.clientX - d.lastX) / dt);
      d.lastX = e.clientX;
      d.lastT = agora;
    }
  }, []);

  const onPointerUp = useCallback((e: React.PointerEvent<HTMLUListElement>) => {
    const strip = stripRef.current;
    const d = drag.current;
    if (!strip || !d.ativo) return;
    d.ativo = false;
    try {
      strip.releasePointerCapture(e.pointerId);
    } catch {}
    // inércia: decaimento exponencial até parar
    let v = d.v * 16; // px por frame de ~16ms
    const rolar = () => {
      if (Math.abs(v) < 0.4) return;
      strip.scrollLeft -= v;
      v *= 0.94;
      momentumRaf.current = requestAnimationFrame(rolar);
    };
    momentumRaf.current = requestAnimationFrame(rolar);
  }, []);

  return (
    <div className="mt-12 border-t border-white/10 pt-8">
      <div className="flex items-center justify-between">
        <p className="font-mono text-micro tracking-[0.08em] text-white/50">Telas</p>
        {n > 1 && (
          <div className="flex items-center gap-2">
            <span className="mr-2 font-mono text-micro tabular-nums text-white/50">
              {String(slide + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
            </span>
            <button
              type="button"
              aria-label="Tela anterior"
              onClick={() => passo(-1)}
              className="rounded-full border border-white/15 p-2 text-white transition-colors
                         hover:border-white/40
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            >
              <ChevronLeft aria-hidden className="size-4" />
            </button>
            <button
              type="button"
              aria-label="Próxima tela"
              onClick={() => passo(1)}
              className="rounded-full border border-white/15 p-2 text-white transition-colors
                         hover:border-white/40
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            >
              <ChevronRight aria-hidden className="size-4" />
            </button>
          </div>
        )}
      </div>

      <ul
        ref={stripRef}
        onScroll={onScroll}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className="mt-6 flex cursor-grab select-none gap-4 overflow-x-auto pb-4
                   active:cursor-grabbing
                   [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((src, i) => (
          <li
            key={`${src}-${i}`}
            aria-hidden={loop && (i < n || i >= n * 2) ? true : undefined}
            className="relative h-[46vh] shrink-0 overflow-hidden rounded-lg ring-1 ring-white/10 sm:h-[56vh]"
            style={{ aspectRatio: imageAspect(src) }}
          >
            <Image
              src={src}
              alt={loop && (i < n || i >= n * 2) ? "" : `${title} — tela ${(i % n) + 1}`}
              fill
              sizes="60vh"
              draggable={false}
              className="pointer-events-none select-none object-cover"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
