"use client";

import { motion } from "framer-motion";
import Image from "next/image";
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
          <div className="absolute left-[-10%] top-[30%] w-[30%] h-[30%] rounded-full bg-purple-500/15 blur-[130px]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-10">
          {/* Header with Badge */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16 md:mb-20"
          >
            <span className="inline-block mb-6 text-xs font-bold tracking-[0.3em] text-rose-400 uppercase">
              {subtitle}
            </span>
            <h2 className="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-rose-400 via-white to-rose-600 mb-8">
              {title}
            </h2>
          </motion.div>

          {/* Main Content - Centered Text Layout */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            {/* Highlighted Quote */}
            <p className="text-2xl md:text-4xl font-light text-white leading-relaxed mb-8">
              &ldquo;{highlightedText}&rdquo;
            </p>
            
            {/* Description */}
            <p className="text-base md:text-lg text-white/50 leading-relaxed font-light">
              {description}
            </p>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="grid grid-cols-3 gap-4 md:gap-8 max-w-2xl mx-auto mb-20"
          >
            {/* Stat 1 */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-rose-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:p-8 text-center hover:border-rose-500/30 transition-colors duration-300">
                <div className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-rose-400 to-white mb-2">
                  5+
                </div>
                <div className="text-xs md:text-sm text-white/40 uppercase tracking-widest">
                  Anos
                </div>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:p-8 text-center hover:border-purple-500/30 transition-colors duration-300">
                <div className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-white mb-2">
                  50+
                </div>
                <div className="text-xs md:text-sm text-white/40 uppercase tracking-widest">
                  Projetos
                </div>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-rose-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:p-8 text-center hover:border-blue-500/30 transition-colors duration-300">
                <div className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-white mb-2">
                  30+
                </div>
                <div className="text-xs md:text-sm text-white/40 uppercase tracking-widest">
                  Clientes
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tools Infinite Slider */}
        <div className="relative mt-8">
          {/* Fade edges */}
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />
          
          <InfiniteSlider gap={64} duration={25} durationOnHover={50}>
            {tools.map((tool, index) => (
              <div
                key={index}
                className="flex items-center group cursor-pointer"
              >
                <Image
                  src={tool.logo}
                  alt={tool.name}
                  width={40}
                  height={40}
                  className="h-10 w-auto opacity-50 group-hover:opacity-100 transition-opacity duration-300 object-contain"
                />
              </div>
            ))}
          </InfiniteSlider>
        </div>
      </section>
    </InfiniteGridBackground>
  );
}
