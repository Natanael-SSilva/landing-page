// src/app/admin/dashboard/page.tsx
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PostsDataTable } from "@/components/admin/PostsDataTable"; // 1. Importe o novo componente

export default async function AdminDashboardPage() {
  // A lógica de proteção e busca de dados continua a mesma
  const session = await getServerSession(authOptions);
  // @ts-ignore
  if (!session || session.user?.role !== 'ADMIN') {
    redirect('/login');
  }

  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Painel de Administração</h1>
        <Button asChild>
          <Link href="/admin/posts/new">Novo Post</Link>
        </Button>
      </div>

      {/* 2. Renderize o componente da tabela, passando os posts */}
      <PostsDataTable posts={posts} />

    </div>
  );
}