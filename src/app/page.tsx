"use client";

import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";
import { TubesCursor } from "@/components/ui/tube-cursor";
import { ZoomParallax } from "@/components/ui/zoom-parallax";
import { FloatingNav } from "@/components/ui/floating-navbar";
import { AboutSection } from "@/components/ui/about-section";
import { ProjectTimeline } from "@/components/ui/project-timeline";
import { Cursor, CursorProvider, CursorFollow } from "@/components/ui/cursor";

import { SocialLinks } from "@/components/ui/social-links";
import { SocialBento } from "@/components/ui/social-bento";

import { Home as HomeIcon, User, Briefcase, Users } from "lucide-react";

// Menu items
const navItems = [
  {
    name: "Início",
    link: "#inicio",
    icon: <HomeIcon className="h-4 w-4" />,
  },
  {
    name: "Sobre Mim",
    link: "#sobre",
    icon: <User className="h-4 w-4" />,
  },
  {
    name: "Projetos",
    link: "#projetos",
    icon: <Briefcase className="h-4 w-4" />,
  },
  {
    name: "Redes",
    link: "#contatos",
    icon: <Users className="h-4 w-4" />,
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
const timelineData = [
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
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=400&fit=crop",
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=400&fit=crop"
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

export default function Home() {
  // Smooth scroll with Lenis
  useEffect(() => {
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
    <CursorProvider className="w-full">
      <Cursor className="z-[9999] mix-blend-difference hidden md:block">
        <svg
          className="size-6 text-white"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 40 40"
        >
          <path
            fill="currentColor"
            d="M1.8 4.4 7 36.2c.3 1.8 2.6 2.3 3.6.8l3.9-5.7c1.7-2.5 4.5-4.1 7.5-4.3l6.9-.5c1.8-.1 2.5-2.4 1.1-3.5L5 2.5c-1.4-1.1-3.5 0-3.3 1.9Z"
          />
        </svg>
      </Cursor>
      <CursorFollow align="bottom-right" sideOffset={10} className="z-[9998] pointer-events-none hidden md:block">
        <div className="bg-white/10 border border-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-widest shadow-xl">
          Você
        </div>
      </CursorFollow>
      <main className="bg-black cursor-none">
      {/* Floating Navigation */}
      <FloatingNav 
        navItems={navItems} 
        ctaText="Vamos Conversar" 
        ctaLink="#contatos" 
      />

      {/* Social Links - Fixed on left side */}
      <SocialLinks
        links={[
          { platform: "linkedin", href: "https://www.linkedin.com/in/marcelomourojr/" },
          { platform: "github", href: "https://github.com/marcelomourojr" },
          { platform: "instagram", href: "https://www.instagram.com/marcelomourojr/" },
          { platform: "mail", href: "mailto:contato@marcelomouro.com" },
        ]}
        floatingButtonColor="bg-gradient-to-r from-rose-500 to-purple-600"
      />

      {/* Hero Section */}
      <section id="inicio" className="relative">
        <TubesCursor
          title="Marcelo Mouro Jr"
          subtitle="UI/UX"
          caption="Clique para mudar as cores"
          initialColors={["#9333ea", "#06b6d4", "#ec4899"]}
          lightColors={["#8b5cf6", "#22d3ee", "#f472b6", "#a855f7"]}
          lightIntensity={250}
          titleSize="text-[48px] md:text-[70px] lg:text-[90px]"
          subtitleSize="text-[32px] md:text-[50px] lg:text-[60px]"
          captionSize="text-sm md:text-lg"
          enableRandomizeOnClick
        />
      </section>

      {/* Transition: Hero → About */}
      <div className="h-24 bg-gradient-to-b from-black via-black to-transparent -mb-24 relative z-10" />

      {/* About Section */}
      <AboutSection />

      {/* Transition: About → Projects Header */}
      <div className="h-32 bg-gradient-to-b from-black to-transparent -mb-32 relative z-10" />

      {/* Projects Section Header */}
      <section id="projetos" className="relative flex h-[50vh] items-center justify-center bg-black">
        <div className="text-center">

          <h2 className="text-4xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-rose-400 via-white to-rose-600">
            Principais Projetos
          </h2>
          <p className="mt-6 text-base md:text-lg text-white/50 max-w-2xl mx-auto font-light px-6">
            Role para explorar alguns dos meus trabalhos
          </p>
        </div>
      </section>

      {/* Transition: Projects Header → Parallax */}
      <div className="h-20 bg-gradient-to-b from-black to-transparent -mb-20 relative z-10" />

      {/* Zoom Parallax Projects */}
      <ZoomParallax images={projectImages} />

      {/* Transition: Parallax → Timeline */}
      <div className="h-32 bg-gradient-to-b from-black to-transparent -mb-32 relative z-10" />

      {/* Transition: Parallax → Timeline */}
      <div className="relative h-32 bg-gradient-to-b from-black via-black to-transparent -mb-32 z-10" />

      {/* Project Timeline */}
      <div className="bg-black relative overflow-hidden">
        <ProjectTimeline
          title=""
          subtitle=""
          data={timelineData}
        />
      </div>

      {/* Transition: Timeline → Contact */}
      <div className="relative h-24 bg-gradient-to-b from-black to-transparent -mb-24 z-10" />

      {/* Social Links Bento Section */}
      <SocialBento />


    </main>
    </CursorProvider>
  );
}
