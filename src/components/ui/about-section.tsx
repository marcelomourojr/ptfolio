"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { InfiniteGridBackground } from "./infinite-grid";

interface AboutSectionProps {
  title?: string;
  subtitle?: string;
  description?: React.ReactNode | string;
  highlightedText?: string;
}

export function AboutSection({
  title = "Sobre Mim",
  subtitle = "UI/UX Designer",
  description = (
    <div className="space-y-4">
      <p>
        Product Designer UI/UX com mais de 5 anos de experiência em testes de software, desenvolvimento de produtos digitais, atuação como analista administrativo e criação de interfaces centradas no usuário, atuando de ponta a ponta com foco em usabilidade, organização, qualidade e resultado.
      </p>
      <p>
        Possuo forte base lógica e analítica, integrando IA, automação e dados à experiência do usuário. Experiência com ferramentas como Figma, Framer, Google AI Studio, Google Labs, ComfyUI, Kling, Sora 2, Wan 2.2 Animate, entre outras, aplicadas na construção de produtos digitais de alto impacto.
      </p>
    </div>
  ),
  highlightedText = "Criando experiências digitais que unem estratégia, tecnologia e performance.",
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


        <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-10">
          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
            
            {/* Left Column - Image */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="w-full md:w-5/12 flex-shrink-0"
            >
              <div className="relative aspect-[4/5] w-full max-w-md mx-auto md:max-w-none overflow-hidden rounded-[2.5rem] border border-white/10 shadow-2xl group">
                <Image
                  src="/images/eu2.webp"
                  alt="Marcelo Mouro Jr"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover bg-zinc-900 md:grayscale group-hover:grayscale-0 transition-all duration-700 ease-in-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
              </div>
            </motion.div>

            {/* Right Column - Content */}
            <div className="w-full md:w-7/12 flex flex-col md:text-left text-center">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="mb-8"
              >
                <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-rose-400 via-white to-rose-600">
                  {title}
                </h2>
              </motion.div>

              {/* Main Content */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                viewport={{ once: true }}
                className="mb-12"
              >
                {/* Highlighted Quote */}
                <p className="text-2xl md:text-3xl font-light text-white leading-relaxed mb-6">
                  {highlightedText}
                </p>
                
                {/* Description */}
                <div className="text-base md:text-lg text-white/50 leading-relaxed font-light">
                  {description}
                </div>
              </motion.div>

              {/* Stats Cards */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
                className="grid grid-cols-3 gap-3 md:gap-6 mb-10 w-full"
              >
                {/* Stat 1 */}
                <div className="group relative">
                  <div className="relative h-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 lg:p-6 text-center group-hover:border-rose-500/30 group-hover:bg-rose-500/5 group-hover:shadow-[0_0_40px_rgba(244,63,94,0.15)] transition-all duration-500 flex flex-col justify-center">
                    <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-white group-hover:text-rose-400 transition-colors duration-500 mb-2">
                      5+
                    </div>
                    <div className="text-[10px] md:text-xs text-white/40 uppercase tracking-widest leading-tight">
                      Anos
                    </div>
                  </div>
                </div>

                {/* Stat 2 */}
                <div className="group relative">
                  <div className="relative h-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 lg:p-6 text-center group-hover:border-rose-500/30 group-hover:bg-rose-500/5 group-hover:shadow-[0_0_40px_rgba(244,63,94,0.15)] transition-all duration-500 flex flex-col justify-center">
                    <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-white group-hover:text-rose-400 transition-colors duration-500 mb-2">
                      +100
                    </div>
                    <div className="text-[10px] md:text-xs text-white/40 uppercase tracking-widest leading-tight">
                      Telas Criadas
                    </div>
                  </div>
                </div>

                {/* Stat 3 */}
                <div className="group relative">
                  <div className="relative h-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 lg:p-6 text-center group-hover:border-rose-500/30 group-hover:bg-rose-500/5 group-hover:shadow-[0_0_40px_rgba(244,63,94,0.15)] transition-all duration-500 flex flex-col justify-center">
                    <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-white group-hover:text-rose-400 transition-colors duration-500 mb-2">
                      100%
                    </div>
                    <div className="text-[10px] md:text-xs text-white/40 uppercase tracking-widest leading-tight">
                      Satisfação
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>


      </section>
    </InfiniteGridBackground>
  );
}
