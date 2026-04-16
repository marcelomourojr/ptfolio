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
import { ContactSection } from "@/components/ui/contact-section";
import { Home as HomeIcon, User, Briefcase, Share2 } from "lucide-react";

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
    link: "#redes",
    icon: <Share2 className="h-4 w-4" />,
  },
];

// Imagens dos projetos para parallax
const projectImages = [
  {
    src: "/images/projeto 1.webp",
    alt: "Projeto 1",
  },
  {
    src: "/images/projeto 2 - Primeiro Portfolio.webp",
    alt: "Primeiro Portfolio",
  },
  {
    src: "https://images.unsplash.com/photo-1559028012-481c04fa702d?w=800&h=800&fit=crop",
    alt: "UI Design",
    title: "Interface Design",
    category: "UI/UX",
  },
  {
    src: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=1280&h=720&fit=crop",
    alt: "Website",
    title: "Website Corporativo",
    category: "Web",
  },
  {
    src: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&h=800&fit=crop",
    alt: "Branding",
    title: "Identidade Visual",
    category: "Branding",
  },
  {
    src: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1280&h=720&fit=crop",
    alt: "Design System",
    title: "Design System",
    category: "UI/UX",
  },
  {
    src: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1280&h=720&fit=crop",
    alt: "Landing Page",
    title: "Landing Page",
    category: "Web",
  },
];

// Timeline data - projetos detalhados
const timelineData = [
  {
    title: "Onsite Seguros",
    year: "2024",
    category: "Web App",
    description: "Plataforma completa para gestão de seguros, com foco na experiência do usuário e otimização de fluxos de contratação.",
    images: [
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=400&fit=crop",
      "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&h=400&fit=crop"
    ],
    tags: ["Figma", "Framer"],
  },
  {
    title: "CupidLove",
    year: "2024",
    category: "Web App",
    description: "Aplicativo de relacionamentos focado em conexões significativas, com interface moderna e interativa.",
    images: [
      "/images/projeto 1.webp",
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=400&fit=crop",
      "https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&h=400&fit=crop"
    ],
    tags: ["Figma", "Framer"],
    link: "https://cupidlove.com.br",
  },
  {
    title: "Verbo",
    year: "2023",
    category: "Mobile Design",
    description: "Design de interface minimalista e intuitiva para aplicativo de leitura e estudos bíblicos, focado na experiência de leitura imersiva.",
    images: [
      "/images/Home.webp",
      "/images/Mensagens do dia.webp",
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
    year: "2023",
    category: "Mobile App",
    description: "Conexões por proximidade: Dê match com pessoas por perto e viva novas conexões.",
    images: [
      "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=800&h=400&fit=crop",
      "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?w=800&h=400&fit=crop"
    ],
    tags: ["Figma", "UI/UX", "Mobile"],
    appStoreLink: "#",
    playStoreLink: "#",
  },
  {
    title: "Webchat",
    year: "2023",
    category: "Web App",
    description: "Aplicação de chat em tempo real com interface moderna, focada em comunicação fluida e expressiva.",
    images: [
      "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=400&fit=crop",
      "https://images.unsplash.com/photo-1572061486716-e5229fc9fdb1?w=800&h=400&fit=crop"
    ],
    tags: ["Figma", "Antigravity"],
  },
  {
    title: "Zé dos Concursos",
    year: "2024",
    category: "Mobile App",
    description: "Aplicativo completo para preparação de concursos, com banco de questões e estatísticas de desempenho.",
    images: [
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=400&fit=crop",
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop"
    ],
    tags: ["React Native", "Expo", "TypeScript"],
  },
  {
    title: "Protech",
    year: "2024",
    category: "Web App",
    description: "Solução tecnológica inovadora com design futurista e foco em automação de processos.",
    images: [
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=400&fit=crop",
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=400&fit=crop"
    ],
    tags: ["Figma", "Antigravity"],
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
        ctaText="Entre em Contato" 
        ctaLink="#contato" 
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
            Meus Projetos
          </h2>
          <p className="mt-6 text-base md:text-lg text-white/50 max-w-2xl mx-auto font-light px-6">
            Role para explorar meus trabalhos em UI/UX Design
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
          title="Minha Jornada"
          subtitle="Uma linha do tempo dos projetos que marcaram minha carreira"
          data={timelineData}
        />
      </div>

      {/* Transition: Timeline → Contact */}
      <div className="relative h-24 bg-gradient-to-b from-black to-transparent -mb-24 z-10" />

      {/* Social Links Bento Section */}
      <SocialBento />

      {/* Transition: Social → Contact */}
      <div className="relative h-24 bg-gradient-to-b from-black to-transparent -mb-24 z-10" />

      {/* Contact Section */}
      <ContactSection 
        title="Vamos conversar sobre seu projeto?"
        subtitle="Um clique é suficiente para começarmos. Clique no botão abaixo e vamos fazer acontecer."
        buttonText="Entrar em Contato"
        email="contato@marcelomouro.com"
      />
    </main>
    </CursorProvider>
  );
}
