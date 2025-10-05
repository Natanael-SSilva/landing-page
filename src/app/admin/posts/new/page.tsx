// src/app/admin/posts/new/page.tsx
'use client';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import dynamic from 'next/dynamic'; // 1. Importando o 'dynamic' do Next.js
import { useMemo } from 'react'; // Importando o 'useMemo' do React

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';

// Schema de validação do formulário
const formSchema = z.object({
  title: z.string().min(3, { message: 'O título deve ter pelo menos 3 caracteres.' }),
  slug: z.string().min(3, { message: 'O slug deve ter pelo menos 3 caracteres.' })
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: 'Slug inválido. Use apenas letras minúsculas, números e hífens.' }),
  content: z.string().min(10, { message: 'O conteúdo deve ter pelo menos 10 caracteres.' }),
  imageUrl: z.string().url({ message: 'URL da imagem inválida.' }).optional().or(z.literal('')),
  published: z.boolean(),
});

// 2. Componente de placeholder para exibir enquanto o editor carrega
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

export default function NewPostPage() {
  const router = useRouter();
  
  // 3. Carrega o TiptapEditor dinamicamente para evitar erros de SSR
  const TiptapEditor = useMemo(() => {
    return dynamic(() => import('@/components/TiptapEditor').then(mod => mod.TiptapEditor), {
      ssr: false, // Garante que o componente só renderize no cliente
      loading: () => <EditorSkeleton />, // Mostra o skeleton durante o carregamento
    });
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      slug: '',
      content: '',
      imageUrl: '',
      published: false,
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || 'Falha ao criar o post.');
      }

      toast.success('Post criado com sucesso!');
      router.push('/admin/dashboard');
      router.refresh(); 
    } catch (error: any) {
      toast.error('Erro ao criar post.', {
        description: error.message || 'Por favor, tente novamente.',
      });
    }
  }

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Criar Novo Post</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField control={form.control} name="title" render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl><Input placeholder="Título do seu post" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              
              <FormField control={form.control} name="slug" render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl><Input placeholder="titulo-do-seu-post" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Conteúdo</FormLabel>
                    <FormControl>
                      {/* 4. O editor dinâmico é usado aqui */}
                      <TiptapEditor value={field.value} onChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField control={form.control} name="imageUrl" render={({ field }) => (
                <FormItem>
                  <FormLabel>URL da Imagem (Opcional)</FormLabel>
                  <FormControl><Input placeholder="https://exemplo.com/imagem.png" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="published" render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div>
                    <FormLabel className="text-base">Publicar?</FormLabel>
                    <FormDescription>
                      Se ativado, o post ficará visível para todos no blog.
                    </FormDescription>
                  </div>
                  <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                </FormItem>
              )} />

              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => router.push('/admin/dashboard')}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Salvando...' : 'Salvar Post'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}