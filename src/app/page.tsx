"use client";

import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";
import { ZoomParallax } from "@/components/ui/zoom-parallax";
import { NotchHeader } from "@/components/ui/notch-header";
import { Hero } from "@/components/ui/hero";
import { VelocityText } from "@/components/ui/velocity-text";
import { WhisperText } from "@/components/ui/whisper-text";
import { BlurFade } from "@/components/ui/blur-fade";
import { GridBackground } from "@/components/ui/grid-background";
import { AboutSection } from "@/components/ui/about-section";
import { ProjectBento, type BentoBand, type BentoItem } from "@/components/ui/project-bento";
import { CreativesSection } from "@/components/ui/creatives-section";
import { CertificatesSection, type Certificate } from "@/components/ui/certificates-section";
import type { Creative } from "@/components/ui/creative-stack";
import { acharPorTitulo } from "@/lib/projects-data";
import { Cursor, CursorProvider, CursorFollow } from "@/components/ui/cursor";

import { ContactSection, SiteFooter } from "@/components/ui/contact-section";

const navLinks = [
  { label: "Início", href: "#inicio" },
  { label: "Sobre", href: "#sobre" },
  { label: "Projetos", href: "#projetos" },
  { label: "Criativos", href: "#criativos" },
  { label: "Contato", href: "#contatos" },
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
  const dados = acharPorTitulo(titulo);
  return { ...dados, ...bentoCovers[titulo] };
}

// Criativos em vídeo feitos com IA (Verbo). `slug` aponta para os arquivos
// em /public/videos: slug.webm (VP9) + slug.mp4 (fallback) + slug.webp (poster).
const creativesData: Creative[] = [
  { slug: "verbo-ugc4",     title: "UGC 4",  meta: "tour completa · narração" },
  { slug: "verbo-ugc5",     title: "UGC 5",  meta: "tour completa · narração" },
  { slug: "verbo-ugc6",     title: "UGC 6",  meta: "tour completa · narração" },
  { slug: "verbo-ugc2",     title: "UGC 2",  meta: "tour do app" },
  { slug: "verbo-espanto1", title: "Espanto", meta: "menu · quiz" },
  { slug: "verbo-gancho1",  title: "Gancho",  meta: "pastor · depoimento" },
];

// Quatro faixas: retrato+paisagem espelhados nas pontas, pares no meio.
// Três por linha no desktop. Os dois retratos ficam em faixas diferentes: dois
// retratos na mesma linha empurrariam a altura para 528px, e sozinhos numa
// linha, para 1440px — a proporção manda na altura, então retrato precisa de
// paisagem ao lado para a faixa não crescer.
const bentoBands: BentoBand[] = [
  { items: [bentoItem("Verbo"), bentoItem("KingChat"), bentoItem("Onsite Seguros")] },
  { items: [bentoItem("Zé dos Concursos"), bentoItem("Sintony"), bentoItem("Isaac the Barber")] },
  { items: [bentoItem("Protech"), bentoItem("CupidLove")] },
];

// Certificados, do mais recente para o mais antigo.
//
// Google e USP apontam para a página pública de verificação da Coursera —
// abre sem login e mostra o nome do aluno (testado: HTTP 200).
//
// FIAP e The Cloud Bootcamp abrem o próprio certificado (webp local): a
// validação da FIAP é formulário AJAX sem link direto, então a chave continua
// no card ao lado da data para quem quiser validar em
// on.fiap.com.br/local/nanocourses/validar-certificado. Coursera e LinkedIn
// Learning são páginas públicas de verificação; Imagenation é PDF no Drive.

