// src/app/admin/posts/[postId]/edit/page.tsx
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Post } from "@prisma/client";
import { EditPostForm } from "@/components/admin/EditPostForm"; // Importaremos o formulário de um novo arquivo

// INTERFACE DA PÁGINA (SERVER COMPONENT)
// Esta é a parte que roda no servidor para buscar os dados.
export default async function EditPostPage({ params }: { params: { postId: string } }) {
  const { postId } = params;

  // Busca o post no banco de dados usando o ID da URL
  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
  });

  // Se o post não for encontrado, exibe a página 404
  if (!post) {
    notFound();
  }

  // Renderiza o componente do formulário, passando os dados do post
  return <EditPostForm post={post} />;
}