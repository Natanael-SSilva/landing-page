// src/components/Toolbar.tsx
'use client';

import { type Editor } from '@tiptap/react';
import { 
  Bold, Italic, Strikethrough, Heading2, Image as ImageIcon, 
  AlignLeft, AlignCenter, AlignRight 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChangeEvent, useCallback, useRef } from 'react';
import { toast } from 'sonner';

interface ToolbarProps {
  editor: Editor;
}

export function Toolbar({ editor }: ToolbarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    toast.loading("Enviando imagem...", { id: 'image-upload' });

    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Falha no upload da imagem.');
      const data = await response.json();
      const { url } = data; 

      if (url) {
        editor.chain().focus().setImage({ src: url }).run();
        toast.success("Imagem enviada com sucesso!", { id: 'image-upload' });
      }
    } catch (error) {
      console.error("Erro ao fazer upload da imagem:", error);
      toast.error("Erro ao fazer upload.", { id: 'image-upload' });
    } finally {
      if(event.target) {
        event.target.value = '';
      }
    }
  }, [editor]);
  
  if (!editor) {
    return null;
  }

  return (
    <div className="border-b p-2 flex items-center gap-1 flex-wrap">
      {/* --- GRUPO: FORMATAÇÃO DE TEXTO --- */}
      <Button type="button" variant={editor.isActive('bold') ? 'default' : 'ghost'} size="icon" onClick={() => editor.chain().focus().toggleBold().run()}>
        <Bold className="w-4 h-4" />
      </Button>
      <Button type="button" variant={editor.isActive('italic') ? 'default' : 'ghost'} size="icon" onClick={() => editor.chain().focus().toggleItalic().run()}>
        <Italic className="w-4 h-4" />
      </Button>
      <Button type="button" variant={editor.isActive('strike') ? 'default' : 'ghost'} size="icon" onClick={() => editor.chain().focus().toggleStrike().run()}>
        <Strikethrough className="w-4 h-4" />
      </Button>
      <Button type="button" variant={editor.isActive('heading', { level: 2 }) ? 'default' : 'ghost'} size="icon" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
        <Heading2 className="w-4 h-4" />
      </Button>
      
      {/* --- GRUPO: MÍDIA --- */}
      <Button type="button" variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()}>
        <ImageIcon className="w-4 h-4" />
      </Button>
      
      {/* --- GRUPO: ALINHAMENTO DE BLOCO --- */}
      <Button type="button" variant={editor.isActive({ textAlign: 'left' }) ? 'default' : 'ghost'} size="icon" onClick={() => editor.chain().focus().setTextAlign('left').run()}>
        <AlignLeft className="w-4 h-4" />
      </Button>
      <Button type="button" variant={editor.isActive({ textAlign: 'center' }) ? 'default' : 'ghost'} size="icon" onClick={() => editor.chain().focus().setTextAlign('center').run()}>
        <AlignCenter className="w-4 h-4" />
      </Button>
      <Button type="button" variant={editor.isActive({ textAlign: 'right' }) ? 'default' : 'ghost'} size="icon" onClick={() => editor.chain().focus().setTextAlign('right').run()}>
        <AlignRight className="w-4 h-4" />
      </Button>

      {/* Input de arquivo escondido */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/png, image/jpeg, image/gif, image/webp"
      />
    </div>
  );
}