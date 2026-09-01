"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

import type { Creative } from "@/components/ui/creative-stack";

/**
 * Galeria 3D dos criativos: os vídeos atravessam a cena vindos do fundo,
 * com tecido/ondulação no shader, enquanto a frase fica parada no meio.
 *
 * Adaptações sobre o componente de referência (galeria de fotos):
 * - Vídeo no lugar de imagem: um <video> por criativo vira THREE.VideoTexture.
 *   Um plano por vídeo (nunca troca), então não há juggling de índices.
 * - Fontes 480p SEM áudio, exclusivas da galeria: os planos passam em
 *   movimento e desfocados — 480p é indistinguível aqui e corta ~50% da banda
 *   em relação ao set 720p que a pilha usa.
 * - SEM sequestro de roda/teclado: o site inteiro rola com Lenis. O túnel é
 *   guiado EXCLUSIVAMENTE pelo progresso dentro do trilho sticky da seção
 *   (0 → 1 = uma volta completa: cada criativo passa pela câmera uma vez, e
 *   aí o trilho solta para o carrossel). Sem deriva automática: a referência
 *   tinha autoplay por tempo, e com ele o efeito completava a volta sozinho
 *   em ~53s — quem chegasse depois encontrava tudo "já passado". Parado, a
 *   cena continua viva porque os próprios vídeos tocam. Progresso é absoluto
 *   (relido do layout), então parar/voltar nunca desloca o túnel.
 * - Zero re-render por frame: o original chamava setState dentro do useFrame;
 *   aqui tudo vive em refs e uniforms, aplicado imperativamente nos meshes.
 * - Players criados em useEffect com limpeza (não em useMemo): efeito
 *   colateral em render vazava 6 vídeos por montagem no StrictMode.
 * - `textureSize()` do shader original exige GLSL ES 3; trocado por um uniform
 *   `texel` fixo — mais barato e sem risco de não compilar.
 */

interface CreativeGalleryProps {
  items: Creative[];
  /** O trilho sticky da seção — o progresso do scroll dentro dele guia o túnel. */
  railRef: React.RefObject<HTMLDivElement | null>;
  /** Congela o frameloop (WebGL) quando o trilho não está na tela. */
  pausado?: boolean;
  /** Zona quente: os vídeos tocam mudos ANTES do pin, para o decode
      acontecer e as texturas já terem frames quando o efeito ligar. */
  aquecido?: boolean;
  className?: string;
}

interface Player {
  video: HTMLVideoElement;
  texture: THREE.VideoTexture;
  material: THREE.ShaderMaterial;
}

const DEPTH_RANGE = 50;

// Fase inicial do túnel: sem ela, na entrada (progresso 0) só ~2 planos
// caíam no corredor visível e um deles quase apagado — a cena parecia vazia.
// Com +4, a chegada já mostra um plano cheio, um entrando e um saindo.
const FASE = 4;

// Fade/blur em função da posição normalizada no túnel (0 = fundo, 0.5 = câmera).
// Os planos somem ANTES de atravessar a câmera (0.4–0.43), como na referência.
const FADE = { inStart: 0.05, inEnd: 0.25, outStart: 0.4, outEnd: 0.43 };
const BLUR = { inStart: 0.0, inEnd: 0.1, outStart: 0.4, outEnd: 0.43, max: 8.0 };

