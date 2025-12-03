// src/components/blog/CommentsSection.tsx
'use client';

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { CommentList } from './CommentList';
import { CommentForm } from './CommentForm';
import { Button } from "@/components/ui/button";

// O tipo 'CommentWithAuthor' que define a estrutura de um comentário
export type CommentWithAuthor = {
  id: string;
  text: string;
  createdAt: string;
  isPinned: boolean;
  author: {
    id: string; // Garantindo que o ID do autor está no tipo
    name: string | null;
    image: string | null;
    role: "USER" | "ADMIN";
  };
  parentId: string | null;
  replies?: CommentWithAuthor[];
};

interface CommentsSectionProps {
  postId: string;
}

export function CommentsSection({ postId }: CommentsSectionProps) {
  const { data: session, status } = useSession();
  const [comments, setComments] = useState<CommentWithAuthor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Efeito para buscar os comentários iniciais da API
  useEffect(() => {
    async function fetchComments() {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/posts/${postId}/comments`);
        if (!response.ok) throw new Error("Falha ao carregar comentários.");

        const data: CommentWithAuthor[] = await response.json();

        // Lógica para aninhar os comentários
        const commentMap: { [key: string]: CommentWithAuthor } = {};
        const rootComments: CommentWithAuthor[] = [];

        data.forEach(comment => {
          comment.replies = [];
          commentMap[comment.id] = comment;
        });

        data.forEach(comment => {
          if (comment.parentId) {
            const parent = commentMap[comment.parentId];
            if (parent) {
              parent.replies?.push(comment);
            }
          } else {
            rootComments.push(comment);
          }
        });
        
        setComments(rootComments);

      } catch (error) {
        toast.error("Erro ao carregar os comentários.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchComments();
  }, [postId]);

  // Função de callback para adicionar um novo comentário ao estado
  const handleCommentPosted = (newComment: CommentWithAuthor) => {
    const addReplyToState = (
      existingComments: CommentWithAuthor[],
      reply: CommentWithAuthor
    ): CommentWithAuthor[] => {
      return existingComments.map(comment => {
        if (comment.id === reply.parentId) {
          return { ...comment, replies: [...(comment.replies || []), reply] };
        }
        if (comment.replies && comment.replies.length > 0) {
          return { ...comment, replies: addReplyToState(comment.replies, reply) };
        }
        return comment;
      });
    };

    setComments(prevComments => {
      if (newComment.parentId) {
        return addReplyToState(prevComments, newComment);
      } else {
        return [...prevComments, newComment];
      }
    });
  };

  // NOVA FUNÇÃO para remover um comentário do estado de forma reativa
  const handleCommentDeleted = (commentId: string) => {
    const removeCommentFromState = (comments: CommentWithAuthor[]): CommentWithAuthor[] => {
      return comments
        .filter(comment => comment.id !== commentId) // Remove o comentário no nível atual
        .map(comment => {
          // Se o comentário tiver respostas, chama a função recursivamente
          if (comment.replies && comment.replies.length > 0) {
            return { ...comment, replies: removeCommentFromState(comment.replies) };
          }
          return comment;
        });
    };

    setComments(prevComments => removeCommentFromState(prevComments));
  };

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold mb-6">Comentários</h2>
      
      {/* Seção do Formulário de Comentário Principal */}
      <div className="mb-8">
        {status === 'authenticated' ? (
          <CommentForm postId={postId} onCommentPosted={handleCommentPosted} />
        ) : status === 'loading' ? (
           <Skeleton className="h-24 w-full rounded-lg" />
        ) : (
          <div className="text-center border rounded-lg p-6">
            <p className="text-muted-foreground mb-4">Você precisa estar logado para comentar.</p>
            <Button asChild>
              <Link href="/login">Fazer Login</Link>
            </Button>
          </div>
        )}
      </div>

      {/* Seção da Lista de Comentários */}
      {isLoading ? (
        <div className="space-y-6">
          <Skeleton className="h-24 w-full rounded-lg" />
          <Skeleton className="h-24 w-full rounded-lg" />
        </div>
      ) : (
        <div>
          {comments.length > 0 ? (
            // Passando a nova função 'handleCommentDeleted' para a lista
            <CommentList
              comments={comments}
              postId={postId}
              onCommentPosted={handleCommentPosted}
              onCommentDeleted={handleCommentDeleted}
            />
          ) : (
            <p className="text-center text-muted-foreground pt-8">Seja o primeiro a comentar!</p>
          )}
        </div>
      )}
    </div>
  );
}