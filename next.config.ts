import type { NextConfig } from "next";

/**
 * Cabeçalhos de segurança, válidos para toda resposta que o Worker gera.
 *
 * Por que aqui e não só no public/_headers: o `_headers` é lido pelo binding
 * ASSETS (Workers Static Assets) e vale para os arquivos de /public — mas o
 * HTML das páginas é gerado pelo servidor do Next dentro do Worker e passa por
 * FORA desse caminho. Testado no workerd local: com as regras só no
 * `_headers`, o og.png vinha protegido e a home vinha sem nada.
 *
 * O `unsafe-inline` é necessidade, não descuido: o Next injeta o bootstrap
 * como script inline e o framer-motion escreve style inline em ~180
 * elementos. A política ainda assim vale a pena — barra script de terceiro,
 * embutir o site em iframe, plugin, sequestro de <base> e post de formulário
 * para fora. O site não busca nada externo: 26 recursos, todos da própria
 * origem.
 */
// Em desenvolvimento o React usa eval() para reconstruir pilhas de erro e
// outras ferramentas de depuração; sem 'unsafe-eval' o console enche de erro
// de CSP e o Fast Refresh perde recurso. Em produção o React nunca usa eval,
// então a política estrita vale onde importa.
const dev = process.env.NODE_ENV === "development";

const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${dev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "media-src 'self' blob:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "object-src 'none'",
  "form-action 'self'",
  "upgrade-insecure-requests",
].join("; ");

const nextConfig: NextConfig = {
  images: {
    // As imagens agora são todas locais (/public) — os remotePatterns do
    // Unsplash/Framer eram só para os placeholders antigos da /links.
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          { key: "Content-Security-Policy", value: csp },
        ],
      },
    ];
  },
};

export default nextConfig;
