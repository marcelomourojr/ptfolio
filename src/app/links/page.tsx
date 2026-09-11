import type { Metadata } from "next";
import Link from "next/link";
import { Instagram } from "lucide-react";

import { ProductLinks } from "@/components/ui/product-links";
import { products, profile, socials } from "@/lib/links-data";

// A descrição precisa bater com o que está na página: quando ela promete
// categorias que não existem, o Google descarta e reescreve o snippet.
const descricao =
  "Controles de Nintendo Switch, PC e Android que eu testei antes de indicar, com link direto para Mercado Livre e Shopee.";

export const metadata: Metadata = {
  title: "Links",
  description: descricao,
  alternates: { canonical: "/links" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/links",
    siteName: "Marcelo Mouro Jr",
    title: "Links | Marcelo Mouro Jr",
    description: descricao,
    // No App Router o openGraph do filho SUBSTITUI o do pai inteiro, sem
    // mesclar campo a campo — sem declarar a imagem aqui, a /links ia para
    // as conversas como card sem imagem.
    images: [
      {
        url: "/images/og.png",
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "Marcelo Mouro Jr — Product Designer UI/UX",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Links | Marcelo Mouro Jr",
    description: descricao,
    images: [
      { url: "/images/og.png", alt: "Marcelo Mouro Jr — Product Designer UI/UX" },
    ],
  },
};

export default function LinksPage() {
  const instagram = socials.find((s) => s.label === "Instagram");
  const portfolio = socials.find((s) => s.href.startsWith("/"));

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col px-6 pt-20 sm:pt-28">
        {/* Perfil */}
        <header className="flex flex-col items-center text-center">
          <h1 className="text-destaque font-medium text-white">
            {profile.title}
          </h1>
        </header>

        <ProductLinks products={products} />
      </main>

      {/* Fora do <main> de propósito: <footer> só vira landmark `contentinfo`
          quando é descendente direto do body, e é por ele que quem navega por
          landmarks salta para o rodapé. */}
      <footer className="mx-auto flex w-full max-w-lg flex-col items-center gap-5 px-6 pb-16 pt-14">
        {instagram && (
          <a
            href={instagram.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="rounded-full p-2 text-white/50 transition-colors hover:text-white
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          >
            <Instagram aria-hidden className="size-5" />
          </a>
        )}

        {portfolio && (
          <Link
            href={portfolio.href}
            className="font-mono text-micro tracking-[0.06em] text-white/50 transition-colors hover:text-white
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          >
            {portfolio.label}
          </Link>
        )}

        <p className="font-mono text-micro tracking-[0.06em] text-white/50">
          © {new Date().getFullYear()} {profile.name}
        </p>
      </footer>
    </div>
  );
}
