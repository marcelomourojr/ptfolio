import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
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
  keywords: [
    "Product Designer",
    "UI/UX Designer",
    "Design de Interface",
    "Figma",
    "Framer",
    "Marcelo Mouro",
  ],
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
    // TODO: trocar por uma imagem dedicada de 1200x630 (ex.: /images/og.png).
    // A foto abaixo é retrato 4:5 e vai aparecer cortada em alguns previews.
    images: [
      {
        url: "/images/eu2.webp",
        alt: "Marcelo Mouro Jr — Product Designer UI/UX",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ["/images/eu2.webp"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
