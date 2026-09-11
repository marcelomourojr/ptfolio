"use client";

import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Github, Instagram, Linkedin, Mail } from "lucide-react";

import { BlurFade } from "@/components/ui/blur-fade";
import { WhisperText } from "@/components/ui/whisper-text";

// O shader WebGL do CTA fica fora do JS inicial; o placeholder tem o mesmo
// tamanho e aparência de repouso, então não há salto de layout.
const LiquidMetalButton = dynamic(
  () => import("./liquid-metal-button").then((m) => m.LiquidMetalButton),
  {
    ssr: false,
    loading: () => (
      <span
        aria-hidden
        className="inline-block rounded-full"
        style={{
          width: 224,
          height: 58,
          background: "linear-gradient(180deg, #202020 0%, #000000 100%)",
          boxShadow: "0 0 0 2px #2a2a2a",
        }}
      />
    ),
  },
);

interface Channel {
  label: string;
  handle: string;
  href: string;
  icon: React.ReactNode;
}

interface ContactSectionProps {
  title?: string;
  email?: string;
  /** Só dígitos, com código do país: 55 + DDD + número. */
  whatsapp?: string;
  channels?: Channel[];
  owner?: string;
}

/**
 * Link de conversa do WhatsApp. `wa.me` é o encurtador oficial: abre o app no
 * celular e o WhatsApp Web no desktop, sem depender de o número estar salvo.
 * O texto vem pré-preenchido só para o Marcelo saber de onde veio o contato.
 */
function whatsappHref(numero: string) {
  const texto = encodeURIComponent("Oi, Marcelo! Vim pelo seu portfólio.");
  return `https://wa.me/${numero}?text=${texto}`;
}

const canaisPadrao = (email: string): Channel[] => [
  {
    label: "LinkedIn",
    handle: "@marcelomourojr",
    href: "https://www.linkedin.com/in/marcelomourojr/",
    icon: <Linkedin strokeWidth={1.5} className="size-6" />,
  },
  {
    label: "GitHub",
    handle: "@marcelomourojr",
    href: "https://github.com/marcelomourojr",
    icon: <Github strokeWidth={1.5} className="size-6" />,
  },
  {
    label: "Instagram",
    handle: "@marcelomourojr",
    href: "https://www.instagram.com/marcelomourojr/",
    icon: <Instagram strokeWidth={1.5} className="size-6" />,
  },
  {
    label: "E-mail",
    handle: email,
    href: `mailto:${email}`,
    icon: <Mail strokeWidth={1.5} className="size-6" />,
  },
];

export function ContactSection({
  title = "Vamos Conversar",
  email = "contato@marcelomouro.com",
  whatsapp = "5514997000646",
  channels,
  owner = "Marcelo Mouro Jr",
}: ContactSectionProps) {
  const canais = channels ?? canaisPadrao(email);
  const reduceMotion = useReducedMotion();

  const reveal = (delay = 0) => ({
    initial: reduceMotion ? false : { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
    transition: {
      duration: 0.6,
      delay: reduceMotion ? 0 : delay,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  });

  return (
    <section id="contatos" className="px-6 pb-10 pt-24 sm:px-10 sm:pb-14 sm:pt-32">
      {/* Sem reveal no contêiner: cada elemento tem o próprio efeito, visível
          quando a seção chega — um contêiner invisível escondia o whisper. */}
      <header className="max-w-3xl">
        <h2 className="text-display font-semibold text-white">
          <WhisperText text={title} />
        </h2>
        <BlurFade delay={0.15}>
          <p className="mt-5 max-w-md text-corpo text-white/50">
            Conecte-se comigo através das minhas redes ou me chame no Whatsapp.
          </p>
        </BlurFade>
      </header>

      {/* Cards compactos, um por rede, entrando em cascata. O hover: a marca
          de canto rose acende e cresce — a assinatura do site como resposta. */}
      <ul className="mt-12 grid grid-cols-2 gap-3 border-t border-white/10 pt-10 sm:gap-4 md:grid-cols-4">
        {canais.map(({ label, handle, href, icon }, i) => (
          <li key={label}>
            <BlurFade delay={0.1 + i * 0.08} className="h-full">
            <a
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="group relative flex flex-col gap-6 overflow-hidden rounded-xl border border-white/10
                         bg-white/[0.02] p-5 transition-colors duration-300 hover:border-white/25 hover:bg-white/[0.05]
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 sm:p-6"
            >
              <span
                aria-hidden
                className="absolute left-4 top-4 size-2 border-l border-t border-white/15
                           transition-all duration-300 group-hover:size-3 group-hover:border-rose-500"
              />

              <span className="ml-auto text-white/50 transition-colors duration-300 group-hover:text-white">
                {icon}
              </span>

              <span className="flex items-end justify-between gap-3">
                <span className="min-w-0">
                  <span className="block text-corpo font-semibold tracking-[-0.02em] text-white">
                    {label}
                  </span>
                  <span className="mt-1 block truncate font-mono text-micro text-white/50 transition-colors group-hover:text-white/60">
                    {handle}
                  </span>
                </span>
                <ArrowUpRight
                  aria-hidden
                  className="mb-0.5 size-4 shrink-0 text-white/50 transition-all duration-300
                             group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-rose-500"
                />
              </span>
            </a>
            </BlurFade>
          </li>
        ))}
      </ul>

      {/* O CTA: aro de metal líquido, abrindo conversa no WhatsApp. Era um
          mailto:, que a Cloudflare reescrevia para /cdn-cgi/l/email-protection
          (404 sem JS) — o wa.me não sofre essa ofuscação. */}
      <motion.div {...reveal(0.16)} className="mt-14 flex justify-center">
        <LiquidMetalButton label="Fale comigo" href={whatsappHref(whatsapp)} width={224} height={58} />
      </motion.div>

      <footer className="mt-16 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-mono text-micro tracking-[0.06em] text-white/50">
          © {new Date().getFullYear()} {owner}
        </p>
        <a
          href="#inicio"
          className="font-mono text-micro tracking-[0.06em] text-white/50 transition-colors hover:text-white
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
        >
          Voltar ao topo ↑
        </a>
      </footer>
    </section>
  );
}
