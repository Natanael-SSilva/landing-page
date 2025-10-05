// src/app/api/upload/route.ts
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

// A configuração via CLOUDINARY_URL é automática, então não precisamos do bloco config.

export async function POST(request: Request) {
  // Proteção de Rota
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse("Não autorizado", { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return new NextResponse("Nenhum arquivo enviado.", { status: 400 });
  }

  // Convertendo o arquivo para um buffer
  const fileBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(fileBuffer);

  // Usando uma Promise para lidar com o stream de upload
  try {
    const url = await new Promise<string>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'blog_posts', // Pasta no Cloudinary
          resource_type: 'auto', // Detecta o tipo de arquivo
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary Error:", error);
            reject(new Error("Falha no upload para o Cloudinary."));
          }
          if (result) {
            resolve(result.secure_url);
          }
        }
      );

      // Escreve o buffer no stream e finaliza
      uploadStream.end(buffer);
    });

    // Retorna a URL segura se o upload for bem-sucedido
    return NextResponse.json({ url });

  } catch (error) {
    console.error("[UPLOAD_STREAM_ERROR]", error);
    // O erro agora pode ser mais específico
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido.";
    return new NextResponse(errorMessage, { status: 500 });
  }
}