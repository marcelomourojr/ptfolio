"use client";

/* eslint-disable @next/next/no-img-element --
   As logos usam <img> cru de propósito. O next.config tem
   `images.unoptimized: true`, então o next/image emitiria exatamente esta
   mesma tag sem otimizar nada — e para SVG de algumas centenas de bytes, com
   altura exata em px e filtro CSS, a tag crua é mais simples e mais direta. */

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { CertificateLightbox } from "@/components/ui/certificate-lightbox";

export interface Certificate {
  /** Nome do certificado. */
  title: string;
  /** Quem emitiu. Vira o texto alternativo da logo. */
  issuer: string;
  /** Como sai na tela, ex.: "Emitida em jan de 2025". */
  date: string;
  /** Arquivo da logo em /public/images/certificados. */
  logo: string;
  /**
   * Certificado que existe como IMAGEM: "Ver certificado" abre um lightbox na
   * própria página. Tem prioridade sobre `url`, que aí vira o link de
   * validação no rodapé do lightbox.
   */
  image?: string;
  /** Link externo (página de verificação). Sozinho, o botão abre em nova aba. */
  url?: string;
  credentialId?: string;
}

interface CertificatesSectionProps {
  items: Certificate[];
  title?: string;
  description?: string;
  /** Altura de todas as logos, em px. Uma só para o conjunto ficar regular. */
  logoHeight?: number;
}

/**
 * Certificados.
 *
 * Composição: a coluna da esquerda fica parada e mostra só a LOGO de quem
 * emitiu; a da direita rola pelos certificados. As duas ficam num trilho
 * centralizado e alinhadas pelo centro vertical da tela — logo e título são
 * um par, lado a lado, no meio da página, e não dois blocos jogados nas
 * bordas.
 *
 * A troca da logo é comandada pelo cartão que cruza o meio da tela (daí o
 * `rootMargin` de -50% em cima e embaixo). As logos ficam empilhadas na mesma
 * caixa e só a opacidade muda, então o fade cruzado não mexe no layout.
 *
 * As logos saem nas cores originais da marca. Duas exceções vêm do próprio
 * arquivo, não de escolha: USP e Imagenation são as versões NEGATIVAS (arte
 * branca) porque as positivas dessas duas são escuras e sumiriam no preto —
 * é o que as próprias marcas prescrevem para fundo escuro.
 *
 * Sem Lenis próprio de propósito: a página já instancia um global em
 * `src/app/page.tsx` e uma segunda instância brigaria com ele pela rolagem.
 * O efeito é `position: sticky` puro.
 */
