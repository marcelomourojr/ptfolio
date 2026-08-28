"use client";

import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";
import { ZoomParallax } from "@/components/ui/zoom-parallax";
import { SiteHeader } from "@/components/ui/site-header";
import { Hero } from "@/components/ui/hero";
import { GridBackground } from "@/components/ui/grid-background";
import { AboutSection } from "@/components/ui/about-section";
import { ProjectBento, type BentoBand, type BentoItem } from "@/components/ui/project-bento";
import type { ProjectDetail } from "@/components/ui/project-modal";
import { Cursor, CursorProvider, CursorFollow } from "@/components/ui/cursor";

import { ContactSection } from "@/components/ui/contact-section";

const navLinks = [
  { label: "Início", href: "#inicio" },
  { label: "Sobre", href: "#sobre" },
  { label: "Projetos", href: "#projetos" },
  { label: "Contato", href: "#contatos" },
];

const contactLinks = [
  { label: "E-mail", href: "mailto:contato@marcelomouro.com" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/marcelomourojr/" },
  { label: "Instagram", href: "https://www.instagram.com/marcelomourojr/" },
  { label: "GitHub", href: "https://github.com/marcelomourojr" },
];

const heroMeta = [
  {
    label: "\u00A92026",
    body: "Product Designer UI/UX h\u00e1 mais de 5 anos. Interfaces que precisam funcionar fora do Figma.",
  },
  {
    label: "Produto",
    body: "Da pesquisa ao handoff: fluxo, prot\u00f3tipo, interface e a conversa dif\u00edcil sobre escopo.",
  },
  {
    label: "UI/UX",
    body: "Design claro, acess\u00edvel e r\u00e1pido. Menos efeito, mais decis\u00e3o.",
  },
];

// Imagens dos projetos para parallax
const projectImages = [
  {
    src: "/images/projeto-1.webp",
    alt: "Projeto 1",
  },
  {
    src: "/images/projeto-2---Primeiro-Portfolio.webp",
    alt: "Primeiro Portfolio",
  },
  {
    src: "/images/Home.webp",
    alt: "Verbo",
    title: "Verbo",
    category: "Mobile App",
  },
  {
    src: "/images/1on.webp",
    alt: "Onsite Seguros",
    title: "Onsite Seguros",
    category: "Website",
  },
  {
    src: "/images/Webchat-1.webp",
    alt: "KingChat",
    title: "KingChat",
    category: "Web App",
  },
  {
    src: "/images/Isaac1.webp",
    alt: "Isaac the Barber",
    title: "Isaac the Barber",
    category: "Website",
  },
  {
    src: "/images/ze1.webp",
    alt: "Zé dos Concursos",
    title: "Zé dos Concursos",
    category: "App Mobile & Website",
  },
];

// Timeline data - projetos detalhados
const timelineData: ProjectDetail[] = [
  {
    title: "Onsite Seguros",
    year: "2023",
    category: "Website",
    description: "Plataforma completa para gestão de seguros, com foco na experiência do usuário e otimização de fluxos de contratação.",
    images: [
      "/images/1on.webp",
      "/images/2on.webp",
      "/images/3on.webp"
    ],
    tags: ["Figma", "Framer"],
  },
  {
    title: "CupidLove",
    year: "2025",
    category: "Website",
    description: "Serviço de criação de sites personalizados como presentes digitais, transformando histórias, fotos e músicas em experiências interativas únicas para eternizar momentos especiais de forma criativa e emocional.",
    images: [
      "/images/1c.webp",
      "/images/2c.webp",
      "/images/3c.webp",
      "/images/4c.webp",
      "/images/5c.webp",
      "/images/6c.webp"
    ],
    tags: ["Figma", "Framer"],
    link: "https://cupidlove.com.br",
  },
  {
    title: "Verbo",
    year: "2025",
    category: "Mobile Design",
    description: "App com dinâmica estilo Duolingo, com trilhas, quizzes e progressão gamificada. Bíblia offline em vários idiomas, com navegação simples e intuitiva. Inclui áudio, marcações e busca inteligente para estudo diário. Conta com mais de 100 mil downloads e alto engajamento.",
    images: [
      "/images/Home.webp",
      "/images/Mensagens-do-dia.webp",
      "/images/Quiz.webp",
      "/images/Reflexão.webp",
      "/images/Versiculo.webp"
    ],
    tags: ["Figma"],
    appStoreLink: "https://apps.apple.com/br/app/verbo-li%C3%A7%C3%B5es-da-b%C3%ADblia/id6751657587",
    playStoreLink: "https://play.google.com/store/apps/details?id=com.ver.bo&hl=pt_BR",
  },
  {
    title: "Sintony",
    year: "2025",
    category: "Mobile App",
    description: "App de relacionamento com IA que gera matches por afinidade real, usando filtros inteligentes de idade, distância e interesses, com chat seguro focado em privacidade e controle, já ultrapassando 500 mil downloads.",
    images: [
      "/images/1sintonywebp.webp",
      "/images/2sintony.webp",
      "/images/3sintony.webp",
      "/images/4sintony.webp",
      "/images/5sintony.webp",
      "/images/6sintony.webp"
    ],
    tags: ["Figma", "UI/UX", "Mobile"],
    appStoreLink: "#",
    playStoreLink: "#",
  },
  {
    title: "KingChat",
    year: "2025",
    category: "Web App",
    description: "Plataforma de automação de conversas que utiliza chatbots e fluxos inteligentes para organizar, escalar e otimizar o atendimento, centralizando a comunicação e tornando as interações mais eficientes e estratégicas.",
    images: [
      "/images/Webchat-1.webp"
    ],
    tags: ["Figma", "Antigravity"],
    link: "https://kingchat.com/",
  },
  {
    title: "Zé dos Concursos",
    year: "2025",
    category: "App Mobile & Website",
    description: "Plataforma web e aplicativo mobile que centralizam informações de concursos públicos, com busca inteligente, notícias atualizadas e assistente com IA, facilitando o acesso a oportunidades e otimizando a jornada de quem está se preparando.",
    images: [
      "/images/ze1.webp",
      "/images/ze2.webp",
      "/images/ze3.webp",
      "/images/ze4.webp",
      "/images/ze5.webp",
      "/images/ze6.webp",
      "/images/ze7.webp",
      "/images/ze8.webp"
    ],
    tags: ["React Native", "Expo", "TypeScript"],
    link: "#",
    appStoreLink: "#",
    playStoreLink: "#",
  },
  {
    title: "Protech",
    year: "2026",
    category: "Website",
    description: "Serviço de criação de sites, páginas e sistemas com foco em conversão, unindo estratégia e design, com investimento acessível e modelo recorrente que garante manutenção contínua e suporte 24h, voltado a fortalecer a presença digital de negócios locais e sustentar seu crescimento.",
    images: [
      "/images/pt1.webp",
      "/images/pt2.webp",
      "/images/pt3.webp",
      "/images/pt4.webp",
      "/images/pt5.webp",
      "/images/pt6.webp",
      "/images/pt7.webp",
      "/images/pt8.webp"
    ],
    tags: ["Figma", "Antigravity"],
  },
  {
    title: "Isaac the Barber",
    year: "2026",
    category: "Website",
    description: "Site premium desenvolvido para barbearia com foco em fortalecer a presença digital local, otimizado para SEO e alta performance, valorizando os serviços e transmitindo uma identidade visual sofisticada que atrai e converte clientes.",
    images: [
      "/images/Isaac1.webp",
      "/images/Isaac2.webp",
      "/images/Isaac3.webp",
      "/images/Isaac4.webp",
      "/images/Isaac5.webp"
    ],
    tags: ["Figma", "Web Design", "UI/UX"],
    link: "https://isaacthebarber.com.br"
  },
];

// Capa e proporção EXATA de cada capa (medidas dos arquivos reais).
// A proporção é o que garante bloco sem recorte: retratos ficam retratos,
// paisagens ficam paisagens, e nada estica.
const bentoCovers: Record<string, { cover: string; aspect: string }> = {
  "Verbo":            { cover: "/images/Home.webp",         aspect: "738 / 1600" },
  "Sintony":          { cover: "/images/1sintonywebp.webp", aspect: "416 / 900" },
  "KingChat":         { cover: "/images/Webchat-1.webp",    aspect: "1600 / 1005" },
  "Onsite Seguros":   { cover: "/images/1on.webp",          aspect: "1600 / 1005" },
  "Zé dos Concursos": { cover: "/images/ze1.webp",          aspect: "1600 / 1005" },
  "Isaac the Barber": { cover: "/images/Isaac1.webp",       aspect: "1600 / 1005" },
  "Protech":          { cover: "/images/pt1.webp",          aspect: "1600 / 1005" },
  "CupidLove":        { cover: "/images/1c.webp",           aspect: "1600 / 1005" },
};

function bentoItem(titulo: string): BentoItem {
  const dados = timelineData.find((p) => p.title === titulo);
  if (!dados) throw new Error(`Projeto "${titulo}" não existe em timelineData`);
  const portrait = titulo === "Verbo" || titulo === "Sintony";
  return { ...dados, ...bentoCovers[titulo], portrait };
}

// Quatro faixas: retrato+paisagem espelhados nas pontas, pares no meio.
const bentoBands: BentoBand[] = [
  { layout: "portraitLeft",  items: [bentoItem("Verbo"), bentoItem("KingChat")] },
  { layout: "pair",          items: [bentoItem("Onsite Seguros"), bentoItem("Zé dos Concursos")] },
  { layout: "portraitRight", items: [bentoItem("Isaac the Barber"), bentoItem("Sintony")] },
  { layout: "pair",          items: [bentoItem("Protech"), bentoItem("CupidLove")] },
];

export default function Home() {
  // Smooth scroll with Lenis
  useEffect(() => {
    // Respeita quem pediu menos movimento no sistema: o scroll hijacking do
    // Lenis é o efeito mais desconfortável do site nesse caso.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis();

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <CursorProvider className="w-full" data-custom-cursor>
      {/* Sem mix-blend-mode: o `difference` fundia a seta com o que estivesse
          atrás dela — e como o brilho da grade é revelado exatamente sob o
          cursor, a grade atravessava a seta o tempo todo. O contraste sobre
          fundo claro, que era o motivo do blend, agora vem do contorno. */}
      <Cursor className="z-[9999] hidden md:block">
        <svg
          className="size-6"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 40 40"
        >
          <path
            d="M1.8 4.4 7 36.2c.3 1.8 2.6 2.3 3.6.8l3.9-5.7c1.7-2.5 4.5-4.1 7.5-4.3l6.9-.5c1.8-.1 2.5-2.4 1.1-3.5L5 2.5c-1.4-1.1-3.5 0-3.3 1.9Z"
            fill="#fff"
            stroke="#000"
            strokeWidth={3}
            strokeLinejoin="round"
            paintOrder="stroke"
          />
        </svg>
      </Cursor>
      <CursorFollow align="bottom-right" sideOffset={10} className="z-[9998] pointer-events-none hidden md:block">
        <div className="bg-white/10 border border-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-semibold tracking-[0.04em] shadow-xl">
          Você
        </div>
      </CursorFollow>
      <main className="cursor-none">
      <GridBackground />

      <SiteHeader
        wordmark="Marcelo Mouro"
        available="Disponível para projetos"
        links={navLinks}
        contact={contactLinks}
      />

      <Hero
        eyebrow="Product Designer · UI/UX"
        statement="Desenho produtos digitais que as pessoas entendem sem precisar de manual."
        wordmark="Marcelo Mouro"
        meta={heroMeta}
      />


      {/* About Section */}
      <AboutSection />


      {/* Projetos: cabeçalho à esquerda, sem gradiente em texto */}
      <section id="projetos" className="px-6 pt-24 sm:px-10 sm:pt-32">
        <header className="max-w-3xl">
          <p className="font-mono text-[11px] tracking-[0.08em] text-white/40">
            Trabalho selecionado
          </p>
          <h2 className="mt-5 text-[clamp(2rem,6vw,4.5rem)] font-semibold leading-[0.95] tracking-[-0.045em] text-white">
            Projetos
          </h2>
          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-white/50">
            Produtos que foram para a rua e continuam em uso. Role para ver de perto.
          </p>
        </header>
      </section>

      <ZoomParallax images={projectImages} />

      <ProjectBento bands={bentoBands} />


      <ContactSection />


    </main>
    </CursorProvider>
  );
}