const vertexShader = /* glsl */ `
  uniform float scrollForce;
  uniform float time;
  uniform float isHovered;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vec3 pos = position;

    // Curvatura de tecido proporcional à força do scroll
    float curveIntensity = scrollForce * 0.3;
    float distanceFromCenter = length(pos.xy);
    float curve = distanceFromCenter * distanceFromCenter * curveIntensity;

    float ripple1 = sin(pos.x * 2.0 + scrollForce * 3.0) * 0.02;
    float ripple2 = sin(pos.y * 2.5 + scrollForce * 2.0) * 0.015;
    float clothEffect = (ripple1 + ripple2) * abs(curveIntensity) * 2.0;

    // Bandeira ao pousar o cursor: onda amortecida da esquerda para a direita
    float flagWave = 0.0;
    if (isHovered > 0.5) {
      float dampening = smoothstep(-0.5, 0.5, pos.x);
      flagWave = sin(pos.x * 3.0 + time * 8.0) * 0.1 * dampening
               + sin(pos.x * 5.0 + time * 12.0) * 0.03 * dampening;
    }

    pos.z -= (curve + clothEffect + flagWave);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform sampler2D map;
  uniform float opacity;
  uniform float blurAmount;
  uniform vec2 texel;
  varying vec2 vUv;

  void main() {
    vec4 color = texture2D(map, vUv);

    // 3x3 com passo largo, não 5x5: 9 leituras por pixel em vez de 25 — em
    // GPU fraca era o item mais caro do frame, com resultado visual igual
    // (o desfoque é de plano em movimento, ninguém inspeciona).
    if (blurAmount > 0.0) {
      vec4 blurred = vec4(0.0);
      float total = 0.0;
      for (float x = -1.0; x <= 1.0; x += 1.0) {
        for (float y = -1.0; y <= 1.0; y += 1.0) {
          vec2 offset = vec2(x, y) * texel * blurAmount * 1.8;
          float weight = 1.0 / (1.0 + length(vec2(x, y)));
          blurred += texture2D(map, vUv + offset) * weight;
          total += weight;
        }
      }
      color = blurred / total;
    }

    gl_FragColor = vec4(color.rgb, color.a * opacity);
  }
`;

/** Distribuição espacial dos planos: ângulo áureo, como na referência. */
function spatialPosition(i: number): { x: number; y: number } {
  const hAngle = (i * 2.618) % (Math.PI * 2);
  const vAngle = (i * 1.618 + Math.PI / 3) % (Math.PI * 2);
  const hRadius = (i % 3) * 1.2;
  const vRadius = ((i + 1) % 4) * 0.8;
  return {
    x: (Math.sin(hAngle) * hRadius * 7) / 3,
    y: (Math.cos(vAngle) * vRadius * 5) / 4,
  };
}

function criarPlayer(slug: string): Player {
  const video = document.createElement("video");
  video.muted = true;
  video.loop = true;
  video.playsInline = true;
  video.preload = "auto";
  video.crossOrigin = "anonymous";
  // MP4 (H.264) PRIMEIRO, de propósito: H.264 tem decode por HARDWARE em
  // praticamente qualquer máquina desde ~2010; VP9 vira decode por software
  // em CPUs antigas — e 6 streams simultâneos moíam o computador inteiro
  // ("travando sem parar"). Os MP4 480p daqui são inclusive menores.
  const mp4 = document.createElement("source");
  mp4.src = `/videos/${slug}-480.mp4`;
  mp4.type = "video/mp4";
  const webm = document.createElement("source");
  webm.src = `/videos/${slug}-480.webm`;
  webm.type = "video/webm";
  video.append(mp4, webm);
  video.load();

  const texture = new THREE.VideoTexture(video);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;

  const material = new THREE.ShaderMaterial({
    transparent: true,
    uniforms: {
      map: { value: texture },
      opacity: { value: 0 },
      blurAmount: { value: 0 },
      scrollForce: { value: 0 },
      time: { value: 0 },
      isHovered: { value: 0 },
      texel: { value: new THREE.Vector2(1 / 480, 1 / 854) },
    },
    vertexShader,
    fragmentShader,
  });

  return { video, texture, material };
}

function descartarPlayer({ video, texture, material }: Player) {
  video.pause();
  video.removeAttribute("src");
  while (video.firstChild) video.firstChild.remove();
  video.load();
  texture.dispose();
  material.dispose();
}

