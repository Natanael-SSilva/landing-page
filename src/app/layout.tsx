// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google"; // Importando a fonte com um alias
import "./globals.css";

import { cn } from "@/lib/utils"; // Utilitário para mesclar classes do Tailwind
import { Navbar } from "@/components/Navbar";
import { Toaster } from "@/components/ui/toaster";

// Configuração da fonte padrão, seguindo o padrão do Shadcn
const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

// Metadados do site para SEO
export const metadata: Metadata = {
  title: "Seu Nome | Desenvolvedor Full-Stack",
  description: "Landing page profissional para desenvolvedor de software, construída com Next.js e Shadcn/UI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Forçando o tema escuro e suprimindo avisos de hidratação
    <html lang="pt-BR" className="dark" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <Navbar />
        <main>{children}</main> {/* Conteúdo da página (page.tsx) */}
        <Toaster /> {/* Componente que renderiza as notificações */}
        {/* O Footer será adicionado aqui */}
      </body>
    </html>
  );
}