import type { Metadata } from "next";
import { Instagram } from "lucide-react";

import { ProductLinks } from "@/components/ui/product-links";
import { products, profile, socials } from "@/lib/links-data";

export const metadata: Metadata = {
  title: "Links",
  description:
    "Produtos de setup, áudio e casa que eu testei antes de indicar, com link direto para Mercado Livre, Amazon, Shopee e AliExpress.",
  alternates: { canonical: "/links" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/links",
    title: "Links | Marcelo Mouro Jr",
    description:
      "Produtos de setup, áudio e casa que eu testei antes de indicar.",
  },
};

export default function LinksPage() {
  return (
    <main className="min-h-screen bg-black">
      <div className="mx-auto flex w-full max-w-lg flex-col px-6 pb-16 pt-20 sm:pt-28">
        {/* Perfil */}
        <header className="flex flex-col items-center text-center">
          <h1 className="text-xl font-medium tracking-[-0.02em] text-white sm:text-2xl">
            {profile.title}
          </h1>
        </header>

        <ProductLinks products={products} />

        {/* Rodapé */}
        <footer className="mt-14 flex flex-col items-center gap-6">
          {socials.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="rounded-full p-2 text-white/40 transition-colors hover:text-white
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
            >
              <Instagram aria-hidden className="size-5" />
            </a>
          ))}

          <p className="font-mono text-[10px] tracking-[0.06em] text-white/20">
            © {new Date().getFullYear()} {profile.name}
          </p>
        </footer>
      </div>
    </main>
  );
}
