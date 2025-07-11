import React from 'react';
import { Gift, ExternalLink, Heart } from 'lucide-react';

export default function GiftList() {
  const handleGoToGiftList = () => {
    window.open('https://casamento-ux56.listaideal.com.br/pt', '_blank');
  };

  return (
    <section id="presentes" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif text-sage-600 mb-6">Lista de Presentes</h2>
          <p className="text-xl text-stone-600 max-w-2xl mx-auto">
            Sua presença é o maior presente, mas se quiser nos abençoar com um mimo, 
            preparamos uma lista especial
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Card Principal */}
          <div className="bg-gradient-to-br from-rose-50 to-rose-100 rounded-2xl p-12 shadow-xl text-center">
            <div className="flex justify-center mb-8">
              <div className="bg-primary-500 p-6 rounded-full">
                <Gift className="w-12 h-12 text-white" />
              </div>
            </div>
            
            <h3 className="text-3xl font-serif text-sage-600 mb-6">
              Nossa Lista de Presentes
            </h3>
            
            <p className="text-lg text-stone-600 mb-8 max-w-2xl mx-auto">
              Criamos uma lista especial com tudo que precisamos para começar nossa nova vida juntos. 
              Cada presente escolhido com carinho será uma lembrança eterna do nosso dia especial.
            </p>
            
            <button
              onClick={handleGoToGiftList}
              className="inline-flex items-center space-x-3 bg-gradient-to-r from-primary-500 to-rose-500 text-white px-12 py-4 rounded-full font-semibold text-lg hover:from-primary-600 hover:to-rose-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Gift className="w-6 h-6" />
              <span>Ver Lista de Presentes</span>
              <ExternalLink className="w-5 h-5" />
            </button>
            
            <p className="text-sm text-stone-500 mt-4">
              Você será redirecionado para nossa lista no Lista Ideal
            </p>
          </div>

          {/* Cards Informativos */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white rounded-lg p-6 text-center shadow-lg">
              <div className="bg-rose-100 p-3 rounded-full inline-flex mb-4">
                <Gift className="w-6 h-6 text-primary-500" />
              </div>
              <h3 className="font-semibold text-sage-600 mb-2">Presentes Especiais</h3>
              <p className="text-stone-600 text-sm">Itens escolhidos com carinho para nossa nova casa</p>
            </div>

            <div className="bg-white rounded-lg p-6 text-center shadow-lg">
              <div className="bg-rose-100 p-3 rounded-full inline-flex mb-4">
                <Heart className="w-6 h-6 text-primary-500" />
              </div>
              <h3 className="font-semibold text-sage-600 mb-2">Fácil e Seguro</h3>
              <p className="text-stone-600 text-sm">Compra online segura com entrega direta</p>
            </div>

            <div className="bg-white rounded-lg p-6 text-center shadow-lg">
              <div className="bg-rose-100 p-3 rounded-full inline-flex mb-4">
                <ExternalLink className="w-6 h-6 text-primary-500" />
              </div>
              <h3 className="font-semibold text-sage-600 mb-2">Lista Ideal</h3>
              <p className="text-stone-600 text-sm">Plataforma confiável e especializada</p>
            </div>
          </div>

          {/* Informações Adicionais */}
          <div className="mt-12 bg-gradient-to-br from-rose-50 to-rose-100 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-serif text-sage-600 mb-4">Outras Opções</h3>
            <p className="text-stone-600 mb-6">
              Preferem fazer um PIX ou contribuir de outra forma? Também ficamos muito gratos!
            </p>
            
            <div className="bg-white rounded-lg p-6 shadow-lg max-w-md mx-auto">
              <h4 className="font-semibold text-sage-600 mb-2">Dados para PIX:</h4>
              <p className="text-stone-600 mb-1">Nome: Iverson dos Santos de Paiva</p>
              <p className="text-stone-600 mb-1">Chave PIX: iverson.paiva11@gmail.com</p>
              <p className="text-stone-600">Banco: Mercado pago</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}