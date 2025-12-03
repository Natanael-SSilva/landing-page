// src/components/blog/CommentItem.tsx
'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { CommentWithAuthor } from './CommentsSection';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pin, ShieldCheck } from 'lucide-react';
import { CommentForm } from './CommentForm';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Textarea } from '../ui/textarea';

// Schema de validação para o formulário de edição
const editFormSchema = z.object({
  text: z.string().min(1, { message: "O comentário não pode estar vazio." }),
});

interface CommentItemProps {
  comment: CommentWithAuthor;
  postId: string;
  onCommentPosted: (newComment: CommentWithAuthor) => void;
  onCommentDeleted: (commentId: string) => void;
}

export function CommentItem({ comment, postId, onCommentPosted, onCommentDeleted }: CommentItemProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const canModify = status === 'authenticated' && (session.user.id === comment.author.id || session.user.role === 'ADMIN');

  const formattedDate = new Date(comment.createdAt).toLocaleDateString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  // Configuração do formulário de edição
  const form = useForm<z.infer<typeof editFormSchema>>({
    resolver: zodResolver(editFormSchema),
    defaultValues: { text: comment.text },
  });

  // Função para submeter a edição do comentário
  async function handleEditSubmit(values: z.infer<typeof editFormSchema>) {
    try {
      const response = await fetch(`/api/comments/${comment.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      if (!response.ok) throw new Error("Falha ao editar o comentário.");
      
      toast.success("Comentário atualizado com sucesso!");
      setIsEditing(false); // Fecha o formulário de edição
      router.refresh(); // Atualiza os dados da página para refletir a mudança
    } catch (error) {
      toast.error("Erro ao editar o comentário.");
    }
  }

  // Função para deletar o comentário
  async function handleDelete() {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/comments/${comment.id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error("Falha ao deletar o comentário.");
      
      toast.success("Comentário deletado com sucesso!");
      onCommentDeleted(comment.id);
      
    } catch (error) {
      toast.error("Erro ao deletar o comentário.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="flex items-start space-x-4">
      <Avatar>
        <AvatarImage src={comment.author.image || undefined} />
        <AvatarFallback>{comment.author.name?.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <p className="font-semibold">{comment.author.name}</p>
          {comment.author.role === 'ADMIN' && <Badge variant="secondary" className="px-1.5 py-0 text-xs"><ShieldCheck className="w-3 h-3 mr-1" /> Admin</Badge>}
          {comment.isPinned && <Badge variant="outline" className="px-1.5 py-0 text-xs text-primary"><Pin className="w-3 h-3 mr-1" /> Fixado</Badge>}
          <span className="text-xs text-muted-foreground ml-auto">{formattedDate}</span>
        </div>

        {/* Renderização condicional: ou mostra o texto, ou o formulário de edição */}
        {!isEditing ? (
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{comment.text}</p>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleEditSubmit)} className="space-y-4 mt-2">
              <FormField
                control={form.control}
                name="text"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea className="resize-y min-h-[80px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-2">
                <Button type="button" variant="ghost" size="sm" onClick={() => setIsEditing(false)}>Cancelar</Button>
                <Button type="submit" size="sm" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? 'Salvando...' : 'Salvar'}
                </Button>
              </div>
            </form>
          </Form>
        )}

        {/* Botões de Ação (só aparecem se não estiver no modo de edição) */}
        {!isEditing && status === 'authenticated' && (
          <div className="flex items-center gap-2 mt-2">
            <Button variant="ghost" size="sm" className="text-xs" onClick={() => setIsReplying(!isReplying)}>
              {isReplying ? 'Cancelar' : 'Responder'}
            </Button>
            {canModify && (
              <>
                <Button variant="ghost" size="sm" className="text-xs" onClick={() => { form.reset({ text: comment.text }); setIsEditing(true); }}>Editar</Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-xs text-destructive hover:text-destructive">Excluir</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader><AlertDialogTitle>Você tem certeza?</AlertDialogTitle><AlertDialogDescription>Esta ação não pode ser desfeita e irá remover o comentário permanentemente.</AlertDialogDescription></AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
                        {isDeleting ? 'Excluindo...' : 'Confirmar Exclusão'}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            )}
          </div>
        )}

        {/* Formulário de Resposta */}
        {isReplying && (
          <div className="mt-4">
            <CommentForm
              postId={postId}
              parentId={comment.id}
              onCommentPosted={(newReply) => {
                onCommentPosted(newReply);
                setIsReplying(false);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}