import React from 'react';
import { Heart, Instagram, Facebook, Mail, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-sage-600 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <Heart className="w-8 h-8 text-primary-500" />
            <span className="text-3xl font-serif">Kriscia e Iverson</span>
          </div>
          <p className="text-rose-200 text-lg">
            Obrigado por fazer parte da nossa história de amor
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4">Contato dos Noivos</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-center space-x-2">
                <Phone className="w-4 h-4 text-primary-500" />
                <span className="text-rose-200">Kriscia: (32) 98419-5866</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Phone className="w-4 h-4 text-primary-500" />
                <span className="text-rose-200">Iverson: (32) 98430-3090</span>
              </div>
                 <div className="flex items-center justify-center space-x-2">
                <Mail className="w-4 h-4 text-primary-500" />
                <span className="text-rose-200"></span>
              </div>
            </div>
          </div>

          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4">Redes Sociais</h3>
            <div className="flex justify-center space-x-4">
              <a href="#" className="bg-primary-500 p-3 rounded-full hover:bg-primary-600 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="bg-primary-500 p-3 rounded-full hover:bg-primary-600 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
            <p className="text-rose-200 mt-4 text-sm">
              Siga nossa jornada: @iverson.paiva 
            </p>
            <p className="text-rose-200  text-sm">
              @kriscia.cruz
            </p>
          </div>

          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4">Informações Importantes</h3>
            <div className="space-y-2 text-rose-200">
              <p>Data: 27 de Julho, 2026</p>
              <p>Horário: 17h às 2h</p>
              <p>Dress Code: Social</p>
              <p>Confirmação até: 15/05/2024</p>
            </div>
          </div>
        </div>

        <div className="border-t border-sage-500 pt-8 text-center">
          <p className="text-rose-300">
            © 2024 Kriscia & Iverson. Feito com muito amor para nosso dia especial.
          </p>
        </div>
      </div>
    </footer>
  );
}