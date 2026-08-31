"use client";

import type { Creative } from "@/components/ui/creative-stack";

/**
 * Fallback estático da galeria de criativos: grade de posters, sem vídeo e
 * sem WebGL. Usada sob `prefers-reduced-motion` e quando WebGL não existe.
 *
 * Vive em arquivo próprio de propósito: a seção importa a galeria 3D só via
 * next/dynamic, e um import estático de qualquer coisa no mesmo arquivo da
 * galeria arrastaria o three.js inteiro para o bundle inicial da home.
 */
export function CreativePosterGrid({ items, className }: { items: Creative[]; className?: string }) {
  return (
    <div className={className}>
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3">
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
              draggable={false}
              className="pointer-events-none size-full select-none object-cover"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
