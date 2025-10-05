// src/app/api/posts/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

// =======================================================
// FUNÇÃO GET PARA BUSCAR TODOS OS POSTS PÚBLICOS
// =======================================================
export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      where: { published: true }, // Busca apenas posts publicados
      orderBy: { createdAt: 'desc' }, // Ordena pelos mais recentes
      include: {
        author: {
          select: { name: true }, // Inclui o nome do autor do post
        },
      },
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error('[POSTS_GET_ERROR]', error);
    return new NextResponse("Erro Interno do Servidor", { status: 500 });
  }
}

// =======================================================
// FUNÇÃO POST PARA CRIAR UM NOVO POST
// =======================================================
export async function POST(request: Request) {
  // Proteção: Verifica se o usuário está logado e se é um admin
  const session = await getServerSession(authOptions);
  // @ts-ignore
  if (!session || session.user?.role !== 'ADMIN') {
    return new NextResponse("Não autorizado", { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, slug, content, imageUrl, published } = body;

    if (!title || !slug || !content) {
      return new NextResponse("Título, slug e conteúdo são obrigatórios", { status: 400 });
    }

    const existingPost = await prisma.post.findUnique({ where: { slug } });
    if (existingPost) {
      return new NextResponse("Um post com este slug já existe", { status: 409 });
    }

    const post = await prisma.post.create({
      data: {
        title,
        slug,
        content,
        imageUrl,
        published,
        authorId: session.user.id,
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error('[POSTS_POST_ERROR]', error);
    return new NextResponse("Erro Interno do Servidor", { status: 500 });
  }
}