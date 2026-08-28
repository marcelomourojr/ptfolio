"use client";

import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Github, Instagram, Linkedin, Mail } from "lucide-react";

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
  eyebrow?: string;
  title?: string;
  email?: string;
  channels?: Channel[];
  owner?: string;
}

const defaultChannels: Channel[] = [
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
    handle: "contato@marcelomouro.com",
    href: "mailto:contato@marcelomouro.com",
    icon: <Mail strokeWidth={1.5} className="size-6" />,
  },
];

export function ContactSection({
  eyebrow = "Contato",
  title = "Vamos conversar",
  email = "contato@marcelomouro.com",
  channels = defaultChannels,
  owner = "Marcelo Mouro Jr",
}: ContactSectionProps) {
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
      <motion.header {...reveal()} className="max-w-3xl">
        <p className="font-mono text-[11px] tracking-[0.08em] text-white/40">
          {eyebrow}
        </p>
        <h2 className="mt-5 text-[clamp(2rem,6vw,4.5rem)] font-semibold leading-[0.95] tracking-[-0.045em] text-white">
          {title}
        </h2>
        <p className="mt-5 max-w-md text-[15px] leading-relaxed text-white/50">
          Conecte-se comigo pelas redes ou me chame direto no e-mail.
        </p>
      </motion.header>

      {/* Cards compactos, um por rede. O efeito: a marca de canto rose acende
          e cresce no hover — a assinatura do site virando resposta ao toque. */}
      <motion.ul
        {...reveal(0.08)}
        className="mt-12 grid grid-cols-2 gap-3 border-t border-white/10 pt-10 sm:gap-4 md:grid-cols-4"
      >
        {channels.map(({ label, handle, href, icon }) => (
          <li key={label}>
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

              <span className="ml-auto text-white/35 transition-colors duration-300 group-hover:text-white">
                {icon}
              </span>

              <span className="flex items-end justify-between gap-3">
                <span className="min-w-0">
                  <span className="block text-[15px] font-semibold tracking-[-0.02em] text-white">
                    {label}
                  </span>
                  <span className="mt-1 block truncate font-mono text-[11px] text-white/35 transition-colors group-hover:text-white/60">
                    {handle}
                  </span>
                </span>
                <ArrowUpRight
                  aria-hidden
                  className="mb-0.5 size-4 shrink-0 text-white/25 transition-all duration-300
                             group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-rose-500"
                />
              </span>
            </a>
          </li>
        ))}
      </motion.ul>

      {/* O CTA: aro de metal líquido, link real para o e-mail */}
      <motion.div {...reveal(0.16)} className="mt-14 flex justify-center">
        <LiquidMetalButton label="Fale comigo" href={`mailto:${email}`} width={224} height={58} />
      </motion.div>

      <footer className="mt-16 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-mono text-[10px] tracking-[0.06em] text-white/25">
          © {new Date().getFullYear()} {owner}
        </p>
        <a
          href="#inicio"
          className="font-mono text-[10px] tracking-[0.06em] text-white/40 transition-colors hover:text-white
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
        >
          Voltar ao topo ↑
        </a>
      </footer>
    </section>
  );
}
