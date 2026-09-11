/**
 * Dimensões reais de cada imagem em /public/images, geradas por script.
 * A galeria do modal usa isto para dar a cada slide a proporção EXATA da
 * imagem — é o que elimina tarjas (letterbox) sem recortar nada.
 * Regenerar: rodar o script de dims após adicionar imagens novas.
 */
export const IMAGE_DIMS: Record<string, string> = {
  "/images/1c.webp": "1600 / 1005",
  "/images/1on.webp": "1600 / 1005",
  "/images/1sintonywebp.webp": "416 / 900",
  "/images/2c.webp": "1600 / 1005",
  "/images/2on.webp": "1600 / 1005",
  "/images/2sintony.webp": "416 / 900",
  "/images/3c.webp": "1600 / 1005",
  "/images/3on.webp": "1600 / 1005",
  "/images/3sintony.webp": "417 / 901",
  "/images/4c.webp": "1600 / 1005",
  "/images/4sintony.webp": "416 / 900",
  "/images/5c.webp": "1600 / 1005",
  "/images/5sintony.webp": "417 / 901",
  "/images/6c.webp": "1600 / 1005",
  "/images/6sintony.webp": "416 / 880",
  "/images/Antigravity-Ferramenta.webp": "650 / 80",
  "/images/Ferramenta-Claude-Code.webp": "343 / 80",
  "/images/Ferramenta-ComfyUI.webp": "301 / 80",
  "/images/Ferramenta-Figma.webp": "220 / 80",
  "/images/Ferramenta-Framer.webp": "235 / 80",
  "/images/Ferramenta-Google-Labs.webp": "452 / 80",
  "/images/Ferramenta-Lovable.webp": "426 / 80",
  "/images/Home.webp": "738 / 1600",
  "/images/Isaac1.webp": "1600 / 1005",
  "/images/Isaac2.webp": "1600 / 1005",
  "/images/Isaac3.webp": "1600 / 1005",
  "/images/Isaac4.webp": "1600 / 1005",
  "/images/Isaac5.webp": "1600 / 1005",
  "/images/Mensagens-do-dia.webp": "738 / 1600",
  "/images/Quiz.webp": "738 / 1600",
  "/images/reflexao.webp": "738 / 1600",
  "/images/Sobre-mim.webp": "724 / 1080",
  "/images/Versiculo.webp": "738 / 1600",
  "/images/Webchat-1.webp": "1600 / 1005",
  "/images/eu.webp": "1200 / 1600",
  "/images/eu2.webp": "1200 / 1600",
  "/images/projeto-1.webp": "1600 / 1005",
  "/images/projeto-2---Primeiro-Portfolio.webp": "1600 / 900",
  "/images/pt1.webp": "1600 / 1005",
  "/images/pt2.webp": "1600 / 1005",
  "/images/pt3.webp": "1600 / 1005",
  "/images/pt4.webp": "1600 / 1005",
  "/images/pt5.webp": "1600 / 1005",
  "/images/pt6.webp": "1600 / 1005",
  "/images/pt7.webp": "1600 / 1005",
  "/images/pt8.webp": "1600 / 1005",
  "/images/ze1.webp": "1600 / 1005",
  "/images/ze2.webp": "1600 / 1005",
  "/images/ze3.webp": "1600 / 1005",
  "/images/ze4.webp": "738 / 1600",
  "/images/ze5.webp": "738 / 1600",
  "/images/ze6.webp": "738 / 1600",
  "/images/ze7.webp": "738 / 1600",
  "/images/ze8.webp": "738 / 1600",
};

/** Proporção de uma imagem conhecida; capturas de web como fallback. */
export function imageAspect(src: string): string {
  return IMAGE_DIMS[src] ?? "1600 / 1005";
}
