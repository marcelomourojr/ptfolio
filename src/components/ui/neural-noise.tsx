"use client";

import React, { useEffect, useRef } from "react";

type NeuralNoiseProps = {
  /** Canvas opacity (0..1) */
  opacity?: number;
  /** Pointer attraction strength (0..2) — scales pointer distance term */
  pointerStrength?: number;
  /** Time scale multiplier (0.25..4) */
  timeScale?: number;
  /** Class to override wrapper layout */
  className?: string;
  /** Children content to render above the canvas */
  children?: React.ReactNode;
};

function NeuralNoise({
  opacity = 0.95,
  pointerStrength = 1,
  timeScale = 1,
  className = "relative bg-black overflow-hidden",
  children,
}: NeuralNoiseProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number>(0);

  const pointer = useRef({ x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 });
  const scrollProgress = useRef(0);
  const startTS = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = (canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;

    if (!gl) {
      console.warn("WebGL not supported");
      return;
    }

    // Vertex shader
    const VERT = `
      precision mediump float;
      attribute vec2 a_position;
      varying vec2 vUv;
      void main() {
        vUv = 0.5 * (a_position + 1.0);
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    // Fragment shader with rose/purple palette
    const FRAG = `
      precision mediump float;
      varying vec2 vUv;
      uniform float u_time;
      uniform float u_ratio;
      uniform vec2 u_pointer_position;
      uniform float u_scroll_progress;
      uniform float u_pointer_strength;
      uniform float u_time_scale;

      vec2 rotate(vec2 uv, float th) {
        return mat2(cos(th), sin(th), -sin(th), cos(th)) * uv;
      }

      float neuro_shape(vec2 uv, float t, float p) {
        vec2 sine_acc = vec2(0.0);
        vec2 res = vec2(0.0);
        float scale = 8.0;
        for (int j = 0; j < 15; j++) {
          uv = rotate(uv, 1.0);
          sine_acc = rotate(sine_acc, 1.0);
          vec2 layer = uv * scale + float(j) + sine_acc - t;
          sine_acc += sin(layer) + 2.4 * p;
          res += (0.5 + 0.5 * cos(layer)) / scale;
          scale *= 1.2;
        }
        return res.x + res.y;
      }

      void main() {
        vec2 uv = 0.5 * vUv;
        uv.x *= u_ratio;

        vec2 pointer = vUv - u_pointer_position;
        pointer.x *= u_ratio;
        float p = clamp(length(pointer), 0.0, 1.0);
        p = 0.5 * pow(1.0 - p, 2.0) * u_pointer_strength;

        float t = 0.001 * u_time * u_time_scale;

        float noise = neuro_shape(uv, t, p);
        noise = 1.2 * pow(noise, 3.0);
        noise += pow(noise, 10.0);
        noise = max(0.0, noise - 0.5);
        noise *= (1.0 - length(vUv - 0.5));

        // Rose/Purple/Blue palette
        float scrollAnim = u_scroll_progress * 2.0;
        vec3 roseColor = vec3(0.957, 0.247, 0.369);
        vec3 purpleColor = vec3(0.659, 0.333, 0.969);
        vec3 blueColor = vec3(0.231, 0.510, 0.965);
        
        vec3 base = mix(roseColor, purpleColor, 0.5 + 0.5 * sin(scrollAnim));
        base = mix(base, blueColor, 0.3 + 0.3 * cos(scrollAnim * 1.5));
        base = normalize(base);

        vec3 color = base * noise;
        gl_FragColor = vec4(color, noise);
      }
    `;

    const compile = (src: string, type: number) => {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        console.error("Shader compile error:", gl.getShaderInfoLog(sh));
        gl.deleteShader(sh);
        return null;
      }
      return sh;
    };

    const vs = compile(VERT, gl.VERTEX_SHADER);
    const fs = compile(FRAG, gl.FRAGMENT_SHADER);
    if (!vs || !fs) return;

    const program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);

    // Quad buffer
    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const vbo = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const aPos = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    // Uniforms
    const uniforms = {
      u_time: gl.getUniformLocation(program, "u_time"),
      u_ratio: gl.getUniformLocation(program, "u_ratio"),
      u_pointer_position: gl.getUniformLocation(program, "u_pointer_position"),
      u_scroll_progress: gl.getUniformLocation(program, "u_scroll_progress"),
      u_pointer_strength: gl.getUniformLocation(program, "u_pointer_strength"),
      u_time_scale: gl.getUniformLocation(program, "u_time_scale"),
    };

    gl.uniform1f(uniforms.u_pointer_strength, pointerStrength);
    gl.uniform1f(uniforms.u_time_scale, timeScale);

    // Resize handler
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.floor(window.innerWidth * dpr);
      const h = Math.floor(window.innerHeight * dpr);
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
      gl.uniform1f(uniforms.u_ratio, w / h);
    };

    // Pointer tracking
    const onPointerMove = (e: PointerEvent) => {
      pointer.current.tx = e.clientX / window.innerWidth;
      pointer.current.ty = 1 - e.clientY / window.innerHeight;
    };

    const onScroll = () => {
      scrollProgress.current = window.pageYOffset / (2 * window.innerHeight);
    };

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("scroll", onScroll, { passive: true });

    resize();
    onScroll();

    // Animation loop
    startTS.current = performance.now();
    const loop = (now: number) => {
      rafRef.current = requestAnimationFrame(loop);

      // Smooth pointer
      pointer.current.x += (pointer.current.tx - pointer.current.x) * 0.1;
      pointer.current.y += (pointer.current.ty - pointer.current.y) * 0.1;

      gl.uniform1f(uniforms.u_time, now - startTS.current);
      gl.uniform2f(uniforms.u_pointer_position, pointer.current.x, pointer.current.y);
      gl.uniform1f(uniforms.u_scroll_progress, scrollProgress.current);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", onScroll);
      gl.deleteBuffer(vbo);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, [pointerStrength, timeScale]);

  return (
    <div ref={containerRef} className={className}>
      {/* Sticky canvas container that stays in view while scrolling through content */}
      <div className="sticky top-0 left-0 h-screen w-full pointer-events-none" style={{ marginBottom: '-100vh' }}>
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          style={{ opacity }}
        />
      </div>

      {/* Content rendered above the canvas */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

export { NeuralNoise };
