// src/components/Navbar.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle'; // 1. Importando o componente de alternância de tema

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  // Efeito para detectar o scroll da página e mudar o fundo do Navbar
  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Links de navegação da landing page
  const navLinks = [
    { name: 'Sobre', href: '#about' },
    { name: 'Serviços', href: '#services' },
    { name: 'Projetos', href: '#projects' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        hasScrolled ? 'bg-background/90 backdrop-blur-sm shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        {/* Logo/Nome */}
        <Link href="/" className="text-2xl font-bold text-foreground">
          Seu Nome
        </Link>

        {/* Navegação para Desktop */}
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-muted-foreground transition-colors hover:text-primary"
            >
              {link.name}
            </Link>
          ))}
          <Link href="/blog">
            <Button variant="outline">Blog</Button>
          </Link>
          <Link href="#contact">
            <Button>Contato</Button>
          </Link>

          {/* 2. Adicionando o botão de alternância de tema */}
          <ThemeToggle />
        </nav>

        {/* Botão do Menu Mobile */}
        <div className="md:hidden">
          <Button onClick={() => setIsMenuOpen(!isMenuOpen)} variant="ghost" size="icon">
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Menu Dropdown Mobile */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-t">
          <nav className="flex flex-col items-center space-y-4 p-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-muted-foreground transition-colors hover:text-primary text-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <Link href="/blog" className="w-full">
              <Button variant="outline" className="w-full" onClick={() => setIsMenuOpen(false)}>Blog</Button>
            </Link>
            <Link href="#contact" className="w-full">
              <Button className="w-full" onClick={() => setIsMenuOpen(false)}>Contato</Button>
            </Link>
            
            {/* 3. Adicionando o botão de alternância de tema também no menu mobile */}
            <div className="pt-4">
              <ThemeToggle />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}