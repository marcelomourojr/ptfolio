import type { Metadata } from "next";
import Link from "next/link";

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
    <main className="flex min-h-screen flex-col items-center justify-center bg-black px-6 text-center">
      <span
        aria-hidden
        className="mb-8 block size-2 border-l border-t border-rose-500"
      />

      <p className="font-mono text-micro tracking-[0.08em] text-white/50">Erro 404</p>

      <h1 className="mt-5 text-display font-semibold text-white">
        Essa página não existe
      </h1>

      <p className="mt-5 max-w-sm text-corpo text-white/60">
        O endereço pode ter mudado de lugar, ou o link que te trouxe até aqui
        está desatualizado.
      </p>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="rounded-full bg-white px-6 py-3 text-corpo font-semibold tracking-[-0.01em] text-black
                     transition-colors hover:bg-white/85
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
        >
          Voltar ao início
        </Link>
        <Link
          href="/#projetos"
          className="rounded-full border border-white/15 px-6 py-3 text-corpo font-semibold tracking-[-0.01em] text-white
                     transition-colors hover:border-white/40
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
        >
          Ver os projetos
        </Link>
      </div>
    </main>
  );
}
