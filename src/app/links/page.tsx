import type { Metadata } from "next";
import Link from "next/link";

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
      <div className="mx-auto flex w-full max-w-lg flex-col px-6 pb-16 pt-16 sm:pt-24">
        {/* Perfil */}
        <header className="flex flex-col items-center text-center">
          <h1 className="text-2xl font-semibold tracking-[-0.02em] text-white sm:text-3xl">
            {profile.title}
          </h1>

          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/55">
            {profile.bio}
          </p>
        </header>

        <ProductLinks products={products} />

        {/* Rodapé */}
        <footer className="mt-14 flex flex-col items-center gap-6">
          <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {socials.map(({ label, href }) => {
              const isInternal = href.startsWith("/");
              const className =
                "font-mono text-[11px] uppercase tracking-[0.16em] text-white/40 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded";

              return (
                <li key={label}>
                  {isInternal ? (
                    <Link href={href} className={className}>
                      {label}
                    </Link>
                  ) : (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={className}
                    >
                      {label}
                    </a>
                  )}
                </li>
              );
            })}
          </ul>

          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/20">
            © {new Date().getFullYear()} {profile.name}
          </p>
        </footer>
      </div>
    </main>
  );
}
