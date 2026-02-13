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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const appRef = useRef<any>(null);

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

      const app = TubesCursorCtor(canvasRef.current, {
        tubes: {
          colors: initialColors,
          lights: {
            intensity: lightIntensity,
            colors: lightColors,
          },
        },
      });

      appRef.current = app;

      if (enableRandomizeOnClick) {
        const handler = () => {
          const colors = randomColors(initialColors.length);
          const lights = randomColors(lightColors.length);
          app.tubes.setColors(colors);
          app.tubes.setLightsColors(lights);
        };
        document.body.addEventListener("click", handler);
        removeClick = () => document.body.removeEventListener("click", handler);
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
  }, [initialColors, lightColors, lightIntensity, enableRandomizeOnClick]);

  return (
    <div className={`relative h-screen w-screen overflow-hidden ${className}`}>
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

      {/* Bottom section - desktop notice + scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-4">
        {/* Desktop experience notice - centered above scroll */}
        <div className="flex items-center gap-2 text-white/30 text-xs font-extralight tracking-wide">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25" />
          </svg>
          <span className="hidden md:inline">Melhor experiência em desktop</span>
          <span className="md:hidden">Abra no desktop</span>
        </div>

        {/* Animated scroll indicator */}
        <div className="flex flex-col items-center gap-2 text-white/40">
          <span className="text-xs font-extralight tracking-widest uppercase">Scroll</span>
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex justify-center pt-2">
            <div className="w-1 h-2 bg-white/50 rounded-full animate-bounce" />
          </div>
        </div>
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
