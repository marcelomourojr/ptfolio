"use client";

import { Fragment, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface WhisperTextProps {
  text: string;
  className?: string;
  /** Intervalo entre palavras, em ms. */
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
  triggerStart?: string;
}

/**
 * Palavras que "sussurram" para o lugar, uma a uma, quando o elemento entra
 * em cena (GSAP + ScrollTrigger). Usado nos títulos de seção.
 *
 * Adaptações sobre o componente de referência:
 * - O original buscava `[data-word]` no documento INTEIRO (toArray global) —
 *   dois títulos na página animariam um ao outro. Aqui a busca é escopada ao
 *   próprio container.
 * - Espaço entre palavras é texto normal (não gap de flex): o espaçamento do
 *   título fica idêntico ao de um texto comum, em qualquer corpo de fonte.
 * - Sob prefers-reduced-motion nada anima: as palavras já nascem visíveis
 *   (o estado escondido só é aplicado pelo próprio GSAP).
 * - Renderiza <span>, para viver DENTRO do h2 da seção sem mudar semântica.
 */
export function WhisperText({
  text,
  className,
  delay = 100,
  duration = 0.5,
  x = -20,
  y = 0,
  triggerStart = "top 85%",
}: WhisperTextProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const alvos = el.querySelectorAll<HTMLElement>("[data-word]");
      gsap.set(alvos, { opacity: 0, x, y });
      gsap.to(alvos, {
        scrollTrigger: { trigger: el, start: triggerStart, once: true },
        opacity: 1,
        x: 0,
        y: 0,
        duration,
        ease: "power2.out",
        stagger: delay / 1000,
      });
    }, ref);

    return () => ctx.revert();
  }, [text, delay, duration, x, y, triggerStart]);

  const palavras = text.split(" ");

  return (
    <span ref={ref} className={className}>
      {palavras.map((palavra, i) => (
        <Fragment key={`${palavra}-${i}`}>
          <span data-word className="inline-block">
            {palavra}
          </span>
          {i < palavras.length - 1 ? " " : null}
        </Fragment>
      ))}
    </span>
  );
}
