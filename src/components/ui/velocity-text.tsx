"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

interface VelocityTextProps {
  /** A frase que atravessa a tela. Uma linha só — ela corre na horizontal. */
  phrase: string;
  className?: string;
}

/**
 * Frase em parallax horizontal, logo após o hero: trilho alto com palco
 * sticky de tela cheia; a frase corre com o scroll — e a página SÓ SOLTA
 * quando a última letra da última palavra TERMINOU DE SAIR, parada na borda
 * esquerda da tela.
 *
 * Adaptações sobre o componente de referência:
 * - Sem o skew da referência: o usuário não quer as palavras se mexendo —
 *   a frase apenas translada, rígida.
 * - A referência transladava -4000px fixos, então o fim do texto era
 *   loteria. Aqui a distância é a LARGURA MEDIDA da frase (o percurso
 *   completo: a borda direita do texto termina na borda esquerda útil da
 *   tela), e o offset ["start start","end end"] fecha o progresso em 1
 *   exatamente no instante em que o sticky solta. Última letra na esquerda =
 *   fim do trilho, por construção.
 * - O x não tem spring: spring atrasa o alvo, e a frase não teria terminado
 *   quando o trilho soltasse.
 * - Sem uppercase (regra do site) e na tipografia do restante da página.
 * - Sob prefers-reduced-motion vira um bloco estático de texto, sem trilho.
 */
export function VelocityText({ phrase, className }: VelocityTextProps) {
  const railRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const [distancia, setDistancia] = useState(0);
  const reduceMotion = useReducedMotion();

  useLayoutEffect(() => {
    if (reduceMotion) return;
    const medir = () => {
      const texto = textRef.current;
      if (!texto) return;
      // O percurso é a largura inteira da frase: partindo colada à esquerda,
      // transladar scrollWidth px deixa a borda direita (a última letra)
      // exatamente na borda esquerda útil no fim do trilho.
      setDistancia(texto.scrollWidth);
    };
    medir();
    const ro = new ResizeObserver(medir);
    if (textRef.current) ro.observe(textRef.current);
    window.addEventListener("resize", medir);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", medir);
    };
  }, [reduceMotion, phrase]);

  const { scrollYProgress } = useScroll({
    target: railRef,
    offset: ["start start", "end end"],
  });

  const x = useTransform(scrollYProgress, [0, 1], [0, -distancia]);

  if (reduceMotion) {
    return (
      <section className={className}>
        <div className="flex min-h-[50vh] items-center px-6 py-24 sm:px-10">
          <p className="max-w-4xl text-[clamp(2rem,6vw,4.5rem)] font-semibold leading-[0.95] tracking-[-0.045em] text-white">
            {phrase}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section ref={railRef} className={`relative h-[320vh] ${className ?? ""}`}>
      <div className="sticky top-0 flex h-screen items-center overflow-hidden px-6 sm:px-10">
        <motion.p
          ref={textRef}
          style={{ x }}
          className="whitespace-nowrap text-[clamp(3.5rem,10vw,9rem)] font-semibold leading-[0.95] tracking-[-0.045em] text-white"
        >
          {phrase}
        </motion.p>
      </div>
    </section>
  );
}
