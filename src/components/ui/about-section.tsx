"use client";

import { motion } from "framer-motion";
import { InfiniteSlider } from "./infinite-slider";
import { InfiniteGridBackground } from "./infinite-grid";

// Tool logos - usando imagens personalizadas
const tools = [
  { name: "Figma", logo: "/images/Ferramenta Figma.webp" },
  { name: "Framer", logo: "/images/Ferramenta Framer.webp" },
  { name: "Claude Code", logo: "/images/Ferramenta Claude Code.webp" },
  { name: "ComfyUI", logo: "/images/Ferramenta ComfyUI.webp" },
  { name: "Lovable", logo: "/images/Ferramenta Lovable.webp" },
  { name: "Antigravity", logo: "/images/Antigravity Ferramenta.webp" },
];

interface AboutSectionProps {
  title?: string;
  subtitle?: string;
  description?: string;
  highlightedText?: string;
}

export function AboutSection({
  title = "Sobre Mim",
  subtitle = "UI/UX Designer",
  description = "Sou apaixonado por criar experiências digitais que encantam e resolvem problemas reais. Com anos de experiência em design de interfaces, transformo ideias em produtos digitais elegantes e funcionais.",
  highlightedText = "Criando experiências digitais memoráveis",
}: AboutSectionProps) {
  return (
    <InfiniteGridBackground
      className="min-h-screen bg-black py-24 md:py-32"
      gridSize={60}
      speedX={0.2}
      speedY={0.2}
      maskRadius={400}
      baseOpacity={0.04}
      highlightOpacity={0.2}
    >
      <section id="sobre" className="relative">
        {/* Decorative Blur Spheres */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute right-[-15%] top-[-10%] w-[40%] h-[40%] rounded-full bg-rose-500/20 blur-[150px]" />
          <div className="absolute right-[20%] top-[5%] w-[25%] h-[25%] rounded-full bg-purple-500/15 blur-[120px]" />
          <div className="absolute left-[-10%] bottom-[-15%] w-[35%] h-[35%] rounded-full bg-blue-500/15 blur-[130px]" />
        </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16 md:mb-24"
        >
          <span className="inline-block mb-4 text-xs font-bold tracking-[0.3em] text-rose-400 uppercase">
            {subtitle}
          </span>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-rose-400 via-white to-rose-600">
            {title}
          </h2>
        </motion.div>

        {/* Content */}
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center mb-20">
          {/* Left - Image/Avatar placeholder */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative w-full aspect-square max-w-md mx-auto">
              {/* Glow effect - black */}
              <div className="absolute inset-0 bg-black/60 rounded-3xl blur-2xl" />
              
              {/* Image - no circle */}
              <div className="relative h-full flex items-center justify-center">
                <div className="w-64 h-64 md:w-80 md:h-80 rounded-2xl overflow-hidden shadow-2xl shadow-black/50">
                  <img 
                    src="/images/Sobre mim.webp" 
                    alt="Marcelo Mouro Jr" 
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right - Text */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <p className="text-2xl md:text-3xl font-light text-white/90 leading-relaxed">
              {highlightedText}
            </p>
            
            <p className="text-base md:text-lg text-white/50 leading-relaxed font-light">
              {description}
            </p>

            {/* Stats or highlights */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white">5+</div>
                <div className="text-xs text-white/40 uppercase tracking-widest mt-1">Anos</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white">50+</div>
                <div className="text-xs text-white/40 uppercase tracking-widest mt-1">Projetos</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white">30+</div>
                <div className="text-xs text-white/40 uppercase tracking-widest mt-1">Clientes</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Tools Infinite Slider */}
      <div className="relative mt-12">
        {/* Fade edges */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />
        
        <InfiniteSlider gap={64} duration={25} durationOnHover={50}>
          {tools.map((tool, index) => (
            <div
              key={index}
              className="flex items-center group cursor-pointer"
            >
              <img 
                src={tool.logo} 
                alt={tool.name}
                className="h-10 w-auto opacity-50 group-hover:opacity-100 transition-opacity duration-300"
              />
            </div>
          ))}
        </InfiniteSlider>
      </div>
      </section>
    </InfiniteGridBackground>
  );
}
