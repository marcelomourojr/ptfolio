import type { Metadata, Viewport } from "next";
import { Inter_Tight, Geist_Mono } from "next/font/google";
import "./globals.css";

// Equivalente livre mais próximo da Helvetica Now Display / Neue Haas Grotesk.
const displaySans = Inter_Tight({
  variable: "--font-sans-display",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
        className={`${displaySans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
