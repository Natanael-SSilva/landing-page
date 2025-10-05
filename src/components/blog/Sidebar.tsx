// src/components/blog/Sidebar.tsx
'use client'; // Necessário para usar hooks como o useSession

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from '@/components/ui/button';
import { LogIn, LogOut } from 'lucide-react';

export function Sidebar() {
  // Pega o status da sessão do usuário
  const { data: session, status } = useSession();
  const isLoading = status === 'loading';

  return (
    <div className="space-y-8 sticky top-24">
      
      {/* Card do Autor/Usuário */}
      <Card>
        <CardHeader className="items-center text-center">
          <Avatar className="w-24 h-24 mb-4">
            {/* Se o usuário estiver logado, mostra a imagem dele (se tiver), senão, a padrão */}
            <AvatarImage src={session?.user?.image || "/profile.png"} alt="Foto do Usuário" />
            <AvatarFallback>{session?.user?.name?.charAt(0) || 'N'}</AvatarFallback>
          </Avatar>
          {/* Mostra o nome do usuário logado ou o nome padrão */}
          <CardTitle>{session?.user?.name || 'Natanael S. Silva'}</CardTitle>
        </CardHeader>
        <CardContent className="text-center text-sm text-muted-foreground">
          <p>Este é o meu blog pessoal, um lugar para compartilhar ideias, projetos e atualizações.</p>
          
          {/* Botão de Login/Logout */}
          <div className="mt-6">
            {isLoading ? (
              <Button className="w-full" disabled>Carregando...</Button>
            ) : session ? (
              <Button variant="outline" className="w-full" onClick={() => signOut()}>
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
            ) : (
              <Button asChild className="w-full">
                <Link href="/login"><LogIn className="mr-2 h-4 w-4" /> Login</Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
         <CardHeader>
          <CardTitle className="text-lg">Tags</CardTitle>
        </CardHeader>
         <CardContent>
          <p className="text-sm text-muted-foreground">Em breve...</p>
        </CardContent>
      </Card>
    </div>
  );
}