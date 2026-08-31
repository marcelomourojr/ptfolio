"use client";

import { useRef } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  type UseInViewOptions,
  type Variants,
} from "framer-motion";

type MarginType = UseInViewOptions["margin"];

interface BlurFadeProps {
  children: React.ReactNode;
  className?: string;
  duration?: number;
  delay?: number;
  yOffset?: number;
  inViewMargin?: MarginType;
  blur?: string;
}

/**
 * Entrada com desfoque: o bloco chega subindo enquanto o blur dissolve.
 * Usado nos textos de apoio das seções.
 *
 * Adaptações sobre o componente de referência:
 * - `visible.y` era `-yOffset` (o elemento PARAVA deslocado para cima,
 *   desalinhado do layout). Aqui termina em 0, no lugar.
 * - Sempre dispara por viewport (o modo "anima no mount" da referência não
 *   faz sentido numa página longa) e respeita prefers-reduced-motion.
 * - AnimatePresence removido: nada aqui desmonta com exit.
 */
export function BlurFade({
  children,
  className,
  duration = 0.5,
  delay = 0,
  yOffset = 12,
  inViewMargin = "-50px",
  blur = "6px",
}: BlurFadeProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: inViewMargin });
  const reduceMotion = useReducedMotion();

  const variants: Variants = {
    hidden: { y: yOffset, opacity: 0, filter: `blur(${blur})` },
    visible: { y: 0, opacity: 1, filter: "blur(0px)" },
  };

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={variants}
      transition={{ delay, duration, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
