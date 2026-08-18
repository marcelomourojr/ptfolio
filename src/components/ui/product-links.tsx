"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import { ACCENT, type ProductLink } from "@/lib/links-data";

const ALL = "Todos";

function Spine() {
  return (
    <span
      aria-hidden
      className="absolute inset-y-0 left-0 z-10 w-[3px]"
      style={{ backgroundColor: ACCENT }}
    />
  );
}

function ProductCard({ item, featured = false }: { item: ProductLink; featured?: boolean }) {
  return (
    <a
      href={item.url}
      target="_blank"
      // `sponsored` é o rel correto para link de afiliado.
      rel="sponsored nofollow noopener noreferrer"
      className={`group relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03]
                  transition-colors duration-300 hover:border-white/20 hover:bg-white/[0.06]
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60
                  ${featured ? "gap-4 p-5 sm:p-6" : "gap-3 p-4 sm:p-5"}`}
    >
      <Spine />

      {/* Destaque com foto: imagem sangrada no topo do card */}
      {featured && item.image && (
        <div className="relative -mx-5 -mt-5 aspect-[16/10] sm:-mx-6 sm:-mt-6">
          <Image
            src={item.image}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, 512px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        </div>
      )}

      {featured && (
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/35">
          Recomendação da semana
        </span>
      )}

      <div className="flex items-center gap-4">
        {/* Card normal com foto: miniatura quadrada à esquerda */}
        {!featured && item.image && (
          <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-white/5 sm:size-16">
            <Image
              src={item.image}
              alt=""
              fill
              sizes="64px"
              className="object-cover"
            />
          </div>
        )}

        <div className="min-w-0 flex-1">
          <h3
            className={`font-medium leading-snug text-white ${
              featured ? "text-lg sm:text-xl" : "text-[15px] sm:text-base"
            }`}
          >
            {item.title}
          </h3>
        </div>

        <ArrowUpRight
          aria-hidden
          style={{ ["--accent" as string]: ACCENT }}
          className="size-4 shrink-0 text-white/25 transition-all duration-300
                     group-hover:-translate-y-0.5 group-hover:translate-x-0.5
                     group-hover:text-[var(--accent)]"
        />
      </div>
    </a>
  );
}

export function ProductLinks({ products }: { products: ProductLink[] }) {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(ALL);

  const categories = useMemo(
    () => [ALL, ...Array.from(new Set(products.map((p) => p.category)))],
    [products],
  );

  const visible = useMemo(
    () => (active === ALL ? products : products.filter((p) => p.category === active)),
    [products, active],
  );

  const featured = visible.find((p) => p.featured);
  const rest = visible.filter((p) => p !== featured);

  return (
    <>
      {/* Filtros — rolagem horizontal no mobile, sem barra visível */}
      {/* Poucas categorias: quebrar em linhas centralizadas mostra todas de uma
          vez. Rolagem horizontal esconderia opções e não centraliza no mobile. */}
      <nav aria-label="Filtrar por categoria" className="mt-10">
        <ul className="flex flex-wrap justify-center gap-2">
          {categories.map((category) => {
            const isActive = category === active;
            return (
              <li key={category}>
                <button
                  type="button"
                  onClick={() => setActive(category)}
                  aria-pressed={isActive}
                  className={`whitespace-nowrap rounded-full border px-3.5 py-1.5 font-mono text-[11px] uppercase
                              tracking-[0.14em] transition-colors duration-200
                              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50
                              ${
                                isActive
                                  ? "border-white/25 bg-white text-black"
                                  : "border-white/10 bg-white/[0.03] text-white/50 hover:border-white/25 hover:text-white"
                              }`}
                >
                  {category}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Lista. A key remonta a lista ao trocar de filtro, refazendo o stagger. */}
      <ul key={active} className="mt-6 flex flex-col gap-3">
        {[featured, ...rest].filter(Boolean).map((item, index) => {
          const product = item as ProductLink;
          return (
            <motion.li
              key={product.id}
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: reduceMotion ? 0 : Math.min(index * 0.05, 0.4),
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <ProductCard item={product} featured={product.featured} />
            </motion.li>
          );
        })}
      </ul>

      {visible.length === 0 && (
        <p className="mt-10 text-center text-sm text-white/40">
          Nada nesta categoria ainda. Escolha outra ou volte em alguns dias.
        </p>
      )}
    </>
  );
}
