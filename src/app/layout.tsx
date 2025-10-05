// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter as FontSans, Fira_Code as FontMono } from "next/font/google";
import "./globals.css";

import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import { Footer } from "@/components/Footer";
import AuthProvider from './providers'; // Renomeamos para AuthProvider

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = FontMono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Seu Nome | Desenvolvedor Full-Stack & Blog",
  description: "Landing page profissional e blog pessoal de um desenvolvedor de software.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
          fontMono.variable
        )}
      >
        <AuthProvider>
          <div className="relative flex min-h-dvh flex-col">
            {/* O Navbar NÃO fica mais aqui */}
            <main className="flex-1">{children}</main>
            <Footer />
            <Toaster />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}