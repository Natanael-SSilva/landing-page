// src/app/(app)/blog/[slug]/page.tsx
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import DOMPurify from 'dompurify';
// Importante: DOMPurify precisa de um "DOM" para funcionar. No servidor, precisamos simular um.
import { JSDOM } from 'jsdom';

// Função para buscar um único post pelo seu slug
async function getPost(slug: string) {
  const post = await prisma.post.findUnique({
    where: {
      slug: slug,
      published: true, // Garante que apenas posts publicados sejam acessíveis
    },
    include: {
      author: {
        select: { name: true }, // Pega o nome do autor
      },
    },
  });
  return post;
}

// A página em si. É um Server Component assíncrono.
export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);

  // Se o post não for encontrado, exibe a página de erro 404 do Next.js
  if (!post) {
    notFound();
  }

  // 1. Simula uma janela do navegador para o DOMPurify funcionar no servidor
  const window = new JSDOM('').window;
  const purify = DOMPurify(window);

  // 2. Limpa o HTML do conteúdo do post para evitar ataques XSS
  const sanitizedContent = purify.sanitize(post.content);

  // Formata a data para um formato legível
  const formattedDate = new Date(post.createdAt).toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <article className="container mx-auto py-20 px-4 md:px-6 max-w-4xl">
      {/* Imagem de Destaque (se existir) */}
      {post.imageUrl && (
        <div className="relative w-full h-96 mb-8 rounded-lg overflow-hidden">
          <Image
            src={post.imageUrl}
            alt={post.title}
            fill
            className="object-cover"
            priority
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

      {/* Conteúdo do Post */}
      <div
        // 3. Aplica as classes 'prose' para estilização automática do HTML
        className="prose dark:prose-invert prose-lg max-w-none"
        // 4. Renderiza o HTML JÁ LIMPO de forma segura
        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      />

      {/* A seção de comentários virá aqui no futuro */}
    </article>
  );
}