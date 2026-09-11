"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export interface LightboxCertificate {
  title: string;
  issuer: string;
  date: string;
  /** Imagem do certificado em /public. */
  image: string;
  /** Link externo opcional (ex.: página de validação do emissor). */
  url?: string;
  credentialId?: string;
}

interface CertificateLightboxProps {
  cert: LightboxCertificate | null;
  onClose: () => void;
}

/**
 * Lightbox de certificado — para os que existem como IMAGEM, não como página
 * de verificação. Abrir a imagem crua em nova aba parecia link quebrado.
 *
 * Espelha o modal de projeto: Esc fecha, o scroll do body trava (guardando
 * e devolvendo o valor anterior), o foco vai para o Fechar ao abrir e quem
 * abriu recebe o foco de volta (o CertificatesSection cuida disso), e o
 * `data-lenis-prevent` impede o Lenis global de engolir a roda aqui dentro.
 * Clicar no fundo escuro também fecha; clicar na imagem não.
 *
 * A imagem usa `object-contain` numa caixa limitada pela viewport: o badge é
 * quadrado e o certificado é paisagem, e nenhum dos dois pode ser recortado.
 */
export function CertificateLightbox({ cert, onClose }: CertificateLightboxProps) {
  const reduceMotion = useReducedMotion();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!cert) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [cert, onClose]);

  return (
    <AnimatePresence>
      {cert && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="titulo-certificado"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          data-lenis-prevent
          onClick={onClose}
          className="fixed inset-0 z-[70] flex flex-col bg-black/95 backdrop-blur-sm"
        >
          {/* Barra de cima: título à esquerda, Fechar à direita — o mesmo
              Fechar do modal de projeto */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex items-start justify-between gap-6 px-6 py-5 sm:px-10"
          >
            <div className="min-w-0">
              <p className="font-mono text-micro tracking-[0.08em] text-white/50">{cert.issuer}</p>
              <h2
                id="titulo-certificado"
                className="mt-1 truncate text-item font-semibold text-white"
              >
                {cert.title}
              </h2>
            </div>

            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              className="group flex shrink-0 items-center gap-3 rounded-full bg-white/[0.07] py-2.5 pl-5 pr-4 text-corpo
                         font-medium text-white transition-colors hover:bg-white/[0.12]
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            >
              Fechar
              {/* `-translate-y-1/2` é obrigatório junto do `top-1/2`: sem ele
                  o que fica no meio é a BORDA da linha, não o centro dela. */}
              <span
                aria-hidden
                className="relative block size-4 transition-transform duration-300 ease-out group-hover:rotate-90"
              >
                <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 rotate-45 bg-white" />
                <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 -rotate-45 bg-white" />
              </span>
            </button>
          </div>

          {/* A imagem, centrada, sem recorte. `min-h-0` deixa o flex encolher
              a caixa em vez de estourar a tela em viewport baixa. */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative mx-auto min-h-0 w-full max-w-5xl flex-1 px-6 sm:px-10"
          >
            <div className="relative h-full w-full overflow-hidden rounded-xl border border-white/10 bg-white/[0.02]">
              <Image
                src={cert.image}
                alt={`Certificado: ${cert.title} — ${cert.issuer}`}
                fill
                sizes="(max-width: 1024px) 100vw, 1024px"
                draggable={false}
                priority
                className="object-contain"
              />
            </div>
          </motion.div>

          {/* Rodapé: data, chave e o link de validação quando existir */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 px-6 py-5 sm:px-10"
          >
            <p className="font-mono text-micro tracking-[0.06em] text-white/50">
              {cert.date}
              {cert.credentialId && <span className="ml-3">· chave {cert.credentialId}</span>}
            </p>

            {cert.url && (
              <a
                href={cert.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2
                           text-meta font-semibold text-white transition-colors hover:border-white/40
                           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              >
                Validar no site do emissor
                <ArrowUpRight
                  aria-hidden
                  className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
