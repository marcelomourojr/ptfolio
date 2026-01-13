"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

// Projetos placeholder - substitua pelas imagens reais dos seus projetos
const PROJECTS = [
  { src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80", title: "Dashboard", category: "Web App" },
  { src: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&q=80", title: "App Mobile", category: "Mobile" },
  { src: "https://images.unsplash.com/photo-1559028012-481c04fa702d?w=400&q=80", title: "UI Design", category: "Design" },
  { src: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=400&q=80", title: "Website", category: "Web" },
  { src: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=400&q=80", title: "Branding", category: "Design" },
  { src: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&q=80", title: "Ilustração", category: "Art" },
];

interface ProjectCardProps {
  project: typeof PROJECTS[0];
  index: number;
  scrollYProgress: any;
}

function ProjectCard({ project, index, scrollYProgress }: ProjectCardProps) {
  // Stagger the animations based on index
  const startOffset = index * 0.05;
  const endOffset = 0.4 + index * 0.05;

  const y = useTransform(
    scrollYProgress,
    [startOffset, endOffset],
    [100 + index * 50, 0]
  );

  const opacity = useTransform(
    scrollYProgress,
    [startOffset, startOffset + 0.1],
    [0, 1]
  );

  const scale = useTransform(
    scrollYProgress,
    [startOffset, endOffset],
    [0.8, 1]
  );

  const rotate = useTransform(
    scrollYProgress,
    [startOffset, endOffset],
    [index % 2 === 0 ? -10 : 10, 0]
  );

  const springY = useSpring(y, { stiffness: 100, damping: 20 });
  const springScale = useSpring(scale, { stiffness: 100, damping: 20 });
  const springRotate = useSpring(rotate, { stiffness: 100, damping: 20 });

  return (
    <motion.div
      style={{ y: springY, opacity, scale: springScale, rotate: springRotate }}
      className="group relative overflow-hidden rounded-2xl bg-gray-900 cursor-pointer"
    >
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={project.src}
          alt={project.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      </div>

      {/* Overlay Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
        <span className="text-xs font-medium text-rose-400 uppercase tracking-widest">
          {project.category}
        </span>
        <h3 className="mt-1 text-lg md:text-xl font-bold text-white">
          {project.title}
        </h3>
      </div>

      {/* Hover Effect */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-rose-500/50 rounded-2xl transition-colors duration-300" />
    </motion.div>
  );
}

export default function ProjectsShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Title animation
  const titleY = useTransform(scrollYProgress, [0, 0.3], [50, 0]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);
  const springTitleY = useSpring(titleY, { stiffness: 100, damping: 20 });

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen bg-black py-20 md:py-32"
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-950 to-black" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-10">
        {/* Header */}
        <motion.div
          style={{ y: springTitleY, opacity: titleOpacity }}
          className="mb-16 md:mb-24 text-center"
        >
          <span className="inline-block mb-4 text-xs font-bold tracking-[0.3em] text-rose-400 uppercase">
            Portfolio
          </span>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-rose-400 via-white to-rose-600">
            Meus Projetos
          </h2>
          <p className="mt-6 text-base md:text-lg text-white/50 max-w-2xl mx-auto font-light">
            Uma seleção dos meus trabalhos em UI/UX Design.
            Cada projeto representa uma jornada única de criatividade e inovação.
          </p>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {PROJECTS.map((project, index) => (
            <ProjectCard
              key={index}
              project={project}
              index={index}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          style={{
            opacity: useTransform(scrollYProgress, [0.6, 0.8], [0, 1]),
            y: useTransform(scrollYProgress, [0.6, 0.8], [30, 0]),
          }}
          className="mt-16 md:mt-24 text-center"
        >
          <a
            href="#"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-white/20 bg-white/5 text-white font-medium hover:bg-white/10 hover:border-rose-500/50 transition-all duration-300"
          >
            Ver todos os projetos
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
