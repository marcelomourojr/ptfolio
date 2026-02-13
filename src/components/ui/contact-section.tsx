"use client"

import { ShinyButton } from "./shiny-button"
import Image from "next/image"

interface ContactSectionProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  email?: string;
}

export const ContactSection = ({
  title = "Vamos Criar Algo Incrível?",
  subtitle = "Deixe seu email e vamos conversar sobre seu próximo projeto.",
  buttonText = "Entrar em Contato",
  email = "contato@marcelomouro.com",
}: ContactSectionProps) => {

  return (
    <section id="contato" className="relative w-full min-h-screen bg-black flex items-center justify-center overflow-hidden">
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
        {/* Image 3 (Back) - spins clockwise */}
        <div className="absolute inset-0 animate-spin-slow">
          <div
            className="absolute top-1/2 left-1/2"
            style={{
              width: "2000px",
              height: "2000px",
              transform: "translate(-50%, -50%) rotate(279.05deg)",
              zIndex: 0,
            }}
          >
            <Image
              src="https://framerusercontent.com/images/oqZEqzDEgSLygmUDuZAYNh2XQ9U.png?scale-down-to=2048"
              alt=""
              fill
              className="object-cover opacity-50"
            />
          </div>
        </div>

        {/* Image 2 (Middle) - spins counter-clockwise */}
        <div className="absolute inset-0 animate-spin-slow-reverse">
          <div
            className="absolute top-1/2 left-1/2"
            style={{
              width: "1000px",
              height: "1000px",
              transform: "translate(-50%, -50%) rotate(304.42deg)",
              zIndex: 1,
            }}
          >
            <Image
              src="https://framerusercontent.com/images/UbucGYsHDAUHfaGZNjwyCzViw8.png?scale-down-to=1024"
              alt=""
              fill
              className="object-cover opacity-60"
            />
          </div>
        </div>

        {/* Image 1 (Front) - spins clockwise */}
        <div className="absolute inset-0 animate-spin-slow">
          <div
            className="absolute top-1/2 left-1/2"
            style={{
              width: "800px",
              height: "800px",
              transform: "translate(-50%, -50%) rotate(48.33deg)",
              zIndex: 2,
            }}
          >
            <Image
              src="https://framerusercontent.com/images/Ans5PAxtJfg3CwxlrPMSshx2Pqc.png"
              alt=""
              fill
              className="object-cover opacity-80"
            />
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
      <div className="relative z-20 w-full flex flex-col items-center justify-center gap-8 px-6 py-24">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-sm">
          <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
          <span className="text-sm font-light tracking-widest text-white/70">CONTATO</span>
        </div>

        {/* Title */}
        <h2 className="text-4xl md:text-6xl font-bold text-center tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-rose-400 via-white to-rose-600 drop-shadow-[0_0_30px_rgba(0,0,0,0.8)]">
          {title}
        </h2>

        {/* Subtitle */}
        <p className="text-base md:text-lg text-white/50 text-center max-w-xl font-light">
          {subtitle}
        </p>

        {/* Shiny Button */}
        <div className="mt-4">
          <ShinyButton href={`mailto:${email}`}>
            {buttonText}
          </ShinyButton>
        </div>

        {/* Footer text */}
        <p className="text-white/30 text-sm mt-12">
          © 2024 Marcelo Mouro Jr. Todos os direitos reservados.
        </p>
      </div>
    </section>
  )
}

export default ContactSection
