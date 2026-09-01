"use client";

import type { Creative } from "@/components/ui/creative-stack";

/**
 * Fallback estático da galeria de criativos: uma CARTELA compacta de
 * posters, tamanho de contato — não a grade gigante que parecia bug.
 * Usada sob prefers-reduced-motion, sem WebGL e com WebGL por software
 * (aceleração de GPU desligada), onde a galeria 3D moeria a máquina.
 *
 * Vive em arquivo próprio de propósito: a seção importa a galeria 3D só via
 * next/dynamic, e um import estático de qualquer coisa no mesmo arquivo da
 * galeria arrastaria o three.js inteiro para o bundle inicial da home.
 */
export function CreativePosterGrid({ items, className }: { items: Creative[]; className?: string }) {
  return (
    <div className={className}>
      <ul className="grid grid-cols-3 gap-2 sm:gap-3 md:grid-cols-6">
        {items.map((item) => (
          <li
            key={item.slug}
            className="relative overflow-hidden rounded-lg ring-1 ring-white/10"
            style={{ aspectRatio: "9 / 16" }}
          >
            {/* Poster estático — sem next/image: o site serve imagens cruas
                (unoptimized) e aqui não há dimensões dinâmicas */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/videos/${item.slug}.webp`}
              alt={item.title}
              loading="lazy"
              draggable={false}
              className="pointer-events-none size-full select-none object-cover"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
