// src/components/Navbar.tsx
'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react' // Importando os ícones que acabamos de instalar

export function Navbar() {
  // Estado para controlar a abertura do menu mobile
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  // Estado para controlar o fundo da navbar ao rolar a página
  const [hasScrolled, setHasScrolled] = useState(false)

  // Efeito para detectar o scroll da página
  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    // Limpeza do evento ao desmontar o componente
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: 'Sobre', href: '#about' },
    { name: 'Serviços', href: '#services' },
    { name: 'Projetos', href: '#projects' },
  ]

  return (
    <header
      // O fundo da navbar é dinâmico: transparente no topo, sólido ao rolar
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        hasScrolled ? 'bg-background/90 backdrop-blur-sm shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        {/* Logo/Nome */}
        <Link href="/" className="text-2xl font-bold text-foreground">
          Natanael S. Silva
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
          <Link href="#contact">
            <Button>Contato</Button>
          </Link>
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
                onClick={() => setIsMenuOpen(false)} // Fecha o menu ao clicar
              >
                {link.name}
              </Link>
            ))}
            <Link href="#contact">
              <Button onClick={() => setIsMenuOpen(false)} className="w-full">
                Contato
              </Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}