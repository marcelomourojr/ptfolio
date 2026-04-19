"use client";

import React, { useRef } from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { ArrowUpRight, Github, Instagram, Linkedin, Mail } from "lucide-react";
import { ShinyButton } from "./shiny-button";
import Image from "next/image";

interface SocialItem {
  name: string;
  handle: string;
  icon: React.ReactNode;
  link: string;
}

const SpotlightCard = ({ social, index }: { social: SocialItem, index: number }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({
    currentTarget,
    clientX,
    clientY,
  }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <a
      href={social.link}
      target="_blank"
      rel="noopener noreferrer"
      onMouseMove={handleMouseMove}
      className={`group relative flex flex-col items-center justify-center p-12 bg-black hover:bg-white/[0.03] transition-colors duration-500 border-white/10 overflow-hidden
        ${index === 1 ? "border-t md:border-t-0 md:border-l lg:border-l" : ""}
        ${index === 2 ? "border-t md:border-t lg:border-t-0 lg:border-l" : ""}
        ${index === 3 ? "border-t md:border-t md:border-l lg:border-t-0 lg:border-l" : ""}
      `}
    >
      {/* Elemento de iluminação Spotlight invisível por padrão */}
      <motion.div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100 z-0"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              400px circle at ${mouseX}px ${mouseY}px,
              rgba(244, 63, 94, 0.15),
              transparent 80%
            )
          `,
        }}
      />

      {/* Conteúdo do Card original inalterado (apensas adicionando z-10 mantendo propriedades originais) */}
      
      {/* Arrow icon top right */}
      <div className="absolute top-6 right-6 text-white/20 group-hover:text-white transition-colors duration-500 z-10 w-fit">
        <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-500" />
      </div>

      {/* Main Icon */}
      <div className="text-white/40 group-hover:text-rose-400 transition-colors duration-500 mb-6 group-hover:scale-110 transform z-10 relative">
        {social.icon}
      </div>

      {/* Text details */}
      <h3 className="text-white font-medium text-lg mb-1 z-10 relative">{social.name}</h3>
      <span className="text-white/40 text-sm font-light group-hover:text-white/70 transition-colors duration-500 z-10 relative">
        {social.handle}
      </span>
    </a>
  );
};

export const SocialBento = () => {
  const socials: SocialItem[] = [
    {
      name: "LinkedIn",
      handle: "@marcelomourojr",
      icon: <Linkedin strokeWidth={1.5} className="w-8 h-8" />,
      link: "https://www.linkedin.com/in/marcelomourojr/",
    },
    {
      name: "GitHub",
      handle: "@marcelomourojr",
      icon: <Github strokeWidth={1.5} className="w-8 h-8" />,
      link: "https://github.com/marcelomourojr",
    },
    {
      name: "Instagram",
      handle: "@marcelomourojr",
      icon: <Instagram strokeWidth={1.5} className="w-8 h-8" />,
      link: "https://www.instagram.com/marcelomourojr/",
    },
    {
      name: "E-mail",
      handle: "contato@marcelomouro.com",
      icon: <Mail strokeWidth={1.5} className="w-8 h-8" />,
      link: "mailto:contato@marcelomouro.com",
    },
  ];

  return (
    <section id="contatos" className="relative w-full bg-black flex flex-col items-center justify-center overflow-hidden pt-24 pb-8">
      {/* Animation Styles */}
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 60s linear infinite;
        }
        @keyframes spin-slow-reverse {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        .animate-spin-slow-reverse {
          animation: spin-slow-reverse 60s linear infinite;
        }
      `}</style>

      {/* Background Decorative Layer */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{
          perspective: "1200px",
          transform: "perspective(1200px) rotateX(15deg)",
          transformOrigin: "center bottom",
          opacity: 1,
        }}
      >
        <div className="absolute inset-0 animate-spin-slow">
          <div
            className="absolute top-1/2 left-1/2"
            style={{ width: "2000px", height: "2000px", transform: "translate(-50%, -50%) rotate(279.05deg)", zIndex: 0 }}
          >
            <Image src="https://framerusercontent.com/images/oqZEqzDEgSLygmUDuZAYNh2XQ9U.png?scale-down-to=2048" alt="" fill className="object-cover opacity-50" />
          </div>
        </div>
        <div className="absolute inset-0 animate-spin-slow-reverse">
          <div
            className="absolute top-1/2 left-1/2"
            style={{ width: "1000px", height: "1000px", transform: "translate(-50%, -50%) rotate(304.42deg)", zIndex: 1 }}
          >
            <Image src="https://framerusercontent.com/images/UbucGYsHDAUHfaGZNjwyCzViw8.png?scale-down-to=1024" alt="" fill className="object-cover opacity-60" />
          </div>
        </div>
        <div className="absolute inset-0 animate-spin-slow">
          <div
            className="absolute top-1/2 left-1/2"
            style={{ width: "800px", height: "800px", transform: "translate(-50%, -50%) rotate(48.33deg)", zIndex: 2 }}
          >
            <Image src="https://framerusercontent.com/images/Ans5PAxtJfg3CwxlrPMSshx2Pqc.png" alt="" fill className="object-cover opacity-80" />
          </div>
        </div>
      </div>

      {/* Gradient Overlay */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: "linear-gradient(to top, rgba(0,0,0,1) 5%, rgba(0,0,0,0.9) 30%, rgba(0,0,0,0.7) 60%, rgba(0,0,0,0.5) 100%)",
        }}
      />

      {/* Content Container */}
      <div className="relative z-20 w-full flex flex-col items-center justify-center gap-8 px-6">
        <div className="w-full max-w-7xl px-4 md:px-8 mb-6 text-center">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-rose-400 via-white to-rose-600 mb-4 drop-shadow-[0_0_30px_rgba(0,0,0,0.8)]">
            Vamos Conversar
          </h2>
          <p className="text-base md:text-lg text-white/50 text-center max-w-xl mx-auto font-light">
            Conecte-se comigo através das minhas redes ou me chame no Whatsapp.
          </p>
        </div>

        <div className="w-full max-w-7xl mx-auto border border-white/10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 bg-black/40 backdrop-blur-sm rounded-3xl overflow-hidden mb-8">
          {socials.map((social, index) => (
            <SpotlightCard key={social.name} social={social} index={index} />
          ))}
        </div>

        {/* Shiny Button */}
        <div>
          <ShinyButton href="mailto:contato@marcelomouro.com">
            Fale Comigo
          </ShinyButton>
        </div>

        {/* Footer text */}
        <p className="text-white/30 text-sm mt-12 w-full text-center">
          © {new Date().getFullYear()} Marcelo Mouro Jr. Todos os direitos reservados.
        </p>
      </div>
    </section>
  );
};

export default SocialBento;
