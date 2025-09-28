// src/components/AboutSection.tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar" // Componente para a foto
import { Badge } from "@/components/ui/badge" // Componente para as skills

// Manter as habilidades em um array facilita a manutenção (Clean Code)
const skills = [
  'JavaScript (ES6+)', 'TypeScript', 'React', 'Next.js', 'Node.js', 
  'Tailwind CSS', 'Prisma', 'PostgreSQL', 'Docker', 'Git & GitHub'
];

export function AboutSection() {
  return (
    <section id="about" className="w-full py-20 md:py-32 bg-secondary/5">
      <div className="container mx-auto px-4 md:px-6">
        {/* Título da Seção */}
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Sobre Mim
        </h2>

        {/* Layout em Grid: 1 coluna no mobile, 3 no desktop */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center">

          {/* Coluna da Imagem */}
          <div className="md:col-span-1 flex justify-center">
            <Avatar className="w-48 h-48 md:w-64 md:h-64 border-4 border-primary">
              {/* Adicione uma imagem sua na pasta /public e atualize o src */}
              <AvatarImage src="/profile.jpg" alt="Sua Foto" />
              <AvatarFallback className="text-4xl">SN</AvatarFallback>
            </Avatar>
          </div>

          {/* Coluna do Texto e Habilidades */}
          <div className="md:col-span-2 space-y-8">
            {/* Parágrafos da Biografia */}
            <div className="space-y-4 text-lg text-muted-foreground">
              <p>
                Olá! Sou um desenvolvedor apaixonado por criar soluções que não apenas
                funcionam bem, mas que também proporcionam uma experiência de usuário
                excepcional. Minha jornada na programação começou em 2020, e desde então,
                tenho me dedicado a aprender e aplicar as melhores tecnologias do
                mercado.
              </p>
              <p>
                Acredito que a chave para um bom software está na colaboração, no
                código limpo e em uma arquitetura bem pensada. Meu objetivo é sempre
                traduzir ideias complexas em produtos simples, intuitivos e de alta
                performance.
              </p>
            </div>

            {/* Seção de Habilidades */}
            <div>
              <h3 className="text-2xl font-semibold mb-4">Minhas Habilidades</h3>
              <div className="flex flex-wrap gap-3">
                {/* Mapeando o array de skills para criar os Badges */}
                {skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-base px-4 py-1">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}