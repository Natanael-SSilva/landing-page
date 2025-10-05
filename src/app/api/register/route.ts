// src/app/api/register/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, password } = body;

    // 1. Validação básica dos dados recebidos
    if (!email || !name || !password) {
      return new NextResponse('Dados inválidos, preencha todos os campos.', { status: 400 });
    }

    // 2. Verifica se o usuário já existe no banco de dados
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return new NextResponse('Este e-mail já está em uso.', { status: 409 }); // 409 Conflict
    }

    // 3. Criptografa a senha antes de salvar
    const hashedPassword = await bcrypt.hash(password, 12);

    // 4. Cria o novo usuário no banco de dados
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    // 5. Retorna o usuário criado (sem a senha)
    return NextResponse.json({ ...user, password: '' });

  } catch (error) {
    console.error('[REGISTRATION_ERROR]', error);
    return new NextResponse('Erro Interno do Servidor', { status: 500 });
  }
}