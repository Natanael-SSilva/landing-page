// src/types/next-auth.d.ts
import NextAuth, { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"
import { Role } from "@prisma/client" // Importa nosso enum Role do Prisma

declare module "next-auth" {
  /**
   * Estendendo o tipo da Sessão para incluir id e role
   */
  interface Session {
    user: {
      id: string;
      role: Role;
    } & DefaultSession["user"] // Mantém as propriedades padrão (name, email, image)
  }
}

declare module "next-auth/jwt" {
  /**
   * Estendendo o tipo do Token JWT para incluir id e role
   */
  interface JWT {
    id: string;
    role: Role;
  }
}