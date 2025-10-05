// src/components/HeroSection.tsx
import { Button } from "@/components/ui/button" // Importando NOSSO botão, do Shadcn
import Link from "next/link"

export function HeroSection() {
  return (
    // A alteração está nesta linha: ajustamos o padding-top (pt-...) para ser maior.
    <section className="w-full bg-background text-foreground pt-32 md:pt-40 lg:pt-48 pb-20 md:pb-28 lg:pb-32 text-center">
      <div className="container px-4 md:px-6">
        {/* Título Principal */}
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-4">
          Desenvolvedor de Software Full-Stack <br />
          {/* A cor 'primary' agora vem do tema Slate que escolhemos */}
          <span className="text-primary">Transformando Ideias em Realidade</span>
        </h1>
        
        {/* Subtítulo */}
        <p className="max-w-[700px] mx-auto text-muted-foreground md:text-xl mb-8">
          Crio soluções web e mobile modernas e de alta performance, focadas na
          experiência do usuário.
        </p>

        {/* Botão de Ação */}
        <Link href="#contact">
          <Button size="lg" className="px-8 py-6 text-lg">
            Agende uma Conversa
          </Button>
        </Link>
      </div>
    </section>
  )
}