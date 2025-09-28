// src/components/ContactSection.tsx
"use client"

import { useState } from 'react';
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";

// Schema de validação do formulário com Zod
const formSchema = z.object({
  name: z.string().min(2, { message: "O nome deve ter pelo menos 2 caracteres." }),
  email: z.string().email({ message: "Por favor, insira um endereço de e-mail válido." }),
  message: z.string().min(10, { message: "A mensagem deve ter pelo menos 10 caracteres." }),
});

export function ContactSection() {
  // Estado para controlar o status de envio do formulário
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Definição do formulário com React Hook Form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  // Função que lida com o envio dos dados para a nossa API
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true); // Ativa o estado de "enviando"

    try {
      // Faz uma requisição POST para a nossa API Route
      const response = await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        // Se a resposta for bem-sucedida, mostra notificação de sucesso
        toast.success("Mensagem Enviada!", {
          description: "Obrigado por entrar em contato. Responderei em breve.",
        });
        form.reset(); // Limpa o formulário
      } else {
        // Se houver um erro na resposta do servidor, lança um erro
        throw new Error('Falha ao enviar a mensagem.');
      }
    } catch (error) {
      // Em caso de erro, mostra notificação de falha
      toast.error("Erro!", {
        description: "Houve um problema ao enviar sua mensagem. Tente novamente mais tarde.",
      });
    } finally {
      // Garante que o estado de "enviando" seja desativado, independentemente do resultado
      setIsSubmitting(false);
    }
  }

  return (
    <section id="contact" className="w-full py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Entre em Contato</h2>
          <p className="text-muted-foreground mb-8">
            Tem uma pergunta ou quer trabalhar junto? Preencha o formulário abaixo.
          </p>
        </div>
        
        <Card className="max-w-xl mx-auto bg-card">
          <CardContent className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input placeholder="Seu Nome" {...field} disabled={isSubmitting} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="seu@email.com" {...field} disabled={isSubmitting} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mensagem</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Como posso te ajudar?" className="resize-none" {...field} disabled={isSubmitting} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Enviando...' : 'Enviar Mensagem'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}