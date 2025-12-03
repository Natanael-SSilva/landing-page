// src/app/api/posts/[postId]/comments/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

// =======================================================
// FUNÇÃO GET: Para buscar todos os comentários de um post
// =======================================================
export async function GET(
  request: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const { postId } = params;

    const comments = await prisma.comment.findMany({
      where: { postId: postId },
      // Inclui os dados do autor de cada comentário
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true, // Futuramente podemos adicionar avatares de usuário
            role: true,  // Útil para exibir um selo de "Admin"
          },
        },
      },
      // Ordena os comentários: fixados primeiro, depois os mais antigos
      orderBy: [
        { isPinned: 'desc' },
        { createdAt: 'asc' },
      ],
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error('[COMMENTS_GET_ERROR]', error);
    return new NextResponse("Erro Interno do Servidor", { status: 500 });
  }
}

// =======================================================
// FUNÇÃO POST: Para criar um novo comentário
// =======================================================
export async function POST(
  request: Request,
  { params }: { params: { postId: string } }
) {
  // Proteção: Apenas usuários logados podem comentar
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse("Não autorizado", { status: 401 });
  }

  try {
    const { postId } = params;
    const body = await request.json();
    const { text, parentId } = body; // 'parentId' é opcional, para respostas

    if (!text) {
      return new NextResponse("O texto do comentário é obrigatório", { status: 400 });
    }

    // Cria o comentário no banco de dados
    const newComment = await prisma.comment.create({
      data: {
        text,
        postId,
        authorId: session.user.id, // Associa o comentário ao usuário logado
        parentId, // Se for uma resposta, associa ao comentário pai
      },
      // Inclui os dados do autor no retorno, para atualizar a UI imediatamente
      include: {
        author: {
          select: {
            name: true,
            image: true,
            role: true,
          },
        },
      },
    });

    return NextResponse.json(newComment, { status: 201 }); // 201 Created
  } catch (error) {
    console.error('[COMMENTS_POST_ERROR]', error);
    return new NextResponse("Erro Interno do Servidor", { status: 500 });
  }
}