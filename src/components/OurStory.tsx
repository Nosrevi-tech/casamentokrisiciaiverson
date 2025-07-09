import React from 'react';
import { Heart, Users, Sparkles } from 'lucide-react';

export default function OurStory() {
  return (
    <section id="nossa-historia" className="py-20 bg-gradient-to-br from-rose-100 to-rose-200 relative overflow-hidden">
      {/* Fundo com flores decorativas */}
      <div className="absolute inset-0 opacity-20">
        {/* Flores grandes */}
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-gradient-to-br from-rose-300 to-rose-400 blur-xl"></div>
        <div className="absolute top-20 right-20 w-24 h-24 rounded-full bg-gradient-to-br from-red-300 to-red-400 blur-lg"></div>
        <div className="absolute bottom-20 left-20 w-28 h-28 rounded-full bg-gradient-to-br from-rose-400 to-rose-500 blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-20 h-20 rounded-full bg-gradient-to-br from-red-400 to-red-500 blur-lg"></div>
        
        {/* Flores médias */}
        <div className="absolute top-1/3 left-1/4 w-16 h-16 rounded-full bg-gradient-to-br from-rose-300 to-rose-400 blur-lg"></div>
        <div className="absolute top-1/2 right-1/3 w-20 h-20 rounded-full bg-gradient-to-br from-red-300 to-red-400 blur-lg"></div>
        <div className="absolute bottom-1/3 left-1/3 w-18 h-18 rounded-full bg-gradient-to-br from-rose-400 to-rose-500 blur-lg"></div>
        <div className="absolute top-2/3 right-1/4 w-14 h-14 rounded-full bg-gradient-to-br from-red-400 to-red-500 blur-lg"></div>
        
        {/* Flores pequenas */}
        <div className="absolute top-1/4 right-1/2 w-12 h-12 rounded-full bg-gradient-to-br from-rose-300 to-rose-400 blur-md"></div>
        <div className="absolute bottom-1/4 left-1/2 w-10 h-10 rounded-full bg-gradient-to-br from-red-300 to-red-400 blur-md"></div>
        <div className="absolute top-3/4 left-1/5 w-8 h-8 rounded-full bg-gradient-to-br from-rose-400 to-rose-500 blur-md"></div>
        <div className="absolute top-1/5 right-1/5 w-6 h-6 rounded-full bg-gradient-to-br from-red-400 to-red-500 blur-md"></div>
        
        {/* Pétalas espalhadas */}
        <div className="absolute top-1/6 left-2/3 w-4 h-8 rounded-full bg-gradient-to-br from-rose-300 to-rose-400 blur-sm rotate-45"></div>
        <div className="absolute bottom-1/6 right-2/3 w-6 h-12 rounded-full bg-gradient-to-br from-red-300 to-red-400 blur-sm rotate-12"></div>
        <div className="absolute top-2/5 left-1/6 w-3 h-6 rounded-full bg-gradient-to-br from-rose-400 to-rose-500 blur-sm -rotate-30"></div>
        <div className="absolute bottom-2/5 right-1/6 w-5 h-10 rounded-full bg-gradient-to-br from-red-400 to-red-500 blur-sm rotate-60"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif text-sage-600 mb-6">Nossa História</h2>
          <p className="text-xl text-stone-600 max-w-2xl mx-auto">
            Uma jornada de amor que começou com um olhar e se transformou em uma vida juntos
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-rose-200">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="bg-primary-500 p-3 rounded-full">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-serif text-sage-600">Como nos conhecemos</h3>
                </div>
                <p className="text-stone-600 leading-relaxed">
                  Foi em uma tarde de outono na universidade. Ana estava na biblioteca estudando para as provas finais, 
                  e Carlos, perdido entre os livros, pediu ajuda para encontrar um livro específico. 
                  Aquele encontro casual se transformou em horas de conversa e risadas.
                </p>
              </div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-rose-200">
              <div className="flex items-center space-x-4 mb-6">
                <div className="bg-primary-500 p-3 rounded-full">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-serif text-sage-600">Primeiros anos</h3>
              </div>
              <p className="text-stone-600 leading-relaxed">
                Desde o primeiro encontro, soubemos que éramos feitos um para o outro. 
                Compartilhamos sonhos, superamos desafios e crescemos juntos. 
                Cada momento ao lado dela/dele confirmava que havíamos encontrado nosso complemento perfeito.
              </p>
            </div>
          </div>

          <div className="text-center bg-white/90 backdrop-blur-sm rounded-2xl p-12 shadow-lg border border-rose-200">
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-r from-primary-500 to-rose-500 p-4 rounded-full">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
            </div>
            <h3 className="text-3xl font-serif text-sage-600 mb-6">O Pedido</h3>
            <p className="text-lg text-stone-600 max-w-3xl mx-auto leading-relaxed">
              Em uma noite estrelada no nosso lugar favorito, Carlos se ajoelhou e fez a pergunta que mudaria nossas vidas para sempre. 
              Com lágrimas nos olhos e o coração transbordando de amor, Ana disse "SIM!" e começamos a planejar o dia mais especial das nossas vidas.
              Agora, queremos compartilhar essa alegria com as pessoas mais importantes: vocês, nossa família e amigos queridos.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}