# Landing Page de Portfólio para Desenvolvedor Full-Stack

![Status](https://img.shields.io/badge/status-conclu%C3%ADdo-brightgreen)
![Licença](https://img.shields.io/badge/licen%C3%A7a-MIT-blue)

> Uma landing page moderna, responsiva e de alta performance para desenvolvedores de software, projetada para apresentar habilidades, exibir projetos e capturar leads de forma eficaz.

**[➡️ Ver Demonstração Ao Vivo](https://[natanaelsilva.com.br].com)** _(substitua este link após o deploy)_

---

## Tabela de Conteúdos

- [✨ Features](#-features)
- [🛠️ Tecnologias Utilizadas](#️-tecnologias-utilizadas)
- [🚀 Começando](#-começando)
- [🔧 Configuração de Ambiente](#-configuração-de-ambiente)
- [🚀 Deploy](#-deploy)
- [👤 Autor](#-autor)
- [📝 Licença](#-licença)

---

## ✨ Features

- **Design Moderno e Responsivo:** Totalmente adaptável para desktops, tablets e dispositivos móveis.
- **Tema Escuro Profissional:** Paleta de cores `Slate` do Shadcn/UI para uma estética tecnológica.
- **Componentes Reutilizáveis:** Construído com componentes da biblioteca Shadcn/UI.
- **Formulário de Contato Funcional:** Integração com **Resend** para envio de e-mails via API Route do Next.js, garantindo que você nunca perca um lead.
- **Validação de Formulário:** Validação robusta de dados de entrada com `Zod` e `React Hook Form`.
- **Notificações (Toasts):** Feedback visual para o usuário após o envio do formulário, utilizando `sonner`.
- **SEO Otimizado:** Metadados configurados no Layout principal para melhor ranqueamento.

---

## 🛠️ Tecnologias Utilizadas

Este projeto foi construído utilizando as seguintes tecnologias de ponta:

- **Framework:** [Next.js](https://nextjs.org/) (com App Router)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
- **Estilização:** [Tailwind CSS](https://tailwindcss.com/)
- **Componentes UI:** [Shadcn/UI](https://ui.shadcn.com/)
- **Formulários:** [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
- **Envio de E-mail:** [Resend](https://resend.com/)
- **Ícones:** [Lucide React](https://lucide.dev/)
- **Deploy:** [Vercel](https://vercel.com/)

---

## 🚀 Começando

Para executar este projeto localmente, siga os passos abaixo.

### Pré-requisitos

Você vai precisar ter o [Node.js](https://nodejs.org/) (versão 18 ou superior) e o [npm](https://www.npmjs.com/) instalados em sua máquina.

### Instalação

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/seu-usuario/nome-do-repositorio.git](https://github.com/seu-usuario/nome-do-repositorio.git)
    ```
2.  **Navegue até a pasta do projeto:**
    ```bash
    cd nome-do-repositorio
    ```
3.  **Instale as dependências:**
    ```bash
    npm install
    ```

---

## 🔧 Configuração de Ambiente

Para que o formulário de contato funcione, você precisa configurar suas variáveis de ambiente.

1.  **Crie um arquivo `.env.local`** na raiz do projeto.
2.  **Copie o conteúdo** do arquivo `.env.example` ou adicione as seguintes variáveis:

    ```env
    # .env.local

    # Chave de API obtida no painel do Resend.com
    RESEND_API_KEY=sua_chave_api_do_resend
    ```

3.  **Atualize o e-mail de destino** no arquivo `src/app/api/send/route.ts` para o seu endereço de e-mail pessoal.

### Executando o Projeto

Após a instalação e configuração, inicie o servidor de desenvolvimento:

```bash
npm run dev