const certificatesData: Certificate[] = [
  {
    title: "MultiCloud, DevOps & IA",
    issuer: "The Cloud Bootcamp",
    date: "Emitida em jan de 2025",
    logo: "/images/certificados/tcb.svg",
    // O badge "Eu sou um VIP Challenger" do challenge — não há página de
    // credencial; abre em lightbox.
    image: "/images/certificados/the-cloud-bootcamp-badge.webp",
  },
  {
    title: "User Experience",
    issuer: "FIAP",
    date: "Emitida em dez de 2024",
    logo: "/images/certificados/fiap.svg",
    credentialId: "87fb913f0d45a0df274d44e8f6993da3",
    // Certificado em lightbox; a validação da FIAP é formulário AJAX, então
    // vira o link "Validar no site do emissor" no rodapé, com a chave ao lado.
    image: "/images/certificados/fiap-user-experience.webp",
    url: "https://on.fiap.com.br/local/nanocourses/validar-certificado",
  },
  {
    title: "Workshop do Figma ao Framer",
    issuer: "Imagenation.art",
    date: "Emitida em nov de 2024",
    logo: "/images/certificados/imagenation.webp",
    url: "https://drive.google.com/file/d/1nhB1R4U6ZmtKYG4NoOGw7Uebtr1sQKyO/view",
  },
  {
    title: "Create High-Fidelity Designs and Prototypes in Figma",
    issuer: "Google",
    date: "Emitida em nov de 2024",
    logo: "/images/certificados/google.svg",
    credentialId: "L949901N4JCZ",
    url: "https://www.coursera.org/account/accomplishments/verify/L949901N4JCZ",
  },
  {
    title: "Fundamentos para Desenvolvimento de Software",
    issuer: "Microsoft",
    date: "Emitida em out de 2024",
    logo: "/images/certificados/microsoft.svg",
    url: "https://www.linkedin.com/learning/certificates/21b9b19c51c9a7bb4336643ba7c78335c4c9b6479937c9c4f18fbce30da4f407",
  },
  {
    title: "Marketing Digital",
    issuer: "Universidade de São Paulo",
    date: "Emitida em ago de 2024",
    logo: "/images/certificados/usp.png",
    credentialId: "DX2IHW7X6YJ8",
    url: "https://www.coursera.org/account/accomplishments/verify/DX2IHW7X6YJ8",
  },
];

export default function Home() {
  // Smooth scroll with Lenis
  useEffect(() => {
    // Respeita quem pediu menos movimento no sistema: o scroll hijacking do
    // Lenis é o efeito mais desconfortável do site nesse caso.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // O padrão do Lenis é lerp 0.1: a cada quadro a página anda só 10% do que
    // falta, então uma rolada leva ~44 quadros (cerca de 700ms) para assentar.
    // É isso que dá a sensação de rolagem arrastada, sempre atrás do gesto.
    // Com 0.16 ela assenta em ~26 quadros (~430ms): continua suave, mas
    // acompanha quem está rolando.
    //
    // O toque fica NATIVO de propósito (syncTouch padrão é false): no celular
    // a rolagem do sistema é melhor que qualquer interpolação, e sincronizar
    // as duas costuma criar atraso e brigar com o gesto do dedo.
    const lenis = new Lenis({ lerp: 0.16 });
    // A navbar usa o Lenis para rolar suave até as âncoras
    (window as { __lenis?: Lenis }).__lenis = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      delete (window as { __lenis?: Lenis }).__lenis;
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
        <div className="bg-white/10 border border-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-micro font-semibold tracking-[0.04em] shadow-xl">
          Você
        </div>
      </CursorFollow>
      {/* Navbar em notch: menu com scrollspy no centro (desktop); ilha única
          com gaveta no mobile. Sem wordmark — o nome domina o hero.
          Fica FORA do <main>: é navegação do site, não conteúdo. Como é
          position: fixed, mudar de lugar no DOM não mexe em nada na tela. */}
      <NotchHeader links={navLinks} />

      <main className="cursor-none">
      <GridBackground />

      <Hero
        eyebrow="Product Designer · UI/UX"
        statement="Desenho produtos digitais que as pessoas entendem sem precisar de manual."
        wordmark="Marcelo Mouro"
        meta={heroMeta}
      />


      {/* Frase em parallax horizontal: tela cheia, presa até a última letra
          da última palavra terminar de passar. */}
      <VelocityText phrase="Design com lógica, movimento com propósito — do primeiro rabisco ao produto no ar." />


      {/* About Section */}
      <AboutSection />


      {/* Projetos: cabeçalho à esquerda, sem gradiente em texto */}
      <section id="projetos" className="px-6 pt-24 sm:px-10 sm:pt-32">
        <header className="max-w-3xl">
          <h2 className="text-display font-semibold text-white">
            <WhisperText text="Projetos" />
          </h2>
          <BlurFade delay={0.15}>
            <p className="mt-5 max-w-md text-corpo text-white/50">
              Produtos que foram para a rua e continuam em uso. Role para ver de perto.
            </p>
          </BlurFade>
        </header>
      </section>

      <ZoomParallax images={projectImages} />

      <ProjectBento bands={bentoBands} />


      {/* Criativos: galeria 3D de vídeos + pilha vertical */}
      <CreativesSection items={creativesData} />


      <CertificatesSection items={certificatesData} />


      <ContactSection />
    </main>

    <SiteFooter />
    </CursorProvider>
  );
}
