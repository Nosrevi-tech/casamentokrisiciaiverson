import React, { useState } from 'react';
import { Menu, X, Heart, Settings } from 'lucide-react';

interface HeaderProps {
  onAdminClick?: () => void;
}

export default function Header({ onAdminClick }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <header className="fixed top-0 w-full bg-white/95 backdrop-blur-md z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Heart className="w-6 h-6 text-primary-500" />
            <span className="text-xl font-serif text-sage-600">Kriscia e Iverson</span>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <button onClick={() => scrollToSection('inicio')} className="text-stone-600 hover:text-primary-500 transition-colors">
              Início
            </button>
            <button onClick={() => scrollToSection('nossa-historia')} className="text-stone-600 hover:text-primary-500 transition-colors">
              Nossa História
            </button>
            <button onClick={() => scrollToSection('enderecos')} className="text-stone-600 hover:text-primary-500 transition-colors">
              Endereços
            </button>
            <button onClick={() => scrollToSection('presentes')} className="text-stone-600 hover:text-primary-500 transition-colors">
              Presentes
            </button>
            <button onClick={() => scrollToSection('presenca')} className="text-stone-600 hover:text-primary-500 transition-colors">
              Confirmar Presença
            </button>
            {onAdminClick && (
              <button onClick={onAdminClick} className="text-stone-600 hover:text-primary-500 transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            )}
          </nav>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-stone-600 hover:text-primary-500 transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-rose-200">
            <nav className="flex flex-col space-y-4">
              <button onClick={() => scrollToSection('inicio')} className="text-stone-600 hover:text-primary-500 transition-colors text-left">
                Início
              </button>
              <button onClick={() => scrollToSection('nossa-historia')} className="text-stone-600 hover:text-primary-500 transition-colors text-left">
                Nossa História
              </button>
              <button onClick={() => scrollToSection('enderecos')} className="text-stone-600 hover:text-primary-500 transition-colors text-left">
                Endereços
              </button>
              <button onClick={() => scrollToSection('presentes')} className="text-stone-600 hover:text-primary-500 transition-colors text-left">
                Presentes
              </button>
              <button onClick={() => scrollToSection('presenca')} className="text-stone-600 hover:text-primary-500 transition-colors text-left">
                Confirmar Presença
              </button>
              {onAdminClick && (
                <button onClick={onAdminClick} className="text-stone-600 hover:text-primary-500 transition-colors text-left">
                  Admin
                </button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}