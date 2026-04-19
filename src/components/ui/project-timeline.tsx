"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Image from "next/image";

interface TimelineItem {
  title: string;
  year: string;
  category: string;
  description: string;
  images: string[];
  tags: string[];
  link?: string;
  image?: string;
  appStoreLink?: string;
  playStoreLink?: string;
}

interface ProjectTimelineProps {
  title?: string;
  subtitle?: string;
  data: TimelineItem[];
}

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

function TimelineCard({ item }: { item: TimelineItem }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [[page, direction], setPage] = useState([0, 0]);

  const images = item.images || (item.image ? [item.image] : []);
  const currentImage = Math.abs(page % images.length);

  const paginate = (newDirection: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (images.length === 0) return;
    setPage([page + newDirection, newDirection]);
  };

  return (
    <div className="relative w-full h-full perspective-1000 group">
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 200, damping: 25 }}
        className="w-full h-full relative preserve-3d"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front Face - Typography & Content */}
        <div className="relative w-full h-full backface-hidden bg-zinc-900/60 backdrop-blur-md rounded-2xl overflow-hidden border border-white/5 hover:border-white/20 transition-colors duration-500 flex flex-col justify-between p-6 sm:p-8 shadow-xl">
          <div>
            <div className="flex justify-between items-start mb-6">
              <div className="px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold uppercase tracking-wider">
                {item.category}
              </div>
              <span className="text-white/40 text-sm font-bold">{item.year}</span>
            </div>
            
            <h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 mb-4 tracking-tight leading-tight">
              {item.title}
            </h3>
            
            <p className="text-white/60 text-sm leading-relaxed mb-6 line-clamp-4">
              {item.description}
            </p>
            
            <div className="flex flex-wrap gap-2">
              {item.tags.map(tag => (
                <span key={tag} className="px-2.5 py-1 text-[10px] uppercase tracking-wider font-semibold rounded-md bg-white/5 text-white/70 border border-white/10">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsFlipped(true);
              }}
              className="flex-1 min-w-[160px] whitespace-nowrap py-3 px-4 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/40 hover:shadow-[0_0_30px_rgba(244,63,94,0.15)] text-xs tracking-[0.1em] uppercase font-medium transition-all duration-500 flex items-center justify-center gap-2 group/btn"
            >
              Ver Imagens
              <svg className="w-4 h-4 transition-transform duration-500 group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
            
            <div className="flex gap-3">
              {item.link && (
                <a 
                  href={item.link} 
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="py-3 px-4 rounded-xl bg-transparent border border-white/20 text-white/50 hover:text-white hover:border-white/50 transition-all duration-300 flex items-center justify-center group/link"
                >
                  <svg className="w-5 h-5 transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              )}

              {item.appStoreLink && (
                <a 
                  href={item.appStoreLink} 
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  title="Ver na App Store"
                  className="py-3 px-4 rounded-xl bg-transparent border border-white/20 text-white/50 hover:text-white hover:border-white/50 transition-all duration-300 flex items-center justify-center group/store"
                >
                  <svg className="w-5 h-5 transition-transform duration-300 group-hover/store:scale-110" viewBox="0 0 384 512" fill="currentColor">
                    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
                  </svg>
                </a>
              )}

              {item.playStoreLink && (
                <a 
                  href={item.playStoreLink} 
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  title="Ver no Google Play"
                  className="py-3 px-4 rounded-xl bg-transparent border border-white/20 text-white/50 hover:text-white hover:border-white/50 transition-all duration-300 flex items-center justify-center group/store"
                >
                  <svg className="w-5 h-5 transition-transform duration-300 group-hover/store:scale-110" viewBox="0 0 512 512" fill="currentColor">
                    <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z"/>
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Back Face - Image Carousel */}
        <div 
          className="absolute inset-0 backface-hidden rounded-2xl overflow-hidden shadow-2xl p-4 bg-zinc-900 border border-white/5"
          style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}
        >
          {/* Liquid Glass Background for padding area */}
          <div className="absolute inset-0 border border-white/10 rounded-2xl overflow-hidden">
            {images.length > 0 && (
               <Image
                 src={images[currentImage]}
                 alt="Background"
                 fill
                 className="object-cover blur-2xl scale-150 opacity-40 transition-all duration-500"
               />
            )}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />
            <div className="absolute inset-0 opacity-[0.05] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat" />
          </div>

          <div className="relative w-full h-full rounded-xl overflow-hidden group/carousel flex items-center justify-center">
            {images.length > 0 ? (
               <AnimatePresence initial={false} custom={direction}>
                 <motion.div
                   key={page}
                   custom={direction}
                   initial={{ opacity: 0, x: direction > 0 ? 100 : -100 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: direction < 0 ? 100 : -100 }}
                   transition={{ type: "spring", stiffness: 300, damping: 30 }}
                   drag="x"
                   dragConstraints={{ left: 0, right: 0 }}
                   dragElastic={1}
                   onDragEnd={(e, { offset, velocity }) => {
                     const swipe = swipePower(offset.x, velocity.x);
                     if (swipe < -swipeConfidenceThreshold) {
                       paginate(1);
                     } else if (swipe > swipeConfidenceThreshold) {
                       paginate(-1);
                     }
                   }}
                   className="absolute inset-0 flex items-center justify-center cursor-grab active:cursor-grabbing p-4"
                 >
                   <img
                     src={images[currentImage]}
                     alt={`${item.title} screenshot`}
                     draggable={false}
                     className="max-w-full max-h-full rounded-2xl shadow-2xl border border-white/10 object-contain pointer-events-none"
                   />
                 </motion.div>
               </AnimatePresence>
            ) : (
               <div className="w-full h-full flex items-center justify-center text-white/50 bg-black/50 rounded-xl relative z-10">Sem Imagens</div>
            )}
            
            {/* Carousel Controls */}
            {images.length > 1 && (
              <>
                {/* Arrow Left */}
                <button 
                  onClick={(e) => paginate(-1, e)} 
                  className="absolute left-1 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 text-white flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-all hover:bg-rose-500/80 hover:scale-110 z-20"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {/* Arrow Right */}
                <button 
                  onClick={(e) => paginate(1, e)} 
                  className="absolute right-1 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 text-white flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-all hover:bg-rose-500/80 hover:scale-110 z-20"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                
                {/* Dots indicator */}
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-2 z-20 bg-black/40 backdrop-blur-md px-3 py-2 rounded-full border border-white/10 pointer-events-none">
                  {images.map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === currentImage ? 'bg-rose-500 w-3' : 'bg-white/40'}`} 
                    />
                  ))}
                </div>
              </>
            )}

            {/* Close Button top right */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsFlipped(false);
              }}
              className="absolute top-2 right-2 w-10 h-10 flex items-center justify-center text-white/80 bg-black/60 backdrop-blur-md rounded-full border border-white/20 hover:text-white hover:bg-rose-500/80 transition-all z-30 shadow-2xl hover:scale-110"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
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
  return (
    <section className="relative py-32 px-4 md:px-8 overflow-hidden">
      {/* Section Header */}
      {(title || subtitle) && (
        <div className="text-center mb-20">
          {title && (
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-rose-400 via-white to-rose-600"
            >
              {title}
            </motion.h2>
          )}
          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 text-base md:text-lg text-white/50 max-w-2xl mx-auto font-light"
            >
              {subtitle}
            </motion.p>
          )}
        </div>
      )}

      {/* Grid Container */}
      <div className="relative max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 px-4">
          {data.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
              className="w-full"
            >
              <TimelineCard item={item} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
