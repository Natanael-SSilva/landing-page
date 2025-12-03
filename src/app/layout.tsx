// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Importação simplificada
import "./globals.css";

import { cn } from "@/lib/utils";
import { ThemeProvider } from "./ThemeProvider";
import AuthProvider from "./providers";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Toaster } from "@/components/ui/toaster";

// Configuração correta da fonte
const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans", // A variável é definida aqui
});

export const metadata: Metadata = {
  title: "Seu Nome | Desenvolvedor Full-Stack & Blog",
  description: "Landing page profissional e blog pessoal de um desenvolvedor de software.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable // Agora o TypeScript reconhece a propriedade '.variable'
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <div className="relative flex min-h-dvh flex-col">
              {/* O Navbar agora vai no layout do grupo (landing) */}
              <main className="flex-1">{children}</main>
              <Footer />
              <Toaster />
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}