"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

interface NavLink {
  label: string;
  href: string;
}

interface NotchHeaderProps {
  links: NavLink[];
}

/** O Lenis da página, exposto em window pela home para a rolagem suave. */
interface LenisLike {
  scrollTo: (alvo: string, opts?: { duration?: number; offset?: number }) => void;
}

/**
 * Navbar em "notch": barra branca pendurada na borda superior com asas
 * curvas — menu no centro (desktop) ou a seção ativa com gaveta (mobile).
 * O wordmark vive FORA do notch, solto no canto esquerdo.
 *
 * Adaptações sobre o componente de referência:
 * - A referência era uma casca de app (viewport próprio de scroll) — aqui é
 *   só um header fixo; a página continua dona do scroll (Lenis).
 * - Abas viraram âncoras com aria-current; o ativo é SCROLLSPY, e o clique
 *   rola SUAVE via lenis.scrollTo (fallback scrollIntoView smooth). Sob
 *   prefers-reduced-motion o salto é instantâneo, como o resto do site.
 * - As asas se sobrepõem 1px à barra: em DPR fracionário a emenda exata
 *   abria uma fresta de subpixel e o preto de trás virava um fio cinza.
 */

function Wing({ lado, className }: { lado: "esq" | "dir"; className?: string }) {
  return (
    <svg
      aria-hidden
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      shapeRendering="geometricPrecision"
      className={cn(
        "pointer-events-none absolute top-0 size-2.5 select-none text-white md:size-4",
        lado === "esq" ? "right-full translate-x-px" : "left-full -translate-x-px",
        className,
      )}
    >
      <path
        d={
          lado === "esq"
            ? "M 0 0 C 11.046 0 20 8.954 20 20 H 21 V -1 H 0 Z"
            : "M 20 0 C 8.954 0 0 8.954 0 20 H -1 V -1 H 20 Z"
        }
        fill="currentColor"
      />
    </svg>
  );
}

export function NotchHeader({ links }: NotchHeaderProps) {
  const [ativo, setAtivo] = useState(links[0]?.href ?? "");
  const [aberto, setAberto] = useState(false);
  const ilhaRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  // Scrollspy: a seção que cruza a faixa do meio da tela vira o item ativo
  useEffect(() => {
    const secoes = links
      .map((l) => document.querySelector(l.href))
      .filter((el): el is Element => el !== null);
    const io = new IntersectionObserver(
      (entries) => {
        const visivel = entries.find((e) => e.isIntersecting);
        if (visivel) setAtivo(`#${visivel.target.id}`);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    secoes.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [links]);

  // Gaveta mobile fecha em clique fora e no Esc
  useEffect(() => {
    if (!aberto) return;
    const fora = (e: globalThis.MouseEvent) => {
      if (ilhaRef.current && !ilhaRef.current.contains(e.target as Node)) setAberto(false);
    };
    const esc = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") setAberto(false);
    };
    document.addEventListener("mousedown", fora);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", fora);
      document.removeEventListener("keydown", esc);
    };
  }, [aberto]);

  /** Rolagem suave até a âncora — pelo Lenis quando ele existe. Sob
      prefers-reduced-motion deixa o salto nativo instantâneo acontecer. */
  const navegar = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      setAberto(false);
      if (reduceMotion) return;
      e.preventDefault();
      const lenis = (window as { __lenis?: LenisLike }).__lenis;
      // offset compensa a barra fixa (h-12) — sem ele o título da seção
      // parava debaixo do cabeçalho.
      if (lenis) lenis.scrollTo(href, { duration: 1.4, offset: -72 });
      else document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    },
    [reduceMotion],
  );

  const rotuloAtivo = links.find((l) => l.href === ativo)?.label ?? links[0]?.label;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-50">
      {/* Sem wordmark no header, por decisão do usuário: o notch central é a
          única presença — o nome já domina o hero logo abaixo. */}
      {/* Notch central: o menu (desktop) */}
      <nav
        aria-label="Seções do site"
        className="pointer-events-auto absolute left-1/2 top-0 hidden h-12 -translate-x-1/2 items-center rounded-b-3xl bg-white px-4 lg:flex"
      >
        <Wing lado="esq" />
        <Wing lado="dir" />
        <LayoutGroup>
          <div className="flex items-center gap-1">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={(e) => navegar(e, l.href)}
                aria-current={ativo === l.href ? "true" : undefined}
                className="relative flex h-9 items-center rounded-full px-3.5 text-meta font-medium outline-none
                           focus-visible:ring-2 focus-visible:ring-black/70"
              >
                {ativo === l.href && (
                  <motion.span
                    layoutId="notch-pilula"
                    className="absolute inset-0 rounded-full bg-black"
                    transition={
                      reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 400, damping: 30 }
                    }
                  />
                )}
                <span
                  className={cn(
                    "relative z-10 leading-none transition-colors",
                    ativo === l.href ? "font-semibold text-white" : "text-black/55 hover:text-black",
                  )}
                >
                  {l.label}
                </span>
              </a>
            ))}
          </div>
        </LayoutGroup>
      </nav>

      {/* Ilha mobile/tablet: SÓ a seção ativa (que abre a gaveta) */}
      <div
        ref={ilhaRef}
        className="pointer-events-auto absolute left-1/2 top-0 flex -translate-x-1/2 flex-col rounded-b-3xl bg-white px-3 lg:hidden"
      >
        <Wing lado="esq" />
        <Wing lado="dir" />

        <div className="flex h-11 items-center justify-center">
          <button
            type="button"
            aria-expanded={aberto}
            aria-haspopup="true"
            aria-label="Abrir navegação"
            onClick={() => setAberto((a) => !a)}
            className="flex h-8 items-center gap-1.5 rounded-full px-2.5 text-meta font-semibold text-black outline-none
                       focus-visible:ring-2 focus-visible:ring-black/70"
          >
            <span className="leading-none">{rotuloAtivo}</span>
            <ChevronDown
              aria-hidden
              className={cn(
                "size-3.5 text-black/45 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                aberto && "rotate-180",
              )}
            />
          </button>
        </div>

        {/* Gaveta: abre na curva do site (lenta no fim), com os itens
            entrando em cascata — nada de estalo */}
        <div
          className={cn(
            "grid transition-[grid-template-rows] duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
            aberto ? "grid-rows-[1fr]" : "pointer-events-none grid-rows-[0fr]",
          )}
        >
          {/* `inert` quando fechada: opacity-0 + pointer-events-none escondem
              do olho e do mouse, mas os 5 links continuavam na ordem de
              tabulação — quem navega por teclado passava por destinos
              invisíveis. `inert` tira do foco e da árvore de acessibilidade. */}
          <div className="overflow-hidden" inert={!aberto}>
            <nav aria-label="Seções do site" className="flex flex-col gap-0.5 px-0.5 pb-2.5 pt-1">
              {links.map((l, i) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={(e) => navegar(e, l.href)}
                  aria-current={ativo === l.href ? "true" : undefined}
                  style={{ transitionDelay: aberto ? `${80 + i * 45}ms` : "0ms" }}
                  className={cn(
                    "rounded-xl px-3 py-2 text-meta outline-none focus-visible:ring-2 focus-visible:ring-black/70",
                    "transition-[opacity,transform,background-color,color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                    aberto ? "translate-y-0 opacity-100" : "translate-y-1.5 opacity-0",
                    ativo === l.href
                      ? "bg-black font-semibold text-white"
                      : "text-black/55 hover:bg-black/5 hover:text-black",
                  )}
                >
                  {l.label}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
