// middleware.ts
// Este import vem direto do Next-Auth
export { default } from "next-auth/middleware"

// O matcher define quais rotas serão protegidas pelo middleware
export const config = { 
  // Protegeremos a página principal do blog e todas as páginas de posts individuais
  matcher: [
    "/blog", 
    "/blog/:path*",
    "/admin/:path*", // Já vamos deixar a futura rota de admin protegida
  ] 
}