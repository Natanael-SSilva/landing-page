// src/components/blog/CommentForm.tsx
'use client';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CommentWithAuthor } from './CommentsSection';

// Schema de validação para o formulário
const formSchema = z.object({
  text: z.string().min(1, { message: 'O comentário não pode estar vazio.' }).max(1000, { message: 'O comentário não pode exceder 1000 caracteres.' }),
});

interface CommentFormProps {
  postId: string;
  parentId?: string; // Opcional, para futuras respostas
  onCommentPosted: (newComment: CommentWithAuthor) => void; // Callback para atualizar a UI
}

export function CommentForm({ postId, parentId, onCommentPosted }: CommentFormProps) {
  const { data: session } = useSession();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { text: '' },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: values.text,
          parentId, // Envia o parentId se for uma resposta
        }),
      });

      if (!response.ok) throw new Error('Falha ao postar o comentário.');

      const newComment = await response.json();
      
      toast.success('Comentário postado com sucesso!');
      form.reset(); // Limpa o formulário
      onCommentPosted(newComment); // Chama a função do componente pai para atualizar a lista
      
    } catch (error) {
      toast.error('Erro ao postar comentário.');
    }
  }

  return (
    <div className="flex items-start space-x-4">
      <Avatar>
        <AvatarImage src={session?.user?.image || undefined} />
        <AvatarFallback>{session?.user?.name?.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
          <FormField
            control={form.control}
            name="text"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    placeholder="Deixe seu comentário..."
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Postando...' : 'Postar Comentário'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}