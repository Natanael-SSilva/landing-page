// src/components/ServicesSection.tsx
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Code, Smartphone, Server } from "lucide-react" // Ícones para cada serviço

// Definindo os serviços em um array para fácil manutenção (Clean Code)
const servicesData = [
  {
    icon: <Code className="w-8 h-8 text-primary" />,
    title: "Desenvolvimento Web Sob Medida",
    description: "Crio aplicações web completas, do back-end ao front-end, utilizando as tecnologias mais modernas para garantir performance e escalabilidade."
  },
  {
    icon: <Smartphone className="w-8 h-8 text-primary" />,
    title: "Aplicações Mobile Responsivas",
    description: "Desenvolvo interfaces que se adaptam perfeitamente a qualquer dispositivo, proporcionando uma experiência de usuário consistente em desktops, tablets e celulares."
  },
  {
    icon: <Server className="w-8 h-8 text-primary" />,
    title: "Integração com APIs e Back-end",
    description: "Construo e integro APIs RESTful robustas para conectar suas aplicações a serviços de terceiros, bancos de dados e outras plataformas de forma segura."
  }
];

export function ServicesSection() {
  return (
    <section id="services" className="w-full py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        {/* Título da Seção */}
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Meus Serviços
        </h2>

        {/* Grid responsivo para os cards de serviço */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Mapeando os dados dos serviços para criar cada Card */}
          {servicesData.map((service) => (
            <Card 
              key={service.title} 
              className="bg-background/80 backdrop-blur-sm border-border/40 hover:border-primary/60 transition-all duration-300 transform hover:-translate-y-2"
            >
              <CardHeader className="items-center text-center">
                <div className="mb-4">
                  {service.icon}
                </div>
                <CardTitle className="text-xl mb-2">{service.title}</CardTitle>
                <CardDescription className="text-muted-foreground">
                  {service.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}