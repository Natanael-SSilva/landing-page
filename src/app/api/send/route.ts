// src/app/api/send/route.ts
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

    const data = await resend.emails.send({
      from: 'Contato Portfolio <contato@natanaelsilva.com.br>',
      to: ['desenvolvedor@natanaelsilva.com.br'], // Lembre-se de colocar seu e-mail pessoal aqui
      subject: `Nova Mensagem de ${name} via natanaelsilva.com.br`,
      
      replyTo: email, 
      
      html: `<p>Você recebeu uma nova mensagem do seu formulário de contato.</p>
             <p><strong>Nome:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Mensagem:</strong></p>
             <p>${message}</p>`,
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error });
  }
}