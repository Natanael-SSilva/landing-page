// src/app/(app)/blog/layout.tsx
import { Sidebar } from "@/components/blog/Sidebar"; // Criaremos este componente a seguir

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">

        {/* Coluna da Barra Lateral (Sidebar) */}
        <aside className="lg:col-span-1">
          <Sidebar />
        </aside>

        {/* Coluna do Conteúdo Principal */}
        <main className="lg:col-span-3">
          {children} {/* Aqui é onde a lista de posts ou um post individual aparecerá */}
        </main>

      </div>
    </div>
  );
}