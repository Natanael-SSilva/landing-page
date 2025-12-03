// src/app/(app)/blog/[slug]/page.tsx
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import { CommentsSection } from "@/components/blog/CommentsSection"; // 1. Importando a nova seção de comentários

// Função que roda no servidor para buscar um único post pelo seu slug
async function getPost(slug: string) {
  const post = await prisma.post.findUnique({
    where: {
      slug: slug,
      published: true,
    },
    include: {
      author: {
        select: { name: true },
      },
    },
  });
  return post;
}

// A página em si. É um Server Component assíncrono.
export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);

  if (!post) {
    notFound();
  }

  // Sanitização do HTML para renderização segura
  const window = new JSDOM('').window;
  const purify = DOMPurify(window);
  const sanitizedContent = purify.sanitize(post.content);

  // Formatação da data
  const formattedDate = new Date(post.createdAt).toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    // Usamos a tag <article> por questões de semântica
    <article className="container mx-auto py-10 px-4 md:px-6 max-w-4xl">
      {/* Imagem de Destaque (se existir) */}
      {post.imageUrl && (
        <div className="relative w-full h-96 mb-8 rounded-lg overflow-hidden">
          <Image
            src={post.imageUrl}
            alt={post.title}
            fill
            className="object-cover"
            priority // Prioriza o carregamento da imagem principal
          />
        </div>
      )}

      {/* Cabeçalho do Post */}
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          {post.title}
        </h1>
        <p className="mt-4 text-muted-foreground">
          Publicado em {formattedDate} por {post.author.name}
        </p>
      </header>

      {/* Conteúdo do Post, renderizado a partir do HTML seguro */}
      <div
        className="prose dark:prose-invert prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      />

      {/* Linha de separação para a seção de comentários */}
      <hr className="my-12 border-border" />
      
      {/* 2. Adicionando a seção de comentários, passando o ID do post */}
      <CommentsSection postId={post.id} />
    </article>
  );
}