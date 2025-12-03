// src/app/api/comments/[commentId]/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

// FUNÇÃO DELETE PARA EXCLUIR UM COMENTÁRIO
export async function DELETE(
  request: Request,
  { params }: { params: { commentId: string } }
) {
  // 1. Verifica se o usuário está logado
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse("Não autorizado", { status: 401 });
  }

  try {
    const { commentId } = params;

    // 2. Busca o comentário no banco para verificar o autor
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { authorId: true },
    });

    if (!comment) {
      return new NextResponse("Comentário não encontrado", { status: 404 });
    }

    // 3. Lógica de permissão:
    // O usuário pode deletar se for o autor OU se for um admin.
    const isAuthor = session.user.id === comment.authorId;
    const isAdmin = session.user.role === 'ADMIN';

    if (!isAuthor && !isAdmin) {
      return new NextResponse("Ação não permitida", { status: 403 }); // 403 Forbidden
    }

    // 4. Deleta o comentário
    await prisma.comment.delete({
      where: { id: commentId },
    });

    return new NextResponse("Comentário deletado com sucesso", { status: 200 });
  } catch (error) {
    console.error('[COMMENT_DELETE_ERROR]', error);
    return new NextResponse("Erro Interno do Servidor", { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { commentId: string } }
) {
  // 1. Proteção: Verifica se o usuário está logado
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse("Não autorizado", { status: 401 });
  }

  try {
    const { commentId } = params;
    const body = await request.json();
    const { text } = body;

    // 2. Busca o comentário para verificar o autor
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { authorId: true },
    });

    if (!comment) {
      return new NextResponse("Comentário não encontrado", { status: 404 });
    }

    // 3. Permissão: Apenas o autor ou um admin pode editar
    const isAuthor = session.user.id === comment.authorId;
    const isAdmin = session.user.role === 'ADMIN';

    if (!isAuthor && !isAdmin) {
      return new NextResponse("Ação não permitida", { status: 403 });
    }

    // 4. Atualiza o comentário no banco
    const updatedComment = await prisma.comment.update({
      where: { id: commentId },
      data: { text },
    });

    return NextResponse.json(updatedComment);
  } catch (error) {
    console.error('[COMMENT_PATCH_ERROR]', error);
    return new NextResponse("Erro Interno do Servidor", { status: 500 });
  }
}