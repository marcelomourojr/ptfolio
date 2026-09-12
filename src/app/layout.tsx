import type { Metadata, Viewport } from "next";
import { Inter_Tight, Chivo_Mono } from "next/font/google";
import "./globals.css";

// Equivalente livre mais próximo da Helvetica Now Display / Neue Haas Grotesk.
const displaySans = Inter_Tight({
  variable: "--font-sans-display",
  subsets: ["latin"],
  display: "swap",
});

// Chivo Mono no lugar da Geist Mono por causa do ZERO cortado, que aparece
// em 8 dos 8 cards de projeto ("2026 · Website") e em todo contador do site.
//
// A Geist não tem saída: as features do arquivo que o next/font serve são
// ccmp, dnom, frac, locl e numr — não existe zero, ss01 nem cv01 para
// desligar a barra, ela está na própria outline do glifo.
//
// A escolha foi medida, não chutada: desenhei o "0" de 15 monoespaçadas num
// canvas e contei a tinta no centro do glifo. Cortam o zero — Roboto (70%),
// DM (62%), PT (64%), Space (84%), Ubuntu (92%), Cousine (100%), Noto Sans
// (74%), Overpass (87%), Red Hat (63%), Spline Sans (72%), Martian (78%),
// Anonymous Pro (55%). Passam limpas — Chivo (0%), Azeret (0%) e Courier
// Prime (0%). Chivo ganhou por ser a mais próxima em largura da Geist
// (95 contra 92 unidades), então nenhum rótulo do bento muda de quebra;
// a Azeret é 16% mais larga e a Courier Prime é máquina de escrever.
const monoRotulos = Chivo_Mono({
  variable: "--font-mono-rotulos",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = "https://marcelomouro.com";
const siteTitle = "Marcelo Mouro Jr — Product Designer UI/UX";
const siteDescription =
  "Product Designer UI/UX com mais de 5 anos de experiência criando interfaces centradas no usuário, integrando IA, automação e dados à experiência do produto.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: "%s | Marcelo Mouro Jr",
  },
  description: siteDescription,
  authors: [{ name: "Marcelo Mouro Jr", url: siteUrl }],
  creator: "Marcelo Mouro Jr",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteUrl,
    siteName: "Marcelo Mouro Jr",
    title: siteTitle,
    description: siteDescription,
    images: [
      {
        url: "/images/og.png",
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "Marcelo Mouro Jr — Product Designer UI/UX",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: [
      { url: "/images/og.png", alt: "Marcelo Mouro Jr — Product Designer UI/UX" },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${displaySans.variable} ${monoRotulos.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