function GalleryScene({
  items,
  pausado,
  aquecido,
  railRef,
}: {
  items: Creative[];
  pausado: boolean;
  aquecido: boolean;
  railRef: React.RefObject<HTMLDivElement | null>;
}) {
  const meshRefs = useRef<(THREE.Mesh | null)[]>([]);
  const progresso = useRef(0);
  const offset = useRef(0);
  const force = useRef(0);
  const pausadoRef = useRef(pausado);
  useEffect(() => {
    pausadoRef.current = pausado;
    // Ao ligar: o túnel encaixa direto na posição do scroll (sem correr atrás
    // do alvo) e a força do tecido zera — entrada limpa, sem solavanco.
    if (!pausado) {
      offset.current = progresso.current * DEPTH_RANGE + FASE;
      force.current = 0;
    }
  }, [pausado]);

  // Players em estado, criados num efeito COM limpeza: o StrictMode monta,
  // desmonta e remonta — criar em useMemo vazava uma leva inteira de vídeos.
  const [players, setPlayers] = useState<Player[]>([]);
  const slugs = items.map((i) => i.slug).join();
  useEffect(() => {
    const novos = slugs ? slugs.split(",").map(criarPlayer) : [];
    // Ciclo de vida de recurso externo (vídeo + textura + material WebGL):
    // criar no efeito e guardar em estado é o único arranjo que sobrevive ao
    // montar→desmontar→remontar do StrictMode sem vazar nem usar recurso
    // descartado. O setState roda uma vez por montagem — não cascateia.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPlayers(novos);
    return () => {
      novos.forEach(descartarPlayer);
    };
  }, [slugs]);

  // Os vídeos tocam na ZONA QUENTE (antes do pin): tocar é o que força o
  // decode — sem isso a textura ficava preta até o buffer chegar, e a cena
  // parecia vazia ou demorada. Fora da zona, pausam. Com o efeito rodando,
  // o useFrame refina: só tocam os planos em cena (ver tocandoRef).
  const tocandoRef = useRef<boolean[]>([]);
  useEffect(() => {
    players.forEach(({ video }) => {
      if (aquecido) void video.play().catch(() => {});
      else video.pause();
    });
    tocandoRef.current = players.map(() => aquecido);
  }, [players, aquecido]);

  // No PIN (entrada de verdade), todos recomeçam do zero: o gancho de cada
  // criativo toca junto com a chegada. O seek a 0 é instantâneo — o trecho
  // já está decodificado pela zona quente.
  useEffect(() => {
    if (pausado) return;
    players.forEach(({ video }) => {
      video.currentTime = 0;
    });
  }, [players, pausado]);

  // Progresso do scroll dentro do trilho sticky: 0 no topo, 1 quando o
  // trilho termina. Absoluto e relido do layout — imune a pausas e saltos.
  useEffect(() => {
    const medir = () => {
      const rail = railRef.current;
      if (!rail) return;
      const r = rail.getBoundingClientRect();
      const percurso = r.height - window.innerHeight;
      progresso.current = percurso > 0 ? Math.min(1, Math.max(0, -r.top / percurso)) : 0;
    };
    medir();
    window.addEventListener("scroll", medir, { passive: true });
    window.addEventListener("resize", medir);
    return () => {
      window.removeEventListener("scroll", medir);
      window.removeEventListener("resize", medir);
    };
  }, [railRef]);

  useFrame((state, delta) => {
    if (pausadoRef.current) return;

    // Clamp do delta: ao voltar de aba oculta o clock entrega o tempo parado
    // inteiro de uma vez. O IO não cobre troca de aba — visibilidade de aba
    // não é interseção.
    const dt = Math.min(delta, 0.1);

    // Alvo = progresso no trilho, e só. A suavização (lerp) dá a inércia; a
    // força do tecido vem da velocidade REAL aplicada, na mesma escala do
    // componente de referência.
    const alvo = progresso.current * DEPTH_RANGE + FASE;
    const dz = (alvo - offset.current) * Math.min(1, dt * 6);
    offset.current += dz;
    const bruta = dt > 0 ? dz / dt / 10 : 0;
    force.current = 0.9 * force.current + 0.1 * Math.max(-3, Math.min(3, bruta));

    const time = state.clock.getElapsedTime();
    const half = DEPTH_RANGE / 2;

    players.forEach(({ material }, i) => {
      const mesh = meshRefs.current[i];
      if (!mesh) return;

      let z = (DEPTH_RANGE / players.length) * i + offset.current;
      z = ((z % DEPTH_RANGE) + DEPTH_RANGE) % DEPTH_RANGE;
      mesh.position.z = z - half;

      const t = z / DEPTH_RANGE;
      let opacity = 1;
      if (t < FADE.inStart) opacity = 0;
      else if (t <= FADE.inEnd) opacity = (t - FADE.inStart) / (FADE.inEnd - FADE.inStart);
      else if (t > FADE.outEnd) opacity = 0;
      else if (t >= FADE.outStart) opacity = 1 - (t - FADE.outStart) / (FADE.outEnd - FADE.outStart);
      opacity = Math.max(0, Math.min(1, opacity));

      let blur = 0;
      if (t < BLUR.inStart) blur = BLUR.max;
      else if (t <= BLUR.inEnd) blur = BLUR.max * (1 - (t - BLUR.inStart) / (BLUR.inEnd - BLUR.inStart));
      else if (t > BLUR.outEnd) blur = BLUR.max;
      else if (t >= BLUR.outStart) blur = BLUR.max * ((t - BLUR.outStart) / (BLUR.outEnd - BLUR.outStart));

      // Plano invisível não desenha: economiza o caminho mais caro do shader
      // exatamente quando ele não contribui com nada.
      mesh.visible = opacity > 0.001;

      // E vídeo de plano fora de cena não DECODIFICA: dos 6, só ~3 aparecem
      // por vez no túnel — tocar todos o tempo todo moía CPUs fracas. Toca
      // no corredor visível (t < 0.5) e um pouco antes de reentrar (t > 0.9),
      // para o frame já existir na volta. Só chama play/pause na TROCA.
      const deveTocar = t < 0.5 || t > 0.9;
      if (tocandoRef.current[i] !== deveTocar) {
        tocandoRef.current[i] = deveTocar;
        const { video } = players[i];
        if (deveTocar) void video.play().catch(() => {});
        else video.pause();
      }

      material.uniforms.opacity.value = opacity;
      material.uniforms.blurAmount.value = Math.max(0, Math.min(BLUR.max, blur));
      material.uniforms.scrollForce.value = force.current;
      material.uniforms.time.value = time;
    });
  });

  if (players.length === 0) return null;

  return (
    <>
      {players.map(({ material }, i) => {
        const { x, y } = spatialPosition(i);
        // Criativos são retrato 9:16 — altura fixa, largura derivada
        const aspect = 9 / 16;
        return (
          <mesh
            key={items[i]?.slug ?? i}
            ref={(el) => {
              meshRefs.current[i] = el;
            }}
            position={[x, y, (DEPTH_RANGE / players.length) * i - DEPTH_RANGE / 2]}
            scale={[2.6 * aspect, 2.6, 1]}
            material={material}
            onPointerEnter={() => {
              material.uniforms.isHovered.value = 1;
            }}
            onPointerLeave={() => {
              material.uniforms.isHovered.value = 0;
            }}
          >
            <planeGeometry args={[1, 1, 32, 32]} />
          </mesh>
        );
      })}
    </>
  );
}

export default function CreativeGallery({
  items,
  railRef,
  pausado = false,
  aquecido = false,
  className,
}: CreativeGalleryProps) {
  return (
    <div className={className} aria-hidden>
      <Canvas
        camera={{ position: [0, 0, 0], fov: 55 }}
        // Sem antialias: em tela cheia ele custa caro em GPU modesta, e as
        // bordas aqui são de planos de vídeo em movimento — não aparece.
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
        dpr={[1, 1.5]}
        frameloop={pausado ? "never" : "always"}
      >
        <GalleryScene items={items} pausado={pausado} aquecido={aquecido} railRef={railRef} />
      </Canvas>
    </div>
  );
}
