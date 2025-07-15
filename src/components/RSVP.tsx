import React from 'react';
import { ExternalLink, Users, Utensils, Music, Calendar, Clock, MapPin } from 'lucide-react';

export default function RSVP() {
  const handleGoToForm = () => {
    window.open('https://docs.google.com/forms/d/e/1FAIpQLSc2biD9rnLxcQW6Ck81bpM7O2aT2CQU0B_UGIwv2HIX_m-XIQ/viewform?usp=header', '_blank');
  };

  return (
    <section id="presenca" className="py-20 bg-gradient-to-br from-rose-50 to-rose-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif text-sage-600 mb-6">Confirme sua Presença</h2>
          <p className="text-xl text-stone-600 max-w-2xl mx-auto">
            Sua presença é fundamental para tornar nosso dia ainda mais especial. 
            Por favor, confirme sua presença através do nosso formulário.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Card Principal */}
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="flex justify-center mb-8">
              <div className="bg-primary-500 p-6 rounded-full">
                <Users className="w-12 h-12 text-white" />
              </div>
            </div>
            
            <h3 className="text-3xl font-serif text-sage-600 mb-6">
              Formulário de Confirmação
            </h3>
            
            <p className="text-lg text-stone-600 mb-8 max-w-2xl mx-auto">
              Criamos um formulário especial para você confirmar sua presença de forma rápida e fácil. 
              Suas informações são importantes para organizarmos melhor nossa celebração.
            </p>
            
            <button
              onClick={handleGoToForm}
              className="inline-flex items-center space-x-3 bg-gradient-to-r from-primary-500 to-rose-500 text-white px-12 py-4 rounded-full font-semibold text-lg hover:from-primary-600 hover:to-rose-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Users className="w-6 h-6" />
              <span>Confirmar Presença</span>
              <ExternalLink className="w-5 h-5" />
            </button>
            
            <p className="text-sm text-stone-500 mt-4">
              Você será redirecionado para o Google Forms
            </p>
          </div>

          {/* Cards Informativos */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white rounded-lg p-6 text-center shadow-lg">
              <div className="bg-rose-100 p-3 rounded-full inline-flex mb-4">
                <Calendar className="w-6 h-6 text-primary-500" />
              </div>
              <h3 className="font-semibold text-sage-600 mb-2">Prazo de Confirmação</h3>
              <p className="text-stone-600">Até 15 de maio de 2026</p>
            </div>

            <div className="bg-white rounded-lg p-6 text-center shadow-lg">
              <div className="bg-rose-100 p-3 rounded-full inline-flex mb-4">
                <Users className="w-6 h-6 text-primary-500" />
              </div>
              <h3 className="font-semibold text-sage-600 mb-2">Confirmação Individual</h3>
              <p className="text-stone-600">Cada pessoa deve confirmar individualmente</p>
            </div>

            <div className="bg-white rounded-lg p-6 text-center shadow-lg">
              <div className="bg-rose-100 p-3 rounded-full inline-flex mb-4">
                <Music className="w-6 h-6 text-primary-500" />
              </div>
              <h3 className="font-semibold text-sage-600 mb-2">Festa até 2h</h3>
              <p className="text-stone-600">Música, dança e muita diversão</p>
            </div>
          </div>

          {/* Informações Importantes */}
          <div className="mt-12 bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-serif text-sage-600 mb-6 text-center">Informações Importantes</h3>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-semibold text-sage-600 mb-4 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-primary-500" />
                  Horários
                </h4>
                <div className="space-y-2 text-stone-600">
                  <p><strong>Cerimônia:</strong> 17:00</p>
                  <p><strong>Festa:</strong> 19:00 às 02:00</p>
                  <p><strong>Confirmação até:</strong> 15/05/2026</p>
                </div>
                
                <h4 className="text-lg font-semibold text-sage-600 mb-4 mt-6">Dress Code</h4>
                <p className="text-stone-600">
                  Traje social completo. Cores claras são bem-vindas, mas evitem branco total (reservado para a noiva).
                </p>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-sage-600 mb-4 flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-primary-500" />
                  Locais
                </h4>
                <div className="space-y-4 text-stone-600">
                  <div>
                    <p><strong>Cerimônia:</strong></p>
                    <p className="text-sm">Memorial da Beata Isabel Cristina</p>
                    <p className="text-sm">Barbacena - MG</p>
                  </div>
                  <div>
                    <p><strong>Festa:</strong></p>
                    <p className="text-sm">Espaço Villa Fontana</p>
                    <p className="text-sm">Barbacena - MG</p>
                  </div>
                </div>
                
                <h4 className="text-lg font-semibold text-sage-600 mb-4 mt-6">Estacionamento</h4>
                <p className="text-stone-600">
                  Ambos os locais possuem estacionamento gratuito para os convidados.
                </p>
              </div>
            </div>
          </div>

          {/* Dúvidas */}
          <div className="mt-8 bg-gradient-to-br from-rose-50 to-rose-100 rounded-2xl p-6 text-center">
            <h4 className="font-semibold text-sage-600 mb-2">Dúvidas?</h4>
            <p className="text-stone-600 mb-4">
              Entre em contato conosco pelos telefones:
            </p>
            <div className="flex flex-col md:flex-row justify-center space-y-2 md:space-y-0 md:space-x-6 text-stone-600">
              <p><strong>Kriscia:</strong> (32) 98419-5866</p>
              <p><strong>Iverson:</strong> (32) 98430-3090</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}