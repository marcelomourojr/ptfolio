"use client";

import { liquidMetalFragmentShader, ShaderMount } from "@paper-design/shaders";
import { useEffect, useRef, useState } from "react";

interface LiquidMetalButtonProps {
  label: string;
  /** Renderiza um <a> de verdade: middle-click, nova aba e leitor de tela funcionam. */
  href: string;
  width?: number;
  height?: number;
}

/**
 * CTA com aro de metal líquido (WebGL via @paper-design/shaders).
 *
 * Adaptações sobre o componente de origem:
 * - é um <a>, não um <button> com window.location (o ShinyButton antigo tinha
 *   esse defeito e foi por isso que saiu);
 * - a limpeza usa `dispose()` — o método que a lib realmente expõe. O original
 *   chamava `destroy?.()`, que não existe e vazava um contexto WebGL por
 *   desmontagem, em silêncio;
 * - com prefers-reduced-motion o shader nasce parado (speed 0) e ignora os
 *   aceleradores de hover/click.
 */
export function LiquidMetalButton({
  label,
  href,
  width = 168,
  height = 48,
}: LiquidMetalButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);
  const shaderRef = useRef<HTMLDivElement>(null);
  const mountRef = useRef<ShaderMount | null>(null);
  const linkRef = useRef<HTMLAnchorElement>(null);
  const rippleId = useRef(0);
  const staticRef = useRef(false);

  useEffect(() => {
    const styleId = "liquid-metal-css";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
        .liquid-metal-shader canvas {
          width: 100% !important; height: 100% !important;
          display: block !important; position: absolute !important;
          top: 0 !important; left: 0 !important; border-radius: 100px !important;
        }
        @keyframes lm-ripple {
          0% { transform: translate(-50%, -50%) scale(0); opacity: 0.5; }
          100% { transform: translate(-50%, -50%) scale(4); opacity: 0; }
        }`;
      document.head.appendChild(style);
    }

    staticRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (shaderRef.current) {
      try {
        mountRef.current = new ShaderMount(
          shaderRef.current,
          liquidMetalFragmentShader,
          {
            u_repetition: 4,
            u_softness: 0.5,
            u_shiftRed: 0.3,
            u_shiftBlue: 0.3,
            u_distortion: 0,
            u_contour: 0,
            u_angle: 45,
            u_scale: 8,
            u_shape: 1,
            u_offsetX: 0.1,
            u_offsetY: -0.1,
          },
          undefined,
          staticRef.current ? 0 : 0.6,
        );
      } catch {
        // Sem WebGL o aro fica no fallback escuro do container — o link funciona igual.
      }
    }

    return () => {
      mountRef.current?.dispose();
      mountRef.current = null;
    };
  }, []);

  const setSpeed = (v: number) => {
    if (!staticRef.current) mountRef.current?.setSpeed(v);
  };

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    setSpeed(2.4);
    setTimeout(() => setSpeed(isHovered ? 1 : 0.6), 300);
    const rect = linkRef.current?.getBoundingClientRect();
    if (rect) {
      const ripple = { x: e.clientX - rect.left, y: e.clientY - rect.top, id: rippleId.current++ };
      setRipples((prev) => [...prev, ripple]);
      setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== ripple.id)), 600);
    }
  };

  const inner = { width: width - 4, height: height - 4 };

  return (
    <span className="relative inline-block" style={{ width, height }}>
      {/* Aro: o shader ocupa o bloco inteiro e aparece como orla de 2px */}
      <span
        className="liquid-metal-shader absolute inset-0 overflow-hidden rounded-full"
        ref={shaderRef}
        aria-hidden
        style={{
          background: "linear-gradient(180deg, #3a3a3a 0%, #101010 100%)",
          transform: isPressed ? "translateY(1px) scale(0.98)" : undefined,
          transition: "transform 0.15s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      />

      {/* Miolo escuro por cima do shader, deixando só o aro visível */}
      <span
        aria-hidden
        className="pointer-events-none absolute rounded-full"
        style={{
          left: 2,
          top: 2,
          width: inner.width,
          height: inner.height,
          background: "linear-gradient(180deg, #202020 0%, #000000 100%)",
          boxShadow: isPressed
            ? "inset 0 2px 4px rgba(0,0,0,0.5)"
            : "inset 0 1px 0 rgba(255,255,255,0.06)",
          transform: isPressed ? "translateY(1px) scale(0.98)" : undefined,
          transition: "transform 0.15s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.15s",
        }}
      />

      <a
        ref={linkRef}
        href={href}
        onClick={handleClick}
        onMouseEnter={() => {
          setIsHovered(true);
          setSpeed(1);
        }}
        onMouseLeave={() => {
          setIsHovered(false);
          setIsPressed(false);
          setSpeed(0.6);
        }}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        className="absolute inset-0 z-10 flex items-center justify-center overflow-hidden rounded-full
                   text-[15px] font-medium tracking-[-0.01em] text-[#c8c8c8] transition-colors hover:text-white
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
        style={{ textShadow: "0 1px 2px rgba(0,0,0,0.6)" }}
      >
        {label}
        {ripples.map((ripple) => (
          <span
            key={ripple.id}
            aria-hidden
            className="pointer-events-none absolute size-5 rounded-full"
            style={{
              left: ripple.x,
              top: ripple.y,
              background:
                "radial-gradient(circle, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 70%)",
              animation: "lm-ripple 0.6s ease-out",
            }}
          />
        ))}
      </a>
    </span>
  );
}
