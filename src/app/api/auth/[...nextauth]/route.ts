// src/app/api/auth/[...nextauth]/route.ts
import NextAuth, { type AuthOptions } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "@/lib/prisma"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { Adapter } from "next-auth/adapters"

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user) {
          return null;
        }

        const passwordsMatch = await bcrypt.compare(credentials.password, user.password);

        if (!passwordsMatch) {
          return null;
        }
        
        return user;
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  
  // Callbacks para enriquecer o token JWT e a sessão com dados do usuário
  callbacks: {
    // O callback 'jwt' é chamado sempre que um token JWT é criado ou atualizado.
    async jwt({ token, user }) {
      // Se o objeto 'user' existir (acontece no momento do login),
      // adicionamos seus dados (id e role) ao token.
      if (user) {
        token.id = user.id;
        // @ts-ignore - O tipo do 'user' do authorize é um pouco diferente
        token.role = user.role;
      }
      return token;
    },
    // O callback 'session' é chamado sempre que uma sessão é acessada.
    session({ session, token }) {
      // Adicionamos os dados do token (que pegamos no callback 'jwt') 
      // ao objeto session.user, tornando-os disponíveis no front-end.
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as any; // Adapte o tipo conforme seu enum Role
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };