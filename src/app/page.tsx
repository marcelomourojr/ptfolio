"use client";

import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";
import { TubesCursor } from "@/components/ui/tube-cursor";
import { ZoomParallax } from "@/components/ui/zoom-parallax";
import { FloatingNav } from "@/components/ui/floating-navbar";
import { AboutSection } from "@/components/ui/about-section";
import { ProjectTimeline } from "@/components/ui/project-timeline";
import { NeuralNoise } from "@/components/ui/neural-noise";
import { CursorProvider, Cursor, CursorFollow } from "@/components/ui/cursor";
import { SocialLinks } from "@/components/ui/social-links";
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
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=400&fit=crop",
    tags: ["Figma", "Framer"],
  },
  {
    title: "CupidLove",
    year: "2024",
    category: "Web App",
    description: "Aplicativo de relacionamentos focado em conexões significativas, com interface moderna e interativa.",
    image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&h=400&fit=crop",
    tags: ["Figma", "Framer"],
  },
  {
    title: "Verbo",
    year: "2023",
    category: "Mobile Design",
    description: "Design de interface minimalista e intuitiva para aplicativo de leitura e estudos bíblicos, focado na experiência de leitura imersiva.",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&h=400&fit=crop",
    tags: ["Figma"],
  },
  {
    title: "Sintony",
    year: "2023",
    category: "App Design",
    description: "Plataforma de streaming de música com interface imersiva e personalizada, priorizando a descoberta de novos artistas.",
    image: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=800&h=400&fit=crop",
    tags: ["Figma"],
  },
  {
    title: "Webchat",
    year: "2023",
    category: "Web App",
    description: "Aplicação de chat em tempo real com interface moderna, focada em comunicação fluida e expressiva.",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=400&fit=crop",
    tags: ["Figma", "Antigravity"],
  },
  {
    title: "Zé dos Concursos",
    year: "2024",
    category: "Mobile App",
    description: "Aplicativo completo para preparação de concursos, com banco de questões e estatísticas de desempenho.",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=400&fit=crop",
    tags: ["React Native", "Expo", "TypeScript"],
  },
  {
    title: "Protech",
    year: "2024",
    category: "Web App",
    description: "Solução tecnológica inovadora com design futurista e foco em automação de processos.",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=400&fit=crop",
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
    <main className="bg-black">
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
          <span className="inline-block mb-4 text-xs font-bold tracking-[0.3em] text-rose-400 uppercase">
            Portfolio
          </span>
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

      {/* Project Timeline with Neural Noise Background and Custom Cursor */}
      <div className="bg-black">
        <NeuralNoise 
          className="relative overflow-hidden"
          opacity={0.8}
          pointerStrength={1.5}
          timeScale={0.6}
        >
          {/* Top fade overlay */}
          <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-black to-transparent z-20 pointer-events-none" />
        
        <CursorProvider className="w-full">
          <Cursor>
            <svg
              className="size-6 text-rose-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 40 40"
            >
              <path
                fill="currentColor"
                d="M1.8 4.4 7 36.2c.3 1.8 2.6 2.3 3.6.8l3.9-5.7c1.7-2.5 4.5-4.1 7.5-4.3l6.9-.5c1.8-.1 2.5-2.4 1.1-3.5L5 2.5c-1.4-1.1-3.5 0-3.3 1.9Z"
              />
            </svg>
          </Cursor>
          <CursorFollow align="bottom-right" sideOffset={20}>
            <div className="bg-gradient-to-r from-rose-500 to-purple-600 text-white px-3 py-1.5 rounded-full text-sm font-medium shadow-lg shadow-rose-500/30">
              Você
            </div>
          </CursorFollow>
          <ProjectTimeline
            title="Minha Jornada"
            subtitle="Uma linha do tempo dos projetos que marcaram minha carreira"
            data={timelineData}
          />
        </CursorProvider>

        {/* Bottom fade overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black to-transparent z-20 pointer-events-none" />
      </NeuralNoise>
      </div>

      {/* Transition: Timeline → Contact */}
      <div className="relative h-24 bg-gradient-to-b from-black to-transparent -mb-24 z-10" />

      {/* Contact Section */}
      <ContactSection 
        title="Vamos conversar sobre seu projeto?"
        subtitle="Um clique é suficiente para começarmos. Clique no botão abaixo e vamos fazer acontecer."
        buttonText="Entrar em Contato"
        email="contato@marcelomouro.com"
      />
    </main>
  );
}
