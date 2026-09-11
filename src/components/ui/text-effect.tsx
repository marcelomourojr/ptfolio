"use client";

import React from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type TargetAndTransition,
  type Variants,
} from "framer-motion";

import { cn } from "@/lib/utils";

type PresetType = "blur" | "scale" | "fade" | "slide";

type TextEffectProps = {
  children: string;
  per?: "word" | "char" | "line";
  as?: keyof React.JSX.IntrinsicElements;
  variants?: { container?: Variants; item?: Variants };
  className?: string;
  preset?: PresetType;
  delay?: number;
  segmentWrapperClassName?: string;
};

/**
 * Texto que entra por segmento (palavra, letra ou linha), com presets de
 * fade/blur/slide/scale. Usado no hero (eyebrow e declaração).
 *
 * Adaptações sobre o componente de referência:
 * - Sob prefers-reduced-motion renderiza o texto puro, sem stagger.
 * - Preset "shake" removido (fora da linguagem do site) e o split de linha
 *   corrigido ("\n" — o original tinha uma quebra literal no meio da string).
 * - Sem trigger/exit externos: aqui todo uso é entrada única.
 */

const defaultStaggerTimes: Record<"char" | "word" | "line", number> = {
  char: 0.03,
  word: 0.05,
  line: 0.1,
};

const defaultContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const defaultItemVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const presetVariants: Record<PresetType, { container: Variants; item: Variants }> = {
  blur: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, filter: "blur(12px)" },
      visible: { opacity: 1, filter: "blur(0px)" },
    },
  },
  scale: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, scale: 0 },
      visible: { opacity: 1, scale: 1 },
    },
  },
  fade: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    },
  },
  slide: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
    },
  },
};

const AnimationComponent: React.FC<{
  segment: string;
  variants: Variants;
  per: "line" | "word" | "char";
  segmentWrapperClassName?: string;
}> = React.memo(({ segment, variants, per, segmentWrapperClassName }) => {
  const content =
    per === "line" ? (
      <motion.span variants={variants} className="block">
        {segment}
      </motion.span>
    ) : per === "word" ? (
      <motion.span aria-hidden="true" variants={variants} className="inline-block whitespace-pre">
        {segment}
      </motion.span>
    ) : (
      <motion.span className="inline-block whitespace-pre">
        {segment.split("").map((char, charIndex) => (
          <motion.span
            key={`char-${charIndex}`}
            aria-hidden="true"
            variants={variants}
            className="inline-block whitespace-pre"
          >
            {char}
          </motion.span>
        ))}
      </motion.span>
    );

  if (!segmentWrapperClassName) return content;

  const defaultWrapperClassName = per === "line" ? "block" : "inline-block";
  return <span className={cn(defaultWrapperClassName, segmentWrapperClassName)}>{content}</span>;
});

AnimationComponent.displayName = "AnimationComponent";

export function TextEffect({
  children,
  per = "word",
  as = "p",
  variants,
  className,
  preset,
  delay = 0,
  segmentWrapperClassName,
}: TextEffectProps) {
  const reduceMotion = useReducedMotion();

  const Tag = as as "p";
  if (reduceMotion) {
    return <Tag className={className}>{children}</Tag>;
  }

  let segments: string[];
  if (per === "line") segments = children.split("\n");
  else if (per === "word") segments = children.split(/(\s+)/);
  else segments = children.split("");

  const MotionTag = motion[as as keyof typeof motion] as typeof motion.p;
  const selectedVariants = preset
    ? presetVariants[preset]
    : { container: defaultContainerVariants, item: defaultItemVariants };
  const containerVariants = variants?.container || selectedVariants.container;
  const itemVariants = variants?.item || selectedVariants.item;
  const stagger = defaultStaggerTimes[per];

  const delayedContainerVariants: Variants = {
    hidden: containerVariants.hidden,
    visible: {
      ...containerVariants.visible,
      transition: {
        ...(containerVariants.visible as TargetAndTransition)?.transition,
        staggerChildren:
          (containerVariants.visible as TargetAndTransition)?.transition?.staggerChildren ||
          stagger,
        delayChildren: delay,
      },
    },
  };

  return (
    <AnimatePresence mode="popLayout">
      <MotionTag
        initial="hidden"
        animate="visible"
        variants={delayedContainerVariants}
        className={cn("whitespace-pre-wrap", className)}
      >
        {/* O texto de verdade, para leitor de tela. Antes isto era um
            aria-label no próprio elemento — mas o papel ARIA `paragraph` tem
            "Name from: prohibited", então o rótulo era descartado e, como
            cada pedaço animado é aria-hidden, a frase inteira ficava sem
            nome acessível. Um nó de texto oculto não tem essa restrição.

            Só em `word` e `char`: no modo `line` os segmentos NÃO são
            aria-hidden, então o texto já é lido — duplicar aqui faria o
            leitor anunciar a frase duas vezes. */}
        {per !== "line" && <span className="sr-only">{children}</span>}

        {segments.map((segment, index) => (
          <AnimationComponent
            key={`${per}-${index}-${segment}`}
            segment={segment}
            variants={itemVariants}
            per={per}
            segmentWrapperClassName={segmentWrapperClassName}
          />
        ))}
      </MotionTag>
    </AnimatePresence>
  );
}
