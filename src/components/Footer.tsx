// src/components/Footer.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Github, Linkedin } from "lucide-react";

export function Footer() {
  // Pega o ano atual dinamicamente para o aviso de copyright
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-border/40">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-8 md:flex-row md:px-6">

        {/* Aviso de Copyright */}
        <p className="text-sm text-muted-foreground">
          &copy; {currentYear} Natanael S. Silva. Todos os direitos reservados.
        </p>

        {/* Links para Redes Sociais */}
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="icon">
            {/* Lembre-se de atualizar com o link do seu GitHub */}
            <Link href="https://github.com/Natanael-SSilva" target="_blank">
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </Link>
          </Button>
          <Button asChild variant="ghost" size="icon">
            {/* Lembre-se de atualizar com o link do seu LinkedIn */}
            <Link href="https://linkedin.com/in/natanael-santos-274709223" target="_blank">
              <Linkedin className="h-5 w-5" />
              <span className="sr-only">LinkedIn</span>
            </Link>
          </Button>
        </div>

      </div>
    </footer>
  );
}