// src/components/admin/EditPostForm.tsx
'use client';

// Todos os imports que tínhamos antes na página de edição
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import { Post } from '@prisma/client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';

// O schema do formulário continua o mesmo
const formSchema = z.object({
  title: z.string().min(3, { message: 'O título é obrigatório.' }),
  slug: z.string().min(3, { message: 'O slug é obrigatório.' }).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  content: z.string().min(10, { message: 'O conteúdo é obrigatório.' }),
  imageUrl: z.string().url().optional().or(z.literal('')),
  published: z.boolean(),
});

// Componente de placeholder para o editor
function EditorSkeleton() {
  return (
    <div className="border rounded-md p-4">
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-muted rounded w-1/3"></div>
        <div className="h-20 bg-muted rounded w-full"></div>
      </div>
    </div>
  )
}

// O formulário agora é um componente separado que recebe os dados do post
export function EditPostForm({ post }: { post: Post }) {
  const router = useRouter();

  const TiptapEditor = useMemo(() => {
    return dynamic(() => import('@/components/TiptapEditor').then(mod => mod.TiptapEditor), {
      ssr: false,
      loading: () => <EditorSkeleton />,
    });
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    // AQUI ESTÁ A MÁGICA: Preenchemos o formulário com os dados recebidos via props
    defaultValues: {
      title: post.title,
      slug: post.slug,
      content: post.content,
      imageUrl: post.imageUrl || '',
      published: post.published,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch(`/api/posts/${post.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error('Falha ao atualizar o post.');

      toast.success('Post atualizado com sucesso!');
      router.push('/admin/dashboard');
      router.refresh();
    } catch (error) {
      toast.error('Erro ao atualizar o post.');
    }
  }

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Editar Post</CardTitle>
        </CardHeader>
        <CardContent>
          {/* O JSX do formulário é o mesmo de antes */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField control={form.control} name="title" render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="slug" render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="content" render={({ field }) => (
                <FormItem>
                  <FormLabel>Conteúdo</FormLabel>
                  <FormControl>
                    <TiptapEditor value={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="imageUrl" render={({ field }) => (
                <FormItem>
                  <FormLabel>URL da Imagem (Opcional)</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="published" render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div>
                    <FormLabel className="text-base">Publicar?</FormLabel>
                    <FormDescription>Se ativado, o post ficará visível para todos no blog.</FormDescription>
                  </div>
                  <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                </FormItem>
              )} />
              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => router.push('/admin/dashboard')}>Cancelar</Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}