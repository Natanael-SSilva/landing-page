// src/app/(app)/blog/page.tsx
'use client';

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { toast } from "sonner";
import { PostCard } from "@/components/PostCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

// Definindo o tipo para um Post, para uso no estado
type Post = {
  id: string;
  slug: string;
  title: string;
  content: string;
  createdAt: string;
  author: {
    name: string | null;
  };
};

export default function BlogPage() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      setIsLoading(true);
      try {
        // Agora fazemos a chamada real à API para buscar os posts
        const response = await fetch('/api/posts');
        if (!response.ok) {
          throw new Error('Falha ao buscar os posts.');
        }
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Falha ao buscar posts:", error);
        toast.error("Não foi possível carregar os posts.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchPosts();
  }, []); // O array vazio garante que a busca aconteça apenas uma vez

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">
            Últimas Publicações
          </h1>
          <p className="mt-2 text-muted-foreground">
            Meus pensamentos, ideias e atualizações.
          </p>
        </div>
        
        {/* Botão para acessar o painel de admin, visível apenas para admins */}
        {session?.user?.role === 'ADMIN' && (
          <div>
            <Button asChild>
              <Link href="/admin/dashboard">Painel de Admin</Link>
            </Button>
          </div>
        )}
      </div>

      {isLoading ? (
        // Exibe "esqueletos" de loading enquanto os dados carregam
        <div className="space-y-12">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      ) : posts.length > 0 ? (
        // Se houver posts, exibe a lista verticalmente
        <div className="space-y-12">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        // Se não houver posts, exibe uma mensagem
        <div className="text-center py-16">
            <h3 className="text-2xl font-semibold">Nenhum post encontrado.</h3>
            <p className="text-muted-foreground mt-2">
                Parece que ainda não publiquei nada. Crie seu primeiro post no Painel de Admin!
            </p>
        </div>
      )}
    </div>
  );
}