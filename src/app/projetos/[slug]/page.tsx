import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

import { acharProjeto, projetos, type Projeto } from "@/lib/projects-data";
import { IMAGE_DIMS, imageAspect } from "@/lib/image-dims";
import { cn } from "@/lib/utils";

/**
 * Página de um projeto.
 *
 * Por que ela existe, se o modal da home já mostra o mesmo conteúdo: o modal
 * é montado pelo JavaScript e não muda o endereço. Isso custava duas coisas —
 * ninguém conseguia mandar o link de UM projeto ("entra no site e clica no
 * terceiro card") e o buscador não lia uma linha das descrições. Aqui tudo
 * nasce no HTML, servido pelo Worker.
 *
 * O modal continua existindo para quem está navegando pela home; esta página
 * é o destino de quem chega de fora ou quer compartilhar.
 */

/** Gera as 8 rotas no build. `dynamicParams: false` faz slug desconhecido dar 404. */
export function generateStaticParams() {
  return projetos.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

/** Links "#" são placeholders no conteúdo — não viram botão. */
function ehLink(url?: string): url is string {
  return typeof url === "string" && url.length > 1 && url !== "#";
}

/** Captura de celular: mais alta que larga. */
function ehRetrato(src: string) {
  const d = dimensoes(src);
  return d ? d.altura > d.largura : false;
}

/** "1600 / 1005" -> {largura: 1600, altura: 1005}, para o cartão social. */
function dimensoes(src: string) {
  const bruto = IMAGE_DIMS[src];
  if (!bruto) return null;
  const [l, a] = bruto.split("/").map((n) => Number(n.trim()));
  return Number.isFinite(l) && Number.isFinite(a) ? { largura: l, altura: a } : null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = acharProjeto(slug);
  if (!p) return {};

  const titulo = `${p.title} — ${p.category}`;
  const url = `/projetos/${p.slug}`;
  const capa = p.images[0];
  const dim = capa ? dimensoes(capa) : null;

  // Cada projeto leva a PRÓPRIA capa para as conversas. Antes, qualquer link
  // do site caía no mesmo og.png com a foto do Marcelo — mandar o case do Zé
  // dos Concursos mostrava um retrato dele, não o produto.
  const imagem = capa
    ? [{ url: capa, ...(dim ? { width: dim.largura, height: dim.altura } : {}), alt: `${p.title} — ${p.category}` }]
    : undefined;

  return {
    title: titulo,
    description: p.description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      locale: "pt_BR",
      url,
      siteName: "Marcelo Mouro Jr",
      title: `${titulo} | Marcelo Mouro Jr`,
      description: p.description,
      images: imagem,
    },
    twitter: {
      card: "summary_large_image",
      title: `${titulo} | Marcelo Mouro Jr`,
      description: p.description,
      images: imagem,
    },
  };
}

function Links({ p }: { p: Projeto }) {
  const itens = [
    { href: p.link, rotulo: "Ver site" },
    { href: p.appStoreLink, rotulo: "App Store" },
    { href: p.playStoreLink, rotulo: "Google Play" },
  ].filter((i) => ehLink(i.href));

  if (!itens.length) return null;

  return (
    <div className="mt-10 flex flex-wrap gap-3">
      {itens.map((i) => (
        <a
          key={i.rotulo}
          href={i.href}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5
                     text-corpo font-semibold text-white transition-colors hover:border-white/40
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
        >
          {i.rotulo}
          <ArrowUpRight
            aria-hidden
            className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </a>
      ))}
    </div>
  );
}

export default async function PaginaProjeto({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = acharProjeto(slug);
  if (!p) notFound();

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 pb-24 pt-24 sm:px-10 sm:pt-28">
        <Link
          href="/#projetos"
          className="group inline-flex items-center gap-2 font-mono text-micro tracking-[0.06em] text-white/50
                     transition-colors hover:text-white
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
        >
          <ArrowLeft
            aria-hidden
            className="size-3.5 transition-transform duration-300 group-hover:-translate-x-0.5"
          />
          Todos os projetos
        </Link>

        <header className="relative mt-12">
          {/* A mesma marca de canto do hero e das outras seções. */}
          <span
            aria-hidden
            className="absolute -top-3 left-0 size-2 border-l border-t border-rose-500"
          />

          <p className="font-mono text-micro tracking-[0.08em] text-white/50">
            {p.year} · {p.category}
          </p>

          <h1 className="mt-4 text-display font-semibold text-white">{p.title}</h1>

          <p className="mt-6 max-w-measure text-corpo text-white/60">{p.description}</p>

          {p.tags.length > 0 && (
            <div className="mt-8">
              <h2 className="font-mono text-micro tracking-[0.08em] text-white/40">Ferramentas</h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {p.tags.map((t) => (
                  <li
                    key={t}
                    className="rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-meta text-white/70"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Links p={p} />
        </header>

        {/* Telas em coluna, cada uma na proporção EXATA do arquivo: é o que
            evita tarja e recorte, o mesmo critério da galeria do modal.
            A largura é decidida por imagem, pela proporção do arquivo, e não
            por uma marcação no projeto: uma captura de celular em largura
            cheia daria 1893px de altura cada uma (a página do Verbo passava
            de 9500px). Decidir por arquivo também aguenta galeria mista. */}
        <section className="mt-16" aria-label={`Telas do projeto ${p.title}`}>
          <div className="space-y-6 sm:space-y-8">
            {p.images.map((src, i) => (
              <div
                key={src}
                className={cn(
                  "relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.02] sm:rounded-2xl",
                  ehRetrato(src) && "mx-auto w-full max-w-sm",
                )}
                style={{ aspectRatio: imageAspect(src) }}
              >
                <Image
                  src={src}
                  alt={`${p.title} — tela ${i + 1} de ${p.images.length}`}
                  fill
                  sizes={ehRetrato(src) ? "(max-width: 640px) 100vw, 384px" : "(max-width: 1024px) 100vw, 1024px"}
                  // A primeira é o maior elemento da tela: carregar cedo evita
                  // o buraco branco enquanto o resto desce.
                  priority={i === 0}
                  draggable={false}
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Fora do <main>: <footer> só vira landmark `contentinfo` quando é
          descendente direto do body. */}
      <footer className="mx-auto w-full max-w-5xl px-6 pb-16 sm:px-10">
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-8">
          <Link
            href="/#projetos"
            className="text-corpo text-white/60 transition-colors hover:text-white
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            Ver os outros projetos
          </Link>
          <Link
            href="/#contatos"
            className="text-corpo font-semibold text-white transition-colors hover:text-white/70
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            Falar comigo
          </Link>
        </div>
      </footer>
    </div>
  );
}
