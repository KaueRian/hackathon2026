import type { Metadata } from "next";
import { Geist, Geist_Mono, Comic_Neue, Creepster } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const comicNeue = Comic_Neue({
  weight: ['400', '700'],
  subsets: ["latin"],
  variable: "--font-comic",
});

const creepster = Creepster({
  weight: ['400'],
  subsets: ["latin"],
  variable: "--font-creep",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://fases.hackathon2026.pages.dev"),
  title: "FormHell - O Cadastro Impossível",
  description: "A pior experiência de usuário que você já teve. Você consegue criar uma conta?",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "FormHell - O Cadastro Impossível",
    description: "A pior experiência de usuário que você já teve. Você consegue criar uma conta?",
    images: ["/logo.png"],
  },
};

import { SessionProvider } from "@/lib/sessionStore";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${comicNeue.variable} ${creepster.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
