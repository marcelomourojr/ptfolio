"use client";

import { useEffect, useRef } from "react";

interface GridBackgroundProps {
  /** Tamanho da célula, em px. */
  size?: number;
  /** Raio do rastro do cursor, em px. */
  radius?: number;
}

/**
 * Grade de fundo que só existe onde o cursor passa.
 *
 * Diferente da versão anterior: sem deriva perpétua (não há
 * `useAnimationFrame`, então parado o custo é zero), em branco em vez de rose
 * — a cor continua vindo do conteúdo — e desligada para quem pediu menos
 * movimento ou navega por toque.
 */
export function GridBackground({ size = 56, radius = 380 }: GridBackgroundProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    let raf = 0;
    let x = 0;
    let y = 0;

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      // O rAF só existe entre um movimento e o quadro seguinte; ele se cancela
      // sozinho. Com o ponteiro parado não sobra nenhum loop rodando.
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        el.style.setProperty("--mx", `${x}px`);
        el.style.setProperty("--my", `${y}px`);
      });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const linhas = `linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)`;
  const celula = `${size}px ${size}px`;
  // Começa fora da tela: nada aparece antes do primeiro movimento do ponteiro.
  const mascara = `radial-gradient(${radius}px circle at var(--mx) var(--my), #000 0%, transparent 70%)`;

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10"
      style={{ ["--mx" as string]: "-9999px", ["--my" as string]: "-9999px" }}
    >
      {/* Base: quase invisível, dá textura ao vazio */}
      <div
        className="absolute inset-0 opacity-[0.028]"
        style={{ backgroundImage: linhas, backgroundSize: celula }}
      />

      {/* Rastro: a mesma grade, mais forte, revelada só sob o cursor */}
      <div
        className="absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage: linhas,
          backgroundSize: celula,
          maskImage: mascara,
          WebkitMaskImage: mascara,
        }}
      />
    </div>
  );
}
