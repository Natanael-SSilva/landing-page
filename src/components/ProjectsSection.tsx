// src/components/ProjectsSection.tsx
import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { ArrowUpRight, Github } from "lucide-react"

// Dados dos projetos (substitua com suas informações)
const projectsData = [
  {
    image: "/project-placeholder-1.png", // Imagem na pasta /public
    title: "Plataforma de E-commerce",
    description: "Uma plataforma de e-commerce completa com carrinho de compras, checkout, painel de administrador e integração de pagamento.",
    tags: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "Stripe"],
    liveUrl: "#", // Link para o projeto no ar
    githubUrl: "#", // Link para o repositório no GitHub
  },
  {
    image: "/project-placeholder-2.png",
    title: "Aplicativo de Gestão de Tarefas",
    description: "Um aplicativo full-stack de gestão de tarefas com autenticação de usuários, drag-and-drop de cards e atualizações em tempo real.",
    tags: ["React", "Node.js", "Express", "MongoDB", "Socket.IO"],
    liveUrl: "#",
    githubUrl: "#",
  },
   {
    image: "/project-placeholder-3.png",
    title: "API para Rede Social",
    description: "Uma API RESTful robusta para uma rede social, com endpoints para usuários, posts, comentários e sistema de likes.",
    tags: ["Node.js", "Express", "JWT", "Docker"],
    // Este projeto não tem link "live", então o botão não será renderizado
    githubUrl: "#",
  },
];

export function ProjectsSection() {
  return (
    <section id="projects" className="w-full py-20 md:py-32 bg-secondary/5">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Meus Projetos
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projectsData.map((project) => (
            <Card key={project.title} className="flex flex-col overflow-hidden transform hover:-translate-y-2 transition-all duration-300">
              <Image
                src={project.image}
                alt={`Imagem do projeto ${project.title}`}
                width={600}
                height={400}
                className="object-cover w-full h-48"
              />
              <CardHeader>
                <CardTitle className="text-xl">{project.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription>{project.description}</CardDescription>
                <div className="flex flex-wrap gap-2 mt-4">
                  {project.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="mt-auto">
                <div className="flex w-full justify-end gap-4">
                  {/* Renderização condicional: só mostra o botão se a URL existir */}
                  {project.liveUrl && (
                    <Button asChild variant="outline">
                      <Link href={project.liveUrl} target="_blank">
                        Ver ao Vivo <ArrowUpRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                  {project.githubUrl && (
                    <Button asChild>
                      <Link href={project.githubUrl} target="_blank">
                        <Github className="mr-2 h-4 w-4" /> GitHub
                      </Link>
                    </Button>
                  )}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}