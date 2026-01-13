"use client"

import { useState, useRef, FormEvent } from "react"

interface ContactSectionProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  successMessage?: string;
  placeholderText?: string;
}

export const ContactSection = ({
  title = "Vamos Conversar?",
  subtitle = "Entre em contato para transformarmos suas ideias em realidade.",
  buttonText = "Enviar",
  successMessage = "Mensagem enviada!",
  placeholderText = "seu@email.com",
}: ContactSectionProps) => {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle")
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!email) return

    setStatus("loading")

    // Simulate API delay
    setTimeout(() => {
      setStatus("success")
      setEmail("")
      fireConfetti()
    }, 1500)
  }

  const fireConfetti = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return
    
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      color: string;
      size: number;
    }> = []
    const colors = ["#f43f5e", "#a855f7", "#3b82f6", "#10b981", "#fbbf24"]

    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    const createParticle = () => ({
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 12,
      vy: (Math.random() - 2) * 10,
      life: 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 4 + 2,
    })

    for (let i = 0; i < 50; i++) {
      particles.push(createParticle())
    }

    const animate = () => {
      if (particles.length === 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        return
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.5
        p.life -= 2

        ctx.fillStyle = p.color
        ctx.globalAlpha = Math.max(0, p.life / 100)
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()

        if (p.life <= 0) {
          particles.splice(i, 1)
          i--
        }
      }

      requestAnimationFrame(animate)
    }

    animate()
  }

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
        @keyframes bounce-in {
          0% { transform: scale(0.8); opacity: 0; }
          50% { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-bounce-in {
          animation: bounce-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        @keyframes success-pulse {
          0% { transform: scale(0.5); opacity: 0; }
          50% { transform: scale(1.1); }
          70% { transform: scale(0.95); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes success-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(16, 185, 129, 0.4); }
          50% { box-shadow: 0 0 60px rgba(16, 185, 129, 0.8), 0 0 100px rgba(16, 185, 129, 0.4); }
        }
        @keyframes checkmark-draw {
          0% { stroke-dashoffset: 24; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes celebration-ring {
          0% { transform: translate(-50%, -50%) scale(0.8); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
        }
        .animate-success-pulse {
          animation: success-pulse 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        .animate-success-glow {
          animation: success-glow 2s ease-in-out infinite;
        }
        .animate-checkmark {
          stroke-dasharray: 24;
          stroke-dashoffset: 24;
          animation: checkmark-draw 0.4s ease-out 0.3s forwards;
        }
        .animate-ring {
          animation: celebration-ring 0.8s ease-out forwards;
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
            <img
              src="https://framerusercontent.com/images/oqZEqzDEgSLygmUDuZAYNh2XQ9U.png?scale-down-to=2048"
              alt=""
              className="w-full h-full object-cover opacity-50"
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
            <img
              src="https://framerusercontent.com/images/UbucGYsHDAUHfaGZNjwyCzViw8.png?scale-down-to=1024"
              alt=""
              className="w-full h-full object-cover opacity-60"
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
            <img
              src="https://framerusercontent.com/images/Ans5PAxtJfg3CwxlrPMSshx2Pqc.png"
              alt=""
              className="w-full h-full object-cover opacity-80"
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
      <div className="relative z-20 w-full flex flex-col items-center justify-center gap-6 px-6 py-24">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-sm">
          <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
          <span className="text-sm font-light tracking-widest text-white/70">CONTATO</span>
        </div>

        {/* Title */}
        <h2 className="text-4xl md:text-6xl font-bold text-center tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-rose-400 via-white to-purple-500">
          {title}
        </h2>

        {/* Subtitle */}
        <p className="text-base md:text-lg text-white/50 text-center max-w-xl font-light">
          {subtitle}
        </p>

        {/* Form / Success Container */}
        <div className="w-full max-w-md mt-6 h-[60px] relative">
          {/* Confetti Canvas */}
          <canvas
            ref={canvasRef}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none z-50"
          />

          {/* SUCCESS STATE */}
          <div
            className={`absolute inset-0 flex items-center justify-center rounded-full transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
              status === "success"
                ? "opacity-100 scale-100 animate-success-pulse animate-success-glow"
                : "opacity-0 scale-95 pointer-events-none"
            }`}
            style={{ backgroundColor: "#10b981" }}
          >
            {status === "success" && (
              <>
                <div className="absolute top-1/2 left-1/2 w-full h-full rounded-full border-2 border-emerald-400 animate-ring" style={{ animationDelay: "0s" }} />
                <div className="absolute top-1/2 left-1/2 w-full h-full rounded-full border-2 border-emerald-300 animate-ring" style={{ animationDelay: "0.15s" }} />
                <div className="absolute top-1/2 left-1/2 w-full h-full rounded-full border-2 border-emerald-200 animate-ring" style={{ animationDelay: "0.3s" }} />
              </>
            )}
            <div className={`flex items-center gap-2 text-white font-semibold text-lg ${status === "success" ? "animate-bounce-in" : ""}`}>
              <div className="bg-white/20 p-1 rounded-full">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    className={status === "success" ? "animate-checkmark" : ""}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <span>{successMessage}</span>
            </div>
          </div>

          {/* FORM STATE */}
          <form
            onSubmit={handleSubmit}
            className={`relative w-full h-full transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
              status === "success"
                ? "opacity-0 scale-95 pointer-events-none"
                : "opacity-100 scale-100"
            }`}
          >
            <input
              type="email"
              required
              placeholder={placeholderText}
              value={email}
              disabled={status === "loading"}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-[60px] pl-6 pr-[150px] rounded-full outline-none transition-all duration-200 placeholder-white/30 disabled:opacity-70 disabled:cursor-not-allowed bg-white/5 text-white border border-white/10 focus:border-rose-500/50 focus:ring-2 focus:ring-rose-500/20"
            />

            <div className="absolute top-[6px] right-[6px] bottom-[6px]">
              <button
                type="submit"
                disabled={status === "loading"}
                className="h-full px-8 rounded-full font-medium text-white transition-all active:scale-95 hover:brightness-110 disabled:hover:brightness-100 disabled:active:scale-100 disabled:cursor-wait flex items-center justify-center min-w-[130px] bg-gradient-to-r from-rose-500 to-purple-600 shadow-lg shadow-rose-500/25"
              >
                {status === "loading" ? (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  buttonText
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Footer text */}
        <p className="text-white/30 text-sm mt-8">
          © 2024 Marcelo Mouro Jr. Todos os direitos reservados.
        </p>
      </div>
    </section>
  )
}

export default ContactSection
