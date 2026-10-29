import type { Metadata } from "next";
import Link from "next/link";
import { Translated } from "@/components/language-provider";
import { LanguageSwitch } from "@/components/ui/language-switch";

export const metadata: Metadata = {
  title: "Página não encontrada",
  robots: { index: false, follow: true },
};

/**
 * 404 própria. Sem ela o Next entrega a página padrão, em inglês e sem
 * nenhum link — o visitante ficava num beco sem saída num site todo em pt-BR.
 */
export default function NotFound() {
  return (
    <>
    <LanguageSwitch />
    <main className="flex min-h-screen flex-col items-center justify-center bg-black px-6 text-center">
      <span
        aria-hidden
        className="mb-8 block size-2 border-l border-t border-rose-500"
      />

      <p className="font-mono text-micro tracking-[0.08em] text-white/50"><Translated>Erro 404</Translated></p>

      <h1 className="mt-5 text-display font-semibold text-white">
        <Translated>Essa página não existe</Translated>
      </h1>

      <p className="mt-5 max-w-sm text-corpo text-white/60">
        <Translated>O endereço pode ter mudado de lugar, ou o link que te trouxe até aqui está desatualizado.</Translated>
      </p>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="rounded-full bg-white px-6 py-3 text-corpo font-semibold tracking-[-0.01em] text-black
                     transition-colors hover:bg-white/85
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
        >
          <Translated>Voltar ao início</Translated>
        </Link>
        <Link
          href="/#projetos"
          className="rounded-full border border-white/15 px-6 py-3 text-corpo font-semibold tracking-[-0.01em] text-white
                     transition-colors hover:border-white/40
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
        >
          <Translated>Ver os projetos</Translated>
        </Link>
      </div>
    </main>
    </>
  );
}
