"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
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

                {/* Card */}
                <div
                  className={`w-full md:w-[45%] ml-8 md:ml-0 ${
                    isLeft ? "md:pr-12" : "md:pl-12"
                  }`}
                >
                  <div className="group relative bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-rose-500/50 transition-all duration-500 hover:shadow-xl hover:shadow-rose-500/10">
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      {/* Top gradient */}
                      <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black/70 to-transparent z-10" />
                      {/* Bottom gradient */}
                      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black via-black/60 to-transparent z-10" />
                      
                      {/* Year Badge */}
                      <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm border border-white/20">
                        <span className="text-sm font-bold text-white">{item.year}</span>
                      </div>

                      {/* Category Badge */}
                      <div className="absolute bottom-4 left-4">
                        <span className="text-xs font-bold tracking-wider text-rose-400 uppercase">
                          {item.category}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-rose-400 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-white/60 text-sm leading-relaxed mb-4">
                        {item.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2">
                        {item.tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="px-3 py-1 text-xs rounded-full bg-white/5 text-white/70 border border-white/10"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Hover Glow Effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                      <div className="absolute inset-0 bg-gradient-to-r from-rose-500/10 to-purple-500/10" />
                    </div>
                  </div>
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
