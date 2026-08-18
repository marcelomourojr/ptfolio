"use client";

import { useEffect, useRef } from "react";

type TubesCursorProps = {
  title?: string;
  subtitle?: string;
  caption?: string;
  initialColors?: string[]; // tubes base colors
  lightColors?: string[]; // lights colors
  lightIntensity?: number; // lights intensity
  titleSize?: string; // Tailwind text size classes
  subtitleSize?: string;
  captionSize?: string;
  enableRandomizeOnClick?: boolean;
  className?: string; // extra classes for wrapper
};

const TubesCursor = ({
  title = "Tubes",
  subtitle = "Cursor",
  caption = "WebGPU / WebGL",
  initialColors = ["#f967fb", "#53bc28", "#6958d5"],
  lightColors = ["#83f36e", "#fe8a2e", "#ff008a", "#60aed5"],
  lightIntensity = 200,
  titleSize = "text-[80px]",
  // subtitleSize = "text-[60px]", // Unused
  captionSize = "text-base",
  enableRandomizeOnClick = true,
  className = "",
}: TubesCursorProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const appRef = useRef<any>(null);

  // Os arrays de cores chegam como literais inline, ou seja, com referência nova
  // a cada render. Guardá-los num ref mantém o efeito rodando só na montagem e
  // evita recriar o contexto WebGL a cada re-render.
  const optionsRef = useRef({
    initialColors,
    lightColors,
    lightIntensity,
    enableRandomizeOnClick,
  });
  optionsRef.current = {
    initialColors,
    lightColors,
    lightIntensity,
    enableRandomizeOnClick,
  };

  useEffect(() => {
    let removeClick: (() => void) | null = null;
    let destroyed = false;

    (async () => {
      const mod = await import(
        /* webpackIgnore: true */
        // @ts-expect-error - External CDN module
        "https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js"
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const TubesCursorCtor = (mod as any).default ?? mod;

      if (!canvasRef.current || destroyed) return;

      const opts = optionsRef.current;

      const app = TubesCursorCtor(canvasRef.current, {
        tubes: {
          colors: opts.initialColors,
          lights: {
            intensity: opts.lightIntensity,
            colors: opts.lightColors,
          },
        },
      });

      appRef.current = app;

      // O listener fica no hero, não no body: antes qualquer clique na página
      // (inclusive em botões e links) randomizava as cores.
      const clickTarget = wrapperRef.current;

      if (opts.enableRandomizeOnClick && clickTarget) {
        const handler = () => {
          const { initialColors: base, lightColors: lights } = optionsRef.current;
          app.tubes.setColors(randomColors(base.length));
          app.tubes.setLightsColors(randomColors(lights.length));
        };
        clickTarget.addEventListener("click", handler);
        removeClick = () => clickTarget.removeEventListener("click", handler);
      }
    })();

    return () => {
      destroyed = true;
      if (removeClick) removeClick();
      try {
        appRef.current?.dispose?.();
        appRef.current = null;
      } catch {
        // ignore
      }
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      className={`relative h-screen w-screen overflow-hidden ${className}`}
    >
      {/* Background canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" />

      {/* Hero text */}
      <div className="relative z-10 flex h-full w-full flex-col items-center justify-center select-none">
        {/* UI/UX Badge - positioned above the name */}
        <div
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-sm text-sm"
        >
          <span className="h-2 w-2 rounded-full bg-rose-500/80 animate-pulse" />
          <span className="font-light tracking-widest text-white/70">
            {subtitle}
          </span>
        </div>

        {/* Gradient Title */}
        <h1
          className={`m-0 p-0 font-bold leading-[1.05] tracking-tight drop-shadow-[0_0_30px_rgba(0,0,0,0.8)] bg-clip-text text-transparent bg-gradient-to-r from-rose-400 via-white to-rose-600 ${titleSize}`}
        >
          {title}
        </h1>

        {/* Caption */}
        <p
          className={`mt-6 m-0 p-0 text-white/40 font-extralight tracking-tight ${captionSize}`}
        >
          {caption}
        </p>
      </div>



      {/* Bottom fade transition */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black via-black/80 to-transparent z-30 pointer-events-none" />
    </div>
  );
};

function randomColors(count: number) {
  return new Array(count).fill(0).map(
    () =>
      "#" +
      Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0")
  );
}

export { TubesCursor };
