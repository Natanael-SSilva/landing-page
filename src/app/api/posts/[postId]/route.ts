// src/app/api/posts/[postId]/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

// =======================================================
// FUNÇÃO PATCH PARA ATUALIZAR UM POST EXISTENTE
// =======================================================
export async function PATCH(
  request: Request,
  { params }: { params: { postId: string } }
) {
  // Proteção: Apenas admins podem editar
  const session = await getServerSession(authOptions);
  // @ts-ignore
  if (!session || session.user?.role !== 'ADMIN') {
    return new NextResponse("Não autorizado", { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, slug, content, imageUrl, published } = body;
    const { postId } = params;

    if (!postId) {
      return new NextResponse("ID do post não encontrado", { status: 400 });
    }

    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        title,
        slug,
        content,
        imageUrl,
        published,
      },
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error('[POST_PATCH_ERROR]', error);
    return new NextResponse("Erro Interno do Servidor", { status: 500 });
  }
}


// =======================================================
// FUNÇÃO DELETE PARA EXCLUIR UM POST
// =======================================================
export async function DELETE(
  request: Request,
  { params }: { params: { postId: string } }
) {
  // Proteção: Apenas admins podem deletar
  const session = await getServerSession(authOptions);
  // @ts-ignore
  if (!session || session.user?.role !== 'ADMIN') {
    return new NextResponse("Não autorizado", { status: 401 });
  }

  try {
    const { postId } = params;

    if (!postId) {
      return new NextResponse("ID do post não encontrado", { status: 400 });
    }

    // Deleta o post do banco de dados
    await prisma.post.delete({
      where: { id: postId },
    });

    return new NextResponse("Post deletado com sucesso", { status: 200 });
  } catch (error) {
    console.error('[POST_DELETE_ERROR]', error);
    return new NextResponse("Erro Interno do Servidor", { status: 500 });
  }
}