export function CertificatesSection({
  items,
  title = "Certificados",
  description = "Cursos e certificações concluídos, do design de interface à infraestrutura em nuvem.",
  logoHeight = 56,
}: CertificatesSectionProps) {
  const reduceMotion = useReducedMotion();
  const [ativo, setAtivo] = useState(0);
  const cardsRef = useRef<(HTMLLIElement | null)[]>([]);

  // Lightbox: guarda quem abriu para devolver o foco ao fechar
  // Só certificados com `image` entram aqui (o botão só abre nesse caso), e o
  // objeto é o próprio item do array — identidade estável, para o useEffect
  // do lightbox não se re-inscrever a cada render.
  const [aberto, setAberto] = useState<(Certificate & { image: string }) | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const fechar = useCallback(() => {
    setAberto(null);
    triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    const nos = cardsRef.current.filter(Boolean) as HTMLLIElement[];
    if (!nos.length) return;

    const io = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (!e.isIntersecting) continue;
          const i = Number((e.target as HTMLElement).dataset.indice);
          if (!Number.isNaN(i)) setAtivo(i);
        }
      },
      { rootMargin: "-50% 0px -50% 0px", threshold: 0 },
    );

    nos.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, [items]);

  return (
    <section id="certificados" className="px-6 py-16 sm:px-10 sm:py-20">
      {/* Largura cheia, sem `mx-auto max-w-*`: é isso que faz o cabeçalho
          nascer na mesma borda esquerda de "Sobre", "Projetos" e "Vamos
          Conversar" — todas essas seções são `px-6 sm:px-10` com o cabeçalho
          encostado no padding, sem trilho centralizado. */}
      <div className="lg:grid lg:grid-cols-2 lg:gap-14">
        {/* ---------- Esquerda: fica parada por inteiro ---------- */}
        <div className="lg:sticky lg:top-0 lg:h-svh">
          {/* O cabeçalho vive aqui dentro para acompanhar a rolagem: enquanto
              os certificados passam, o leitor continua vendo em que seção
              está. No mobile é fluxo normal; no desktop vai para o topo da
              área parada. */}
          <motion.header
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="lg:absolute lg:inset-x-0 lg:top-[14vh]"
          >
            {/* Só a marca de canto: o rótulo "Formação" saiu a pedido. */}
            <span aria-hidden className="block size-2 border-l border-t border-rose-500" />

            {/* Escala menor que a das outras seções: aqui o título divide a
                coluna com a logo, e o clamp de 4.5rem do padrão a engoliria. */}
            <h2 className="mt-4 text-display-contido font-semibold text-white">
              {title}
            </h2>

            <p className="mt-4 max-w-sm text-corpo text-white/60">{description}</p>
          </motion.header>

          {/* A logo no centro EXATO da tela, para continuar na mesma linha do
              título do certificado à direita. Fora do fluxo, então o cabeçalho
              acima não a empurra. */}
          <div className="hidden lg:absolute lg:inset-0 lg:flex lg:items-center lg:justify-center">
            <div className="relative flex h-16 w-full items-center justify-center">
              {items.map((cert, i) => (
                <img
                  key={cert.title}
                  src={cert.logo}
                  alt={cert.issuer}
                  draggable={false}
                  style={{ height: logoHeight }}
                  className={cn(
                    "absolute w-auto max-w-full object-contain",
                    "transition-opacity ease-out",
                    reduceMotion ? "duration-0" : "duration-500",
                    i === ativo ? "opacity-100" : "opacity-0",
                  )}
                />
              ))}
            </div>
          </div>

        </div>

        {/* ---------- Direita: os certificados ---------- */}
        <ol className="flex flex-col">
          {items.map((cert, i) => (
            <li
              key={cert.title}
              data-indice={i}
              ref={(n) => {
                cardsRef.current[i] = n;
              }}
              // Uma tela por certificado é o que dá o compasso do efeito. No
              // mobile não há coluna parada, então altura cheia seria só
              // rolagem vazia — lá o cartão ocupa o que precisa.
              className="flex flex-col justify-center border-b border-white/10 py-12 last:border-b-0 lg:min-h-svh lg:border-b-0 lg:py-10"
            >
              <motion.article
                initial={reduceMotion ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-120px" }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* No mobile não existe a coluna da logo, então ela aparece
                    aqui — senão não dá para saber quem certificou. */}
                <img
                  src={cert.logo}
                  alt={cert.issuer}
                  draggable={false}
                  style={{ height: Math.round(logoHeight * 0.75) }}
                  className="mb-6 w-auto max-w-[220px] object-contain lg:hidden"
                />

                <h3 className="text-destaque font-semibold text-white">
                  {cert.title}
                </h3>

                {/* A data "um pouco apagada", como pedido */}
                <p className="mt-3 font-mono text-micro tracking-[0.04em] text-white/50">
                  {cert.date}
                  {cert.credentialId && <span className="ml-3">·&nbsp;{cert.credentialId}</span>}
                </p>

                {(cert.image || cert.url) &&
                  (cert.image ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        triggerRef.current = e.currentTarget;
                        setAberto(cert as Certificate & { image: string });
                      }}
                      className="group mt-7 inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5
                                 text-corpo font-semibold text-white transition-colors
                                 hover:border-white/40
                                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                    >
                      Ver certificado
                      {/* Sem seta diagonal: não sai da página */}
                      <span
                        aria-hidden
                        className="size-1.5 rounded-full bg-white/50 transition-colors duration-300 group-hover:bg-rose-500"
                      />
                    </button>
                  ) : (
                    <a
                      href={cert.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group mt-7 inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5
                                 text-corpo font-semibold text-white transition-colors
                                 hover:border-white/40
                                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                    >
                      Ver certificado
                      <ArrowUpRight
                        aria-hidden
                        className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      />
                    </a>
                  ))}
              </motion.article>
            </li>
          ))}
        </ol>
      </div>

      <CertificateLightbox cert={aberto} onClose={fechar} />
    </section>
  );
}
