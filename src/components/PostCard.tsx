// src/components/PostCard.tsx
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Definindo os tipos de dados que este componente espera receber
interface PostCardProps {
  post: {
    id: string;
    slug: string;
    title: string;
    content: string;
    createdAt: string; // A data virá como string da API
    author: {
      name: string | null;
    };
  };
}

export function PostCard({ post }: PostCardProps) {
  // Formata a data para um formato mais legível
  const formattedDate = new Date(post.createdAt).toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Pega um pequeno trecho do conteúdo para usar como resumo
  const excerpt = post.content.substring(0, 150) + '...';

  return (
    <Link href={`/blog/${post.slug}`}>
      <Card className="h-full transform hover:-translate-y-2 transition-all duration-300 flex flex-col">
        <CardHeader>
          <Badge variant="secondary" className="w-fit mb-2">{formattedDate}</Badge>
          <CardTitle className="text-xl">{post.title}</CardTitle>
          <CardDescription>por {post.author.name || 'Autor Desconhecido'}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-muted-foreground">{excerpt}</p>
        </CardContent>
      </Card>
    </Link>
  );
}