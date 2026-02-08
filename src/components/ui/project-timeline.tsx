"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import Image from "next/image";

interface TimelineItem {
  title: string;
  year: string;
  category: string;
  description: string;
  image: string;
  tags: string[];
}

interface ProjectTimelineProps {
  title?: string;
  subtitle?: string;
  data: TimelineItem[];
}

function TimelineCard({ item }: { item: TimelineItem }) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="relative w-full h-[450px] perspective-1000 group">
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 200, damping: 25 }}
        className="w-full h-full relative preserve-3d"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front Face */}
        <div className="absolute inset-0 backface-hidden bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 shadow-xl group-hover:border-rose-500/30 transition-colors duration-500">
          {/* Image */}
          <div className="relative h-3/5 overflow-hidden">
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10" />
            
            <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 z-20 shadow-lg">
              <span className="text-sm font-bold text-white">{item.year}</span>
            </div>
            
            <div className="absolute bottom-4 left-4 z-20">
              <span className="text-xs font-bold tracking-wider text-rose-400 uppercase drop-shadow-md">
                {item.category}
              </span>
            </div>
          </div>

          {/* Content Front */}
          <div className="h-2/5 p-6 flex flex-col justify-between bg-black/40 backdrop-blur-md">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">{item.title}</h3>
              <p className="text-white/60 text-sm line-clamp-2 leading-relaxed">
                {item.description}
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsFlipped(true);
              }}
              className="w-full mt-4 py-3 px-4 rounded-xl bg-gradient-to-r from-rose-600/20 to-purple-600/20 hover:from-rose-600/40 hover:to-purple-600/40 text-white text-sm font-semibold transition-all border border-rose-500/20 hover:border-rose-500/50 flex items-center justify-center gap-2 group/btn"
            >
              Mais informações
              <svg className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>

        {/* Back Face - Liquid Glass Design */}
        <div 
          className="absolute inset-0 backface-hidden rounded-2xl overflow-hidden border border-white/20 shadow-2xl shadow-rose-900/30"
          style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}
        >
          {/* Blurred Background Image */}
          <div className="absolute inset-0">
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover blur-xl scale-125 opacity-60"
            />
            {/* Glass Overlay */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />
            {/* Gradient Overlay for Readability */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-rose-950/40" />
            {/* Noise Texture */}
            <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat" />
          </div>

          {/* Back Content */}
          <div className="relative h-full p-8 flex flex-col items-center text-center justify-center z-10">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: isFlipped ? 1 : 0, y: isFlipped ? 0 : 10 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <h3 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-rose-100 to-white drop-shadow-sm">
                {item.title}
              </h3>
            </motion.div>
            
            <motion.div 
              className="overflow-y-auto max-h-[140px] mb-8 pr-2 custom-scrollbar"
              initial={{ opacity: 0 }}
              animate={{ opacity: isFlipped ? 1 : 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <p className="text-white/90 text-base leading-relaxed font-light">
                {item.description}
              </p>
            </motion.div>

            <motion.div 
              className="w-full"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: isFlipped ? 1 : 0, y: isFlipped ? 0 : 10 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="h-px w-8 bg-gradient-to-r from-transparent to-rose-500/50" />
                <span className="text-rose-300 text-xs font-bold uppercase tracking-[0.2em]">Tecnologias</span>
                <div className="h-px w-8 bg-gradient-to-l from-transparent to-rose-500/50" />
              </div>

              <div className="flex flex-wrap justify-center gap-2">
                {item.tags.map((tag, i) => (
                  <span 
                    key={i} 
                    className="px-3 py-1.5 text-xs font-medium rounded-lg bg-white/10 text-white border border-white/10 hover:bg-white/20 transition-colors shadow-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsFlipped(false);
              }}
              className="absolute top-4 right-4 p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-all duration-300 group/close"
              aria-label="Voltar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover/close:rotate-90 transition-transform duration-300">
                <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
              </svg>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function ProjectTimeline({ 
  title = "Minha Jornada", 
  subtitle = "Uma linha do tempo dos projetos que marcaram minha carreira",
  data 
}: ProjectTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section className="relative py-32 px-4 md:px-8 overflow-hidden">
      {/* Section Header */}
      <div className="text-center mb-20">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-block mb-4 text-xs font-bold tracking-[0.3em] text-rose-400 uppercase"
        >
          Timeline
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-rose-400 via-white to-rose-600"
        >
          {title}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 text-base md:text-lg text-white/50 max-w-2xl mx-auto font-light"
        >
          {subtitle}
        </motion.p>
      </div>

      {/* Timeline Container */}
      <div ref={containerRef} className="relative max-w-6xl mx-auto">
        {/* Center Line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/10 -translate-x-1/2 hidden md:block">
          <motion.div
            className="absolute top-0 left-0 w-full bg-gradient-to-b from-rose-500 via-purple-500 to-rose-500"
            style={{ height: lineHeight }}
          />
        </div>

        {/* Mobile Line */}
        <div className="absolute left-4 top-0 bottom-0 w-px bg-white/10 md:hidden">
          <motion.div
            className="absolute top-0 left-0 w-full bg-gradient-to-b from-rose-500 via-purple-500 to-rose-500"
            style={{ height: lineHeight }}
          />
        </div>

        {/* Timeline Items */}
        <div className="relative space-y-16 md:space-y-24">
          {data.map((item, index) => {
            const isLeft = index % 2 === 0;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true, margin: "-100px" }}
                className={`relative flex items-center ${
                  isLeft ? "md:flex-row" : "md:flex-row-reverse"
                } flex-row`}
              >
                {/* Connector Dot - Desktop */}
                <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-r from-rose-500 to-purple-600 shadow-lg shadow-rose-500/50" />
                  <div className="absolute w-8 h-8 rounded-full bg-rose-500/20 animate-ping" />
                </div>

                {/* Connector Dot - Mobile */}
                <div className="absolute left-4 -translate-x-1/2 flex md:hidden items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-rose-500 to-purple-600 shadow-lg shadow-rose-500/50" />
                </div>

                {/* Card Container */}
                <div
                  className={`w-full md:w-[45%] ml-8 md:ml-0 ${
                    isLeft ? "md:pr-12" : "md:pl-12"
                  }`}
                >
                  <TimelineCard item={item} />
                </div>

                {/* Spacer for alternating layout - Desktop only */}
                <div className="hidden md:block w-[45%]" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
