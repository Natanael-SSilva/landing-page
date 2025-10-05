// src/app/login/page.tsx
'use client';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Link from 'next/link';
import { signIn } from 'next-auth/react'; // A função mágica do Next-Auth

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

// Schema de validação para o formulário de login
const formSchema = z.object({
  email: z.string().email({ message: 'E-mail inválido.' }),
  password: z.string().min(1, { message: 'A senha é obrigatória.' }),
});

export default function LoginPage() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '', password: '' },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Usamos a função signIn do Next-Auth
      const result = await signIn('credentials', {
        ...values,
        redirect: false, // Importante: não redireciona automaticamente
      });

      if (result?.error) {
        // Se o Next-Auth retornar um erro (ex: senha errada), mostramos
        throw new Error('Credenciais inválidas. Verifique seu e-mail e senha.');
      }

      toast.success('Login bem-sucedido!', {
        description: 'Você será redirecionado em breve.',
      });

      // Redireciona para a página principal do blog após o login
      router.push('/blog'); 

    } catch (error: any) {
      toast.error('Erro no login.', {
        description: error.message || 'Por favor, tente novamente.',
      });
    }
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold tracking-tight">
              Acesse sua Conta
            </CardTitle>
            <CardDescription>
              Não tem uma conta?{' '}
              <Link href="/register" className="font-medium text-primary hover:underline">
                Cadastre-se
              </Link>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl><Input type="email" placeholder="seu@email.com" {...field} disabled={isSubmitting} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="password" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl><Input type="password" placeholder="••••••••" {...field} disabled={isSubmitting} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Entrando...' : 'Entrar'